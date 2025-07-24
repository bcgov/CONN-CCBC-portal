-- Anonymize website URLs deterministically, even for invalid inputs
CREATE OR REPLACE FUNCTION ccbc_public.anonymize_website(website_text TEXT) RETURNS TEXT AS $$
DECLARE
    hash_text TEXT;
    protocol TEXT := '';
    subdomain TEXT := '';
    domain TEXT := '';
    tld TEXT := 'com'; -- Default TLD
    path TEXT := '';
    fake_subdomain TEXT := '';
    fake_domain TEXT := '';
    i INTEGER;
    hash_char CHAR;
    protocol_end INTEGER;
    domain_start INTEGER;
    path_start INTEGER;
    full_domain TEXT;
    domain_parts TEXT[];
BEGIN
    -- Return empty string for NULL or empty input
    IF website_text IS NULL OR TRIM(website_text) = '' THEN
        RETURN '';
    END IF;

    -- Trim leading/trailing whitespace
    website_text := TRIM(website_text);

    -- Generate a hash of the URL with a salt for deterministic output
    hash_text := MD5(website_text || 'ccbc_salt_test');

    -- Extract protocol if present
    IF website_text ~ '^https?://' THEN
        protocol_end := POSITION('://' IN website_text) + 2;
        protocol := SUBSTRING(website_text FROM 1 FOR protocol_end);
        domain_start := protocol_end + 1;
    ELSE
        protocol := '';
        domain_start := 1;
    END IF;

    -- Find start of path (first '/' after domain_start)
    path_start := POSITION('/' IN SUBSTRING(website_text FROM domain_start));
    IF path_start > 0 THEN
        path := SUBSTRING(website_text FROM domain_start + path_start - 1);
        path_start := domain_start + path_start - 1;
    ELSE
        path := '';
        path_start := LENGTH(website_text) + 1;
    END IF;

    -- Extract full domain (between protocol and path)
    full_domain := SUBSTRING(website_text FROM domain_start FOR path_start - domain_start);

    -- Split domain into parts (if possible)
    domain_parts := string_to_array(full_domain, '.');

    -- Handle domain parts
    IF array_length(domain_parts, 1) >= 2 THEN
        -- TLD is the last part
        tld := domain_parts[array_upper(domain_parts, 1)];
        -- Domain is the second-last part
        domain := domain_parts[array_upper(domain_parts, 1) - 1];
        -- Subdomain is everything before that (if present)
        IF array_length(domain_parts, 1) > 2 THEN
            subdomain := array_to_string(domain_parts[1:array_upper(domain_parts, 1) - 2], '.');
        END IF;
    ELSE
        -- Invalid or single-part domain (e.g., "localhost", "example")
        domain := full_domain;
        IF LENGTH(domain) = 0 THEN
            domain := 'domain';
        END IF;
    END IF;

    -- Generate fake subdomain (up to 10 characters)
    IF LENGTH(subdomain) > 0 THEN
        FOR i IN 1..LEAST(10, GREATEST(1, LENGTH(subdomain))) LOOP
            hash_char := SUBSTRING(hash_text FROM i FOR 1);
            fake_subdomain := fake_subdomain || (
                CASE
                    WHEN hash_char ~ '[0-9]' THEN hash_char
                    WHEN hash_char ~ '[a-f]' THEN CHR(ASCII('a') + (ASCII(hash_char) - ASCII('a')) % 26)
                    ELSE CHR(ASCII('a') + (ASCII(hash_char) % 26))
                END
            );
        END LOOP;
        fake_subdomain := fake_subdomain || '.';
    END IF;

    -- Generate fake domain (up to 15 characters)
    FOR i IN 1..LEAST(15, GREATEST(1, LENGTH(domain))) LOOP
        hash_char := SUBSTRING(hash_text FROM (i + 10) FOR 1);
        fake_domain := fake_domain || (
            CASE
                WHEN hash_char ~ '[0-9]' THEN hash_char
                WHEN hash_char ~ '[a-f]' THEN CHR(ASCII('a') + (ASCII(hash_char) - ASCII('a')) % 26)
                ELSE CHR(ASCII('a') + (ASCII(hash_char) % 26))
            END
        );
    END LOOP;

    -- Combine everything
    RETURN protocol || fake_subdomain || fake_domain || '.' || tld || path;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION ccbc_public.generate_lorem_ipsum(input_text text)
RETURNS text AS $$
DECLARE
  lorem_text text := 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  target_length integer;
  result_text text;
  last_space_pos integer;
BEGIN
  -- Calculate the length of the input text
  target_length := LENGTH(COALESCE(input_text, ''));

  -- If input is empty or null, return empty string
  IF target_length = 0 THEN
    RETURN '';
  END IF;

  -- Repeat the lorem text if the target length is longer than the lorem text
  WHILE LENGTH(lorem_text) < target_length LOOP
    lorem_text := lorem_text || ' ' || lorem_text;
  END LOOP;

  -- Trim to the target length
  result_text := SUBSTRING(lorem_text FROM 1 FOR target_length);

  -- Find the last space within the last 10 characters to avoid cutting off a word
  IF target_length > 10 THEN
    last_space_pos := POSITION(' ' IN REVERSE(SUBSTRING(result_text FROM target_length - 9 FOR 10)));
    IF last_space_pos > 0 THEN
      -- Adjust to trim at the last space, ensuring non-negative length
      result_text := SUBSTRING(result_text FROM 1 FOR GREATEST(target_length - (last_space_pos - 1), 1));
    END IF;
  END IF;

  RETURN TRIM(result_text);
