-- Step 1: Drop the table if exists
DROP TABLE IF EXISTS ccbc_public.application_er;

-- Step 2: Create the table explicitly with application_id as the primary key and enable audit
CREATE TABLE ccbc_public.application_er (
    id SERIAL PRIMARY KEY, -- Auto-incrementing primary key
    application_id INTEGER,
    ccbc_number TEXT,
    er TEXT,
    created_by INTEGER DEFAULT NULL, -- User ID who created the record
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Timestamp when the record was created
    updated_by INTEGER DEFAULT NULL, -- User ID who last updated the record
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL, -- Timestamp when the record was last updated
    archived_by INTEGER DEFAULT NULL, -- User ID who archived the record
    archived_at TIMESTAMP WITH TIME ZONE DEFAULT NULL -- Timestamp when the record was archived
);

GRANT TRIGGER ON ccbc_public.application_er TO ccbc;

SELECT audit.enable_tracking('ccbc_public.application_er'::regclass);

-- Step 3: Populate the table with data
WITH er_regions AS (
    SELECT
        s.ccbc_numbe AS ccbc_number,
        r.cnmcrgnnm AS er
    FROM
        ccbc_public.ccbc_applications_coverages s
    LEFT JOIN
        ccbc_public.economic_regions r ON ST_Intersects(ST_makeValid(s.geom), r.geom)
    ORDER BY
        s.ccbc_numbe
)
INSERT INTO ccbc_public.application_er (application_id, ccbc_number, er)
SELECT
    a.id as application_id,
    er.ccbc_number,
    er.er
FROM
    er_regions er
JOIN
    ccbc_public.application a ON a.ccbc_number = er.ccbc_number;

-- Step 4: Grant permissions
begin;
do
$grant$
begin
-- Grant ccbc_admin permissions
execute ccbc_private.grant_permissions('select', 'application_er', 'ccbc_admin');
execute ccbc_private.grant_permissions('insert', 'application_er', 'ccbc_admin');
execute ccbc_private.grant_permissions('update', 'application_er', 'ccbc_admin');

-- Grant ccbc_analyst permissions
execute ccbc_private.grant_permissions('select', 'application_er', 'ccbc_analyst');
execute ccbc_private.grant_permissions('insert', 'application_er', 'ccbc_analyst');
execute ccbc_private.grant_permissions('update', 'application_er', 'ccbc_analyst');
end
$grant$;
commit;
