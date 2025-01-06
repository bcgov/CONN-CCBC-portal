-- Deploy ccbc:types/assessment_form_result to pg
BEGIN;

CREATE TYPE ccbc_public.assessment_form_result AS (
    assessment_data ccbc_public.assessment_data,
    application_dependencies ccbc_public.application_dependencies
);

COMMIT;