END;
$$ LANGUAGE plpgsql;

-- Anonymize email addresses deterministically, even for invalid inputs
CREATE OR REPLACE FUNCTION ccbc_public.anonymize_email(email_text TEXT) RETURNS TEXT AS $$
DECLARE
    hash_text TEXT;
    local_part TEXT;
    domain_part TEXT;
    fake_local TEXT := '';
    fake_domain TEXT := '';
    i INTEGER;
    hash_char CHAR;
    at_pos INTEGER;
BEGIN
    -- Return empty string for NULL or empty input
    IF email_text IS NULL OR TRIM(email_text) = '' THEN
        RETURN '';
    END IF;

    -- Generate a hash of the input with a salt for deterministic output
    hash_text := MD5(email_text || 'ccbc_salt_test');

    -- Check for @ symbol to split into local part and domain
    at_pos := POSITION('@' IN TRIM(email_text));
    IF at_pos > 0 THEN
        local_part := SUBSTRING(TRIM(email_text) FROM 1 FOR at_pos - 1);
        domain_part := SUBSTRING(TRIM(email_text) FROM at_pos + 1);
    ELSE
        -- Treat entire input as local part, use default domain
        local_part := TRIM(email_text);
        domain_part := 'domain.ca';
    END IF;

    -- Generate fake local part (up to 16 characters, alphanumeric)
    FOR i IN 1..LEAST(16, GREATEST(1, LENGTH(local_part))) LOOP
        hash_char := SUBSTRING(hash_text FROM i FOR 1);
        fake_local := fake_local || (
            CASE
                WHEN hash_char ~ '[0-9]' THEN hash_char
                WHEN hash_char ~ '[a-f]' THEN CHR(ASCII('a') + (ASCII(hash_char) - ASCII('a')) % 26)
                ELSE CHR(ASCII('a') + (ASCII(hash_char) % 26))
            END
        );
    END LOOP;

    -- Generate fake domain (before the last dot, up to 15 characters, alphanumeric)
    FOR i IN 1..LEAST(15, GREATEST(1, LENGTH(domain_part) - LENGTH(SPLIT_PART(domain_part, '.', -1)) - 1)) LOOP
        hash_char := SUBSTRING(hash_text FROM (i + 16) FOR 1);
        fake_domain := fake_domain || (
            CASE
                WHEN hash_char ~ '[0-9]' THEN hash_char
                WHEN hash_char ~ '[a-f]' THEN CHR(ASCII('a') + (ASCII(hash_char) - ASCII('a')) % 26)
                ELSE CHR(ASCII('a') + (ASCII(hash_char) % 26))
            END
        );
    END LOOP;

    -- Use original TLD if available, else default to .ca
    RETURN fake_local || '@' || fake_domain || '.' || COALESCE(SPLIT_PART(domain_part, '.', -1), 'ca');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION ccbc_public.obfuscate_company_name(input_name TEXT)
RETURNS TEXT AS $$
DECLARE
    hash TEXT;
    prefix TEXT;
    root TEXT;
    suffix TEXT;
    prefixes TEXT[] := ARRAY['Tech', 'Global', 'Nex', 'Inno', 'Core', 'Sky', 'Bright', 'Nova', 'Alpha', 'Vita'];
    roots TEXT[] := ARRAY['sys', 'tron', 'link', 'wave', 'soft', 'gen', 'peak', 'flow', 'star', 'path'];
    suffixes TEXT[] := ARRAY['Inc', 'Corp', 'Solutions', 'Systems', 'Group', 'Tech', 'LLC', 'Partners', 'Labs', 'Co'];
    prefix_idx INT;
    root_idx INT;
    suffix_idx INT;
BEGIN
    -- Generate MD5 hash of the input (lowercase to ensure consistency)
    hash := MD5(LOWER(input_name));

    -- Convert parts of the hash to integers for deterministic selection
    prefix_idx := 16 * POSITION(SUBSTRING(hash FROM 1 FOR 1) IN '0123456789abcdef') % ARRAY_LENGTH(prefixes, 1) + 1;
    root_idx := 16 * POSITION(SUBSTRING(hash FROM 2 FOR 1) IN '0123456789abcdef') % ARRAY_LENGTH(roots, 1) + 1;
    suffix_idx := 16 * POSITION(SUBSTRING(hash FROM 3 FOR 1) IN '0123456789abcdef') % ARRAY_LENGTH(suffixes, 1) + 1;

    -- Select words based on indices
    prefix := prefixes[prefix_idx];
    root := roots[root_idx];
    suffix := suffixes[suffix_idx];

    -- Combine to form a company-like name
    RETURN prefix || root || ' ' || suffix;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION ccbc_public.anonymize_phone_number(phone_text TEXT)
RETURNS TEXT AS $$
DECLARE
    hash_text TEXT;
    numeric_digits TEXT := '';
    result TEXT := '';
    format TEXT := '+1 (XXX) XXX-XXXX';
    digit_pos INTEGER[] := ARRAY[4, 6, 7, 8, 10, 11, 12, 14, 15, 16, 17];
    i INTEGER;
    hash_char CHAR;
