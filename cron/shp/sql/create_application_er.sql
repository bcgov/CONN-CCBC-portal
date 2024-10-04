-- Step 1: Drop the table if exists
DROP TABLE IF EXISTS ccbc_public.application_er;

-- Step 2: Create table for Economic Regions (ER)
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

-- Step 3: Join with the application table to get the application_id and insert into new table
SELECT
    a.id as application_id,
    er.ccbc_number,
    er.er
INTO
    ccbc_public.application_er
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
