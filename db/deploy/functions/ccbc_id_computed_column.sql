-- Deploy ccbc:functions/ccbc_id_computed_column to pg

BEGIN;

CREATE FUNCTION ccbc_public.applications_ccbc_id(application ccbc_public.applications) RETURNS text as $$
DECLARE
    intake_number integer;
    reference_number integer;
BEGIN

    IF application.intake_id is null THEN
        RETURN NULL;
    END IF;

    SELECT ccbc_intake_number into intake_number from ccbc_public.intake WHERE id = application.intake_id;

    SELECT application.reference_number into reference_number;

    RETURN FORMAT('CCBC-%s%s',LPAD(intake_number::text,2,'0'),LPAD(reference_number::text,4,'0'));

END
$$ LANGUAGE 'plpgsql' STABLE;

comment on function ccbc_public.applications_ccbc_id is 'Computed Column of CCBC ID from intake table';

COMMIT;