BEGIN
    -- Handle NULL or empty input
    IF phone_text IS NULL OR TRIM(phone_text) = '' THEN
        RETURN '+1 (XXX) XXX-XXXX';
    END IF;

    -- Generate a hash of the phone number with a salt, with fallback for NULL
    hash_text := MD5(COALESCE(phone_text, 'unknown') || 'ccbc_salt_test');

    -- Convert hash to numeric digits (0-9)
    FOR i IN 1..LENGTH(hash_text) LOOP
        hash_char := SUBSTRING(hash_text FROM i FOR 1);
        numeric_digits := numeric_digits || (
            CASE
                WHEN hash_char ~ '[0-9]' THEN hash_char::INTEGER
                WHEN hash_char = 'a' THEN 0
                WHEN hash_char = 'b' THEN 1
                WHEN hash_char = 'c' THEN 2
                WHEN hash_char = 'd' THEN 3
                WHEN hash_char = 'e' THEN 4
                WHEN hash_char = 'f' THEN 5
                ELSE (ASCII(hash_char) % 10)
            END
        )::TEXT;
    END LOOP;

    -- Ensure numeric_digits has enough characters (pad with '0' if needed)
    WHILE LENGTH(numeric_digits) < array_length(digit_pos, 1) LOOP
        numeric_digits := numeric_digits || '0';
    END LOOP;

    -- Build the phone number using the format
    FOR i IN 1..LENGTH(format) LOOP
        IF i = ANY(digit_pos) THEN
            result := result || SUBSTRING(numeric_digits FROM array_position(digit_pos, i) FOR 1);
        ELSE
            result := result || SUBSTRING(format FROM i FOR 1);
        END IF;
    END LOOP;

    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        -- RAISE NOTICE 'Error in anonymize_phone_number: %', SQLERRM;
        RETURN '+1 (XXX) XXX-XXXX';
END;
$$ LANGUAGE plpgsql;

-- Anonymize project titles deterministically
CREATE OR REPLACE FUNCTION ccbc_public.anonymize_project_title(project_title TEXT) RETURNS TEXT AS $$
DECLARE
    hash_text TEXT;
    fake_title TEXT := 'Connecting ';
    i INTEGER;
    hash_char CHAR;
BEGIN
    -- Return empty string for NULL or empty input
    IF project_title IS NULL OR TRIM(project_title) = '' THEN
        RETURN '';
    END IF;

    -- Generate a hash of the input with a salt for deterministic output
    hash_text := MD5(project_title || 'ccbc_salt_test');

    -- Generate fake title suffix (up to 15 characters, alphanumeric)
    FOR i IN 1..LEAST(15, GREATEST(1, LENGTH(project_title))) LOOP
        hash_char := SUBSTRING(hash_text FROM i FOR 1);
        fake_title := fake_title || (
            CASE
                WHEN hash_char ~ '[0-9]' THEN hash_char
                WHEN hash_char ~ '[a-f]' THEN CHR(ASCII('A') + (ASCII(hash_char) - ASCII('a')) % 26)
                ELSE CHR(ASCII('A') + (ASCII(hash_char) % 26))
            END
        );
    END LOOP;

    RETURN fake_title;
END;
$$ LANGUAGE plpgsql;

-- Function to anonymize filenames in arrays under specific keys, preserving other keys
CREATE OR REPLACE FUNCTION ccbc_public.anonymize_filenames(
  input_jsonb jsonb
) RETURNS jsonb AS $$
DECLARE
  result_jsonb jsonb := '{}'::jsonb;
  key_name text;
  array_name text;
  array_element jsonb;
  new_array jsonb;
  nested_object jsonb;
  index int;
BEGIN
  -- Copy all keys, processing only target keys
  FOR key_name IN SELECT jsonb_object_keys(input_jsonb) LOOP
    IF key_name IN ('coverage', 'templateUploads', 'supportingDocuments', 'rfiAdditionalFiles', 'rfiEmailCorrespondance', 'progressReportFile', 'milestoneFile', 'claimsFile','letterOfApproval', 'sowWirelessUpload', 'finalizedMapUpload', 'fundingAgreementUpload', 'statementOfWorkUpload') THEN
      -- Case 1: Key contains an array of objects
      IF jsonb_typeof(input_jsonb->key_name) = 'array' THEN
        new_array := '[]'::jsonb;
        FOR index, array_element IN
          SELECT idx, elem
          FROM jsonb_array_elements(input_jsonb->key_name) WITH ORDINALITY AS t(elem, idx)
        LOOP
          IF array_element ? 'name' THEN
            new_array := new_array || jsonb_set(
              array_element,
              ARRAY['name'],
              to_jsonb(key_name || '-' || (index)::text)
            );
          ELSE
            new_array := new_array || array_element;
          END IF;
        END LOOP;
        result_jsonb := jsonb_set(
          result_jsonb,
          ARRAY[key_name],
          new_array
        );
      -- Case 2: Key contains an object with arrays
      ELSIF jsonb_typeof(input_jsonb->key_name) = 'object' THEN
        nested_object := '{}'::jsonb;
        -- Iterate over keys in the nested object
        FOR array_name IN SELECT jsonb_object_keys(input_jsonb->key_name) LOOP
          IF jsonb_typeof(input_jsonb->key_name->array_name) = 'array' THEN
            new_array := '[]'::jsonb;
            FOR index, array_element IN
              SELECT idx, elem
              FROM jsonb_array_elements(input_jsonb->key_name->array_name) WITH ORDINALITY AS t(elem, idx)
            LOOP
              IF array_element ? 'name' THEN
                new_array := new_array || jsonb_set(
                  array_element,
                  ARRAY['name'],
                  to_jsonb(array_name || '-' || (index)::text)
                );
              ELSE
                new_array := new_array || array_element;
              END IF;
            END LOOP;
            nested_object := jsonb_set(
              nested_object,
              ARRAY[array_name],
              new_array
            );
          ELSE
            -- Copy non-array keys unchanged
            nested_object := jsonb_set(
              nested_object,
              ARRAY[array_name],
              input_jsonb->key_name->array_name
            );
          END IF;
        END LOOP;
        result_jsonb := jsonb_set(
          result_jsonb,
          ARRAY[key_name],
          nested_object
        );
      ELSE
        -- Copy non-array/object target keys unchanged
        result_jsonb := jsonb_set(
          result_jsonb,
          ARRAY[key_name],
          input_jsonb->key_name
        );
      END IF;
    ELSE
      -- Copy non-target keys unchanged
      result_jsonb := jsonb_set(
        result_jsonb,
        ARRAY[key_name],
        input_jsonb->key_name
      );
    END IF;
  END LOOP;
  RETURN result_jsonb;
