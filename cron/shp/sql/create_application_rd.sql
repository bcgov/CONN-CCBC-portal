-- Step 1: Drop the table if it exists
DROP TABLE IF EXISTS ccbc_public.application_rd;

-- Step 2: Create table for Regional Districts (RD)
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

-- Step 3: Join with the application table to get the application_id and insert into new table
SELECT
    a.id as application_id,
    rd.ccbc_number,
    rd.rd
INTO
    ccbc_public.application_rd
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
