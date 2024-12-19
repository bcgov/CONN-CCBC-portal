-- Step 1: Drop the table if it exists
DROP TABLE IF EXISTS ccbc_public.application_rd;

-- Step 2: Create the table explicitly with an auto-incrementing primary key and audit columns
CREATE TABLE ccbc_public.application_rd (
    id SERIAL PRIMARY KEY, -- Auto-incrementing primary key
    application_id INTEGER,
    ccbc_number TEXT,
    rd TEXT,
    created_by INTEGER DEFAULT NULL, -- User ID who created the record
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Timestamp when the record was created
    updated_by INTEGER DEFAULT NULL, -- User ID who last updated the record
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL, -- Timestamp when the record was last updated
    archived_by INTEGER DEFAULT NULL, -- User ID who archived the record
    archived_at TIMESTAMP WITH TIME ZONE DEFAULT NULL -- Timestamp when the record was archived
);

SELECT audit.enable_tracking('ccbc_public.application_rd'::regclass);

-- Step 3: Populate the table with data
WITH rd_regions AS (
    SELECT
        s.ccbc_numbe AS ccbc_number,
        r.aa_name AS rd
    FROM
        ccbc_public.ccbc_applications_coverages s
    LEFT JOIN
        ccbc_public.regional_districts r ON ST_Intersects(ST_makeValid(s.geom), r.geom)
    ORDER BY
        s.ccbc_numbe
)
INSERT INTO ccbc_public.application_rd (application_id, ccbc_number, rd)
SELECT
    a.id as application_id,
    rd.ccbc_number,
    rd.rd
FROM
    rd_regions rd
JOIN
    ccbc_public.application a ON a.ccbc_number = rd.ccbc_number;

-- Step 4: Grant permissions
begin;
do
$grant$
begin
-- Grant ccbc_admin permissions
execute ccbc_private.grant_permissions('select', 'application_rd', 'ccbc_admin');
execute ccbc_private.grant_permissions('insert', 'application_rd', 'ccbc_admin');
execute ccbc_private.grant_permissions('update', 'application_rd', 'ccbc_admin');

-- Grant ccbc_analyst permissions
execute ccbc_private.grant_permissions('select', 'application_rd', 'ccbc_analyst');
execute ccbc_private.grant_permissions('insert', 'application_rd', 'ccbc_analyst');
execute ccbc_private.grant_permissions('update', 'application_rd', 'ccbc_analyst');
end
$grant$;
commit;