END;
$$ LANGUAGE plpgsql;

-- Function to hash a string and map to a decimal value
CREATE OR REPLACE FUNCTION ccbc_public.hash_string(
  input_text text
) RETURNS numeric AS $$
DECLARE
  hash_value numeric;
BEGIN
  IF input_text IS NULL OR input_text = '' THEN
    -- RAISE NOTICE 'hash_string: input_text is NULL or empty, returning default value';
    RETURN ROUND(0.1 * 12345.67, 2); -- Default value if input is NULL or empty
  END IF;
  -- Use md5, take first 8 characters, convert hex to int, modulo 5, map to 0.1 to 0.5, multiply by 12345.67, round to 2 decimals
  BEGIN
    hash_value := ROUND((
      CASE (('x' || substring(md5(input_text) FROM 1 FOR 8))::bit(32)::int % 5)
        WHEN 0 THEN 0.1
        WHEN 1 THEN 0.2
        WHEN 2 THEN 0.3
        WHEN 3 THEN 0.4
        WHEN 4 THEN 0.5
      END
    ) * 12345.67, 2);

    -- Check if hash_value is NULL and assign default if needed
    IF hash_value IS NULL THEN
      hash_value := ROUND(0.1 * 12345.67, 2);
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- RAISE NOTICE 'hash_string: error processing input_text "%", returning default value: %', input_text, SQLERRM;
    RETURN ROUND(0.1 * 12345.67, 2); -- Default value on error
  END;
  -- RAISE NOTICE 'hash_string: successfully processed "%", returning %', input_text, hash_value;
  RETURN hash_value;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Generic function to anonymize numeric fields by adding a hash-derived value
CREATE OR REPLACE FUNCTION ccbc_public.anonymize_numeric_fields(
  input_jsonb jsonb,
  target_fields text[]
) RETURNS jsonb AS $$
DECLARE
  result_jsonb jsonb := input_jsonb;
  hash_value numeric;
  field_path text;
  array_path text[];
  field_name text;
  array_element jsonb;
  new_array jsonb;
  index int;
  field_value numeric;
