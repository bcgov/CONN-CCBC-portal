-- Deploy ccbc:functions/expose_application_name to pg

BEGIN;

CREATE FUNCTION ccbc_public.application_project_name(application ccbc_public.application) RETURNS text as $$
SELECT application.form_data -> 'projectInformation' ->> 'projectTitle' 
$$ LANGUAGE sql STABLE;

COMMIT;
