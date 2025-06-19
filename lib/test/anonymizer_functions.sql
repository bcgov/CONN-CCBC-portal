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
    hash_text := MD5(COALESCE(phone_text, 'unknown') || 'some_salt');

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
        RAISE NOTICE 'Error in anonymize_phone_number: %', SQLERRM;
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