BEGIN
  -- Return input unchanged if NULL or missing projectInformation/projectTitle
  IF input_jsonb IS NULL OR NOT (input_jsonb ? 'projectInformation') OR NOT (input_jsonb->'projectInformation' ? 'projectTitle') THEN
    -- RAISE NOTICE 'Skipping row: input_jsonb is NULL or missing projectInformation/projectTitle';
    RETURN input_jsonb;
  END IF;

  -- Get hash value from projectTitle
  hash_value := ccbc_public.hash_string(input_jsonb->'projectInformation'->>'projectTitle');
  -- RAISE NOTICE 'Hash value for projectTitle: %', hash_value;

  -- Skip processing if hash_value is NULL
  IF hash_value IS NULL THEN
    -- RAISE NOTICE 'Skipping row: hash_value is NULL';
    RETURN input_jsonb;
  END IF;

  -- Process each target field path
  FOREACH field_path IN ARRAY target_fields LOOP
    -- Split path into components
    array_path := string_to_array(field_path, ',');
    field_name := array_path[array_length(array_path, 1)];
    -- RAISE NOTICE 'Processing field path: %', field_path;

    -- Case 1: Field is in an array (otherFundingSources->otherFundingSourcesArray->field)
    IF array_path[1] = 'otherFundingSources' AND array_path[2] = 'otherFundingSourcesArray' THEN
      IF input_jsonb ? 'otherFundingSources' AND input_jsonb->'otherFundingSources' ? 'otherFundingSourcesArray' AND input_jsonb->'otherFundingSources'->>'otherFundingSources' = 'true' THEN
        new_array := '[]'::jsonb;
        FOR index, array_element IN
          SELECT idx, elem
          FROM jsonb_array_elements(input_jsonb->'otherFundingSources'->'otherFundingSourcesArray') WITH ORDINALITY AS t(elem, idx)
        LOOP
          IF array_element ? field_name AND jsonb_typeof(array_element->field_name) = 'number' THEN
            BEGIN
              field_value := (array_element->>field_name)::numeric;
              new_array := new_array || jsonb_set(
                array_element,
                ARRAY[field_name],
                to_jsonb(field_value + hash_value),
                false
              );
              -- RAISE NOTICE 'Updated array field %: % + % = %', field_name, field_value, hash_value, field_value + hash_value;
            EXCEPTION WHEN OTHERS THEN
              -- RAISE NOTICE 'Skipping array field % due to error: %', field_name, SQLERRM;
              new_array := new_array || array_element;
            END;
          ELSE
            new_array := new_array || array_element;
            -- RAISE NOTICE 'Skipping array field %: not present or not numeric', field_name;
          END IF;
        END LOOP;
        result_jsonb := jsonb_set(
          result_jsonb,
          ARRAY['otherFundingSources', 'otherFundingSourcesArray'],
          new_array,
          false
        );
      END IF;
    -- Case 2: Field is a direct numeric field
    ELSE
      IF array_path[1] = 'otherFundingSources' AND input_jsonb ? 'otherFundingSources' AND input_jsonb->'otherFundingSources' ? field_name AND jsonb_typeof(input_jsonb->'otherFundingSources'->field_name) = 'number' THEN
        BEGIN
          field_value := (input_jsonb->'otherFundingSources'->>field_name)::numeric;
          result_jsonb := jsonb_set(
            result_jsonb,
            ARRAY['otherFundingSources', field_name],
            to_jsonb(field_value + hash_value),
            false
          );
          -- RAISE NOTICE 'Updated field %: % + % = %', field_name, field_value, hash_value, field_value + hash_value;
        EXCEPTION WHEN OTHERS THEN
          -- RAISE NOTICE 'Skipping field % due to error: %', field_name, SQLERRM;
        END;
      ELSIF array_path[1] = 'projectFunding' AND input_jsonb ? 'projectFunding' AND input_jsonb->'projectFunding' ? field_name AND jsonb_typeof(input_jsonb->'projectFunding'->field_name) = 'number' THEN
        BEGIN
          field_value := (input_jsonb->'projectFunding'->>field_name)::numeric;
          result_jsonb := jsonb_set(
            result_jsonb,
            ARRAY['projectFunding', field_name],
            to_jsonb(field_value + hash_value),
            false
          );
          -- RAISE NOTICE 'Updated field %: % + % = %', field_name, field_value, hash_value, field_value + hash_value;
        EXCEPTION WHEN OTHERS THEN
          -- RAISE NOTICE 'Skipping field % due to error: %', field_name, SQLERRM;
        END;
      ELSIF array_path[1] = 'budgetDetails' AND input_jsonb ? 'budgetDetails' AND input_jsonb->'budgetDetails' ? field_name AND jsonb_typeof(input_jsonb->'budgetDetails'->field_name) = 'number' THEN
        BEGIN
          field_value := (input_jsonb->'budgetDetails'->>field_name)::numeric;
          result_jsonb := jsonb_set(
            result_jsonb,
            ARRAY['budgetDetails', field_name],
            to_jsonb(field_value + hash_value),
            false
          );
          -- RAISE NOTICE 'Updated field %: % + % = %', field_name, field_value, hash_value, field_value + hash_value;
        EXCEPTION WHEN OTHERS THEN
          -- RAISE NOTICE 'Skipping field % due to error: %', field_name, SQLERRM;
        END;
      ELSE
        -- RAISE NOTICE 'Skipping field %: not present or not numeric', field_name;
      END IF;
    END IF;
  END LOOP;

  -- Ensure result is not NULL
  IF result_jsonb IS NULL THEN
    -- RAISE NOTICE 'result_jsonb is NULL, returning input_jsonb';
    RETURN input_jsonb;
  END IF;

  RETURN result_jsonb;
END;
$$ LANGUAGE plpgsql;

-- Specialized function for anonymizing sow_tab_7 numeric fields
CREATE OR REPLACE FUNCTION ccbc_public.anonymize_sow_tab_7_numeric_fields(
  input_jsonb jsonb,
  sow_tab_7_id integer,
  target_fields text[]
) RETURNS jsonb AS $$
DECLARE
  result_jsonb jsonb := input_jsonb;
  hash_value numeric;
  field_path text;
  array_path text[];
  field_name text;
  array_element jsonb;
  new_array jsonb;
  index int;
  field_value numeric;
  project_title text;
BEGIN
  -- Return input unchanged if NULL
  IF input_jsonb IS NULL THEN
    -- RAISE NOTICE 'Skipping row: input_jsonb is NULL';
    RETURN input_jsonb;
  END IF;

  -- Generate project title based on sow_tab_7 id
  project_title := 'SOW TAB 7 ID ' || sow_tab_7_id::text;

  -- Get hash value from generated project title
  hash_value := ccbc_public.hash_string(project_title);
  -- RAISE NOTICE 'Hash value for project title "%": %', project_title, hash_value;

  -- Skip processing if hash_value is NULL
  IF hash_value IS NULL THEN
    -- RAISE NOTICE 'Skipping row: hash_value is NULL';
    RETURN input_jsonb;
  END IF;

  -- Process each target field path
  FOREACH field_path IN ARRAY target_fields LOOP
    -- Split path into components
    array_path := string_to_array(field_path, ',');
    field_name := array_path[array_length(array_path, 1)];
    -- RAISE NOTICE 'Processing field path: %', field_path;

    -- Handle nested fields based on the JSON structure
    IF array_length(array_path, 1) = 1 THEN
      -- Direct field (e.g., 'fieldName')
      IF input_jsonb ? field_name AND jsonb_typeof(input_jsonb->field_name) = 'number' THEN
        BEGIN
          field_value := (input_jsonb->>field_name)::numeric;
          -- Skip numbers between 0 and 1 (exclusive)
          IF field_value > 0 AND field_value < 1 THEN
            -- RAISE NOTICE 'Skipping field % with value % (between 0 and 1)', field_name, field_value;
          ELSE
            result_jsonb := jsonb_set(
              result_jsonb,
              ARRAY[field_name],
              to_jsonb(field_value + hash_value),
              false
            );
            -- RAISE NOTICE 'Updated field %: % + % = %', field_name, field_value, hash_value, field_value + hash_value;
          END IF;
        EXCEPTION WHEN OTHERS THEN
          -- RAISE NOTICE 'Skipping field % due to error: %', field_name, SQLERRM;
        END;
      ELSE
        -- RAISE NOTICE 'Skipping field %: not present or not numeric', field_name;
      END IF;
    ELSIF array_length(array_path, 1) = 2 THEN
      -- Two-level nested field (e.g., 'parent,child')
      IF input_jsonb ? array_path[1] AND input_jsonb->array_path[1] ? field_name AND jsonb_typeof(input_jsonb->array_path[1]->field_name) = 'number' THEN
        BEGIN
          field_value := (input_jsonb->array_path[1]->>field_name)::numeric;
          -- Skip numbers between 0 and 1 (exclusive)
          IF field_value > 0 AND field_value < 1 THEN
            -- RAISE NOTICE 'Skipping field %.% with value % (between 0 and 1)', array_path[1], field_name, field_value;
          ELSE
            result_jsonb := jsonb_set(
              result_jsonb,
              ARRAY[array_path[1], field_name],
              to_jsonb(field_value + hash_value),
              false
            );
            -- RAISE NOTICE 'Updated field %.%: % + % = %', array_path[1], field_name, field_value, hash_value, field_value + hash_value;
          END IF;
        EXCEPTION WHEN OTHERS THEN
          -- RAISE NOTICE 'Skipping field %.% due to error: %', array_path[1], field_name, SQLERRM;
        END;
      ELSE
        -- RAISE NOTICE 'Skipping field %.%: not present or not numeric', array_path[1], field_name;
      END IF;
    ELSIF array_length(array_path, 1) = 3 THEN
      -- Three-level nested field (e.g., 'parent,child,grandchild')
      IF input_jsonb ? array_path[1] AND input_jsonb->array_path[1] ? array_path[2] THEN
        -- Handle arrays
        IF array_path[2] = 'otherFundingPartners' AND jsonb_typeof(input_jsonb->array_path[1]->array_path[2]) = 'array' THEN
          new_array := '[]'::jsonb;
          FOR index, array_element IN
            SELECT idx, elem
            FROM jsonb_array_elements(input_jsonb->array_path[1]->array_path[2]) WITH ORDINALITY AS t(elem, idx)
          LOOP
            IF array_element ? field_name AND jsonb_typeof(array_element->field_name) = 'number' THEN
              BEGIN
                field_value := (array_element->>field_name)::numeric;
                -- Skip numbers between 0 and 1 (exclusive)
                IF field_value > 0 AND field_value < 1 THEN
                  -- RAISE NOTICE 'Skipping array field % with value % (between 0 and 1)', field_name, field_value;
                  new_array := new_array || array_element;
                ELSE
                  new_array := new_array || jsonb_set(
                    array_element,
                    ARRAY[field_name],
                    to_jsonb(field_value + hash_value),
                    false
                  );
                  -- RAISE NOTICE 'Updated array field %: % + % = %', field_name, field_value, hash_value, field_value + hash_value;
                END IF;
              EXCEPTION WHEN OTHERS THEN
                -- RAISE NOTICE 'Skipping array field % due to error: %', field_name, SQLERRM;
                new_array := new_array || array_element;
              END;
            ELSE
              new_array := new_array || array_element;
              -- RAISE NOTICE 'Skipping array field %: not present or not numeric', field_name;
            END IF;
          END LOOP;
          result_jsonb := jsonb_set(
            result_jsonb,
            ARRAY[array_path[1], array_path[2]],
            new_array,
            false
          );
        -- Handle regular nested objects
        ELSIF input_jsonb->array_path[1]->array_path[2] ? field_name AND jsonb_typeof(input_jsonb->array_path[1]->array_path[2]->field_name) = 'number' THEN
          BEGIN
            field_value := (input_jsonb->array_path[1]->array_path[2]->>field_name)::numeric;
            -- Skip numbers between 0 and 1 (exclusive)
            IF field_value > 0 AND field_value < 1 THEN
              -- RAISE NOTICE 'Skipping field %.%.% with value % (between 0 and 1)', array_path[1], array_path[2], field_name, field_value;
            ELSE
              result_jsonb := jsonb_set(
                result_jsonb,
                ARRAY[array_path[1], array_path[2], field_name],
                to_jsonb(field_value + hash_value),
                false
              );
              -- RAISE NOTICE 'Updated field %.%.%: % + % = %', array_path[1], array_path[2], field_name, field_value, hash_value, field_value + hash_value;
            END IF;
          EXCEPTION WHEN OTHERS THEN
            -- RAISE NOTICE 'Skipping field %.%.% due to error: %', array_path[1], array_path[2], field_name, SQLERRM;
          END;
        ELSE
          -- RAISE NOTICE 'Skipping field %.%.%: not present or not numeric', array_path[1], array_path[2], field_name;
        END IF;
      ELSE
        -- RAISE NOTICE 'Skipping field %.%.%: parent path not present', array_path[1], array_path[2], field_name;
      END IF;
    ELSIF array_length(array_path, 1) = 4 THEN
      -- Four-level nested field (e.g., 'parent,child,grandchild,field')
      IF input_jsonb ? array_path[1] AND input_jsonb->array_path[1] ? array_path[2] AND input_jsonb->array_path[1]->array_path[2] ? array_path[3] AND input_jsonb->array_path[1]->array_path[2]->array_path[3] ? field_name AND jsonb_typeof(input_jsonb->array_path[1]->array_path[2]->array_path[3]->field_name) = 'number' THEN
        BEGIN
          field_value := (input_jsonb->array_path[1]->array_path[2]->array_path[3]->>field_name)::numeric;
          -- Skip numbers between 0 and 1 (exclusive)
          IF field_value > 0 AND field_value < 1 THEN
            -- RAISE NOTICE 'Skipping field %.%.%.% with value % (between 0 and 1)', array_path[1], array_path[2], array_path[3], field_name, field_value;
          ELSE
            result_jsonb := jsonb_set(
              result_jsonb,
              ARRAY[array_path[1], array_path[2], array_path[3], field_name],
              to_jsonb(field_value + hash_value),
              false
            );
            -- RAISE NOTICE 'Updated field %.%.%.%: % + % = %', array_path[1], array_path[2], array_path[3], field_name, field_value, hash_value, field_value + hash_value;
          END IF;
        EXCEPTION WHEN OTHERS THEN
          -- RAISE NOTICE 'Skipping field %.%.%.% due to error: %', array_path[1], array_path[2], array_path[3], field_name, SQLERRM;
        END;
      ELSE
        -- RAISE NOTICE 'Skipping field %.%.%.%: not present or not numeric', array_path[1], array_path[2], array_path[3], field_name;
      END IF;
    ELSE
      -- RAISE NOTICE 'Skipping field %: unsupported nesting level', field_path;
    END IF;
  END LOOP;

  -- Ensure result is not NULL
  IF result_jsonb IS NULL THEN
    -- RAISE NOTICE 'result_jsonb is NULL, returning input_jsonb';
    RETURN input_jsonb;
  END IF;

  RETURN result_jsonb;
END;
$$ LANGUAGE plpgsql;

-- Function to anonymize conditional_approval_data numeric fields in JSON data
CREATE OR REPLACE FUNCTION ccbc_public.anonymize_conditional_approval_data_numeric_fields(
  input_jsonb JSONB,
  record_id INTEGER,
  field_paths TEXT[]
) RETURNS JSONB AS $$
DECLARE
  result_jsonb JSONB;
  field_path TEXT;
  array_path TEXT[];
  hash_value DECIMAL;
  field_value DECIMAL;
  field_name TEXT;
BEGIN
  -- Initialize result with input
  result_jsonb := input_jsonb;

  -- Return input if NULL
  IF input_jsonb IS NULL THEN
    -- RAISE NOTICE 'Input JSONB is NULL, returning NULL';
    RETURN input_jsonb;
  END IF;

  -- RAISE NOTICE 'Starting anonymization for conditional_approval_data record ID: %', record_id;

  -- Process each field path
  FOREACH field_path IN ARRAY field_paths
  LOOP
    -- RAISE NOTICE 'Processing field path: %', field_path;

    -- Split the field path by commas
    array_path := string_to_array(field_path, ',');

    -- Handle different nesting levels
    IF array_length(array_path, 1) = 2 THEN
      -- Two-level nesting: level1,field
      field_name := array_path[2];

      IF result_jsonb ? array_path[1] AND
         (result_jsonb -> array_path[1]) ? field_name AND
         jsonb_typeof(result_jsonb -> array_path[1] -> field_name) = 'number' THEN

        BEGIN
          field_value := (result_jsonb -> array_path[1] ->> field_name)::DECIMAL;

          -- Skip ratios (values between 0 and 1)
          IF field_value >= 0 AND field_value <= 1 THEN
            -- RAISE NOTICE 'Skipping field %.%: value % appears to be a ratio', array_path[1], field_name, field_value;
          ELSE
            hash_value := ccbc_public.hash_string('Conditional Approval ID ' || record_id::TEXT || field_path || field_value::TEXT);
            result_jsonb := jsonb_set(
              result_jsonb,
              ARRAY[array_path[1], field_name],
              to_jsonb(field_value + hash_value),
              false
            );
            -- RAISE NOTICE 'Updated field %.%: % + % = %', array_path[1], field_name, field_value, hash_value, field_value + hash_value;
          END IF;
        EXCEPTION WHEN OTHERS THEN
          -- RAISE NOTICE 'Skipping field %.% due to error: %', array_path[1], field_name, SQLERRM;
        END;
      ELSE
        -- RAISE NOTICE 'Skipping field %.%: not present or not numeric', array_path[1], field_name;
      END IF;
    ELSE
      -- RAISE NOTICE 'Skipping field %: unsupported nesting level for conditional_approval_data', field_path;
    END IF;
  END LOOP;

  -- Ensure result is not NULL
  IF result_jsonb IS NULL THEN
    -- RAISE NOTICE 'result_jsonb is NULL, returning input_jsonb';
    RETURN input_jsonb;
  END IF;

  RETURN result_jsonb;
END;
$$ LANGUAGE plpgsql;

-- Function to anonymize cbc_data numeric fields in JSON data
CREATE OR REPLACE FUNCTION ccbc_public.anonymize_cbc_data_numeric_fields(
  input_jsonb JSONB,
  record_id INTEGER,
  field_paths TEXT[]
) RETURNS JSONB AS $$
DECLARE
  result_jsonb JSONB;
  field_path TEXT;
  hash_value DECIMAL;
  field_value DECIMAL;
BEGIN
  -- Initialize result with input
  result_jsonb := input_jsonb;

  -- Return input if NULL
  IF input_jsonb IS NULL THEN
    -- RAISE NOTICE 'Input JSONB is NULL, returning NULL';
    RETURN input_jsonb;
  END IF;

  -- RAISE NOTICE 'Starting anonymization for cbc_data record ID: %', record_id;

  -- Process each field path
  FOREACH field_path IN ARRAY field_paths
  LOOP
    -- RAISE NOTICE 'Processing field path: %', field_path;

    -- Handle top-level fields
    IF result_jsonb ? field_path AND
       jsonb_typeof(result_jsonb -> field_path) = 'number' THEN

      BEGIN
        field_value := (result_jsonb ->> field_path)::DECIMAL;

        -- Skip ratios (values between 0 and 1)
        IF field_value >= 0 AND field_value <= 1 THEN
          -- RAISE NOTICE 'Skipping field %: value % appears to be a ratio', field_path, field_value;
        ELSE
          DECLARE
            hash_input TEXT;
          BEGIN
            hash_input := 'CBC Data ID ' || COALESCE(record_id::TEXT, '0') || field_path || COALESCE(field_value::TEXT, '0');
            -- RAISE NOTICE 'Calling hash_string with input: "%"', hash_input;
            hash_value := ccbc_public.hash_string(hash_input);
            -- RAISE NOTICE 'Hash value for CBC Data ID % field % value %: %', record_id, field_path, field_value, hash_value;
          END;
          result_jsonb := jsonb_set(
            result_jsonb,
            ARRAY[field_path],
            to_jsonb(field_value + hash_value),
            false
          );
          -- RAISE NOTICE 'Updated field %: % + % = %', field_path, field_value, hash_value, field_value + hash_value;
        END IF;
      EXCEPTION WHEN OTHERS THEN
        -- RAISE NOTICE 'Skipping field % due to error: %', field_path, SQLERRM;
      END;
    ELSE
      -- RAISE NOTICE 'Skipping field %: not present or not numeric', field_path;
    END IF;
  END LOOP;

  -- Calculate totalProjectBudget as sum of other fields
  DECLARE
    bc_funding DECIMAL := 0;
    federal_funding DECIMAL := 0;
    applicant_amount DECIMAL := 0;
    other_funding DECIMAL := 0;
    total_budget DECIMAL;
  BEGIN
    -- Get anonymized values, treating NULL as 0
    IF result_jsonb ? 'bcFundingRequested' AND jsonb_typeof(result_jsonb -> 'bcFundingRequested') = 'number' THEN
      bc_funding := COALESCE((result_jsonb ->> 'bcFundingRequested')::DECIMAL, 0);
    END IF;

    IF result_jsonb ? 'federalFundingRequested' AND jsonb_typeof(result_jsonb -> 'federalFundingRequested') = 'number' THEN
      federal_funding := COALESCE((result_jsonb ->> 'federalFundingRequested')::DECIMAL, 0);
    END IF;

    IF result_jsonb ? 'applicantAmount' AND jsonb_typeof(result_jsonb -> 'applicantAmount') = 'number' THEN
      applicant_amount := COALESCE((result_jsonb ->> 'applicantAmount')::DECIMAL, 0);
    END IF;

    IF result_jsonb ? 'otherFundingRequested' AND jsonb_typeof(result_jsonb -> 'otherFundingRequested') = 'number' THEN
      other_funding := COALESCE((result_jsonb ->> 'otherFundingRequested')::DECIMAL, 0);
    END IF;

    -- Calculate total
    total_budget := bc_funding + federal_funding + applicant_amount + other_funding;

    -- Set totalProjectBudget to the calculated sum
    result_jsonb := jsonb_set(
      result_jsonb,
      ARRAY['totalProjectBudget'],
      to_jsonb(total_budget),
      true
    );

    -- RAISE NOTICE 'Calculated totalProjectBudget: % + % + % + % = %', bc_funding, federal_funding, applicant_amount, other_funding, total_budget;
  END;

  -- Ensure result is not NULL
  IF result_jsonb IS NULL THEN
    -- RAISE NOTICE 'result_jsonb is NULL, returning input_jsonb';
    RETURN input_jsonb;
  END IF;

  RETURN result_jsonb;
END;
$$ LANGUAGE plpgsql;
