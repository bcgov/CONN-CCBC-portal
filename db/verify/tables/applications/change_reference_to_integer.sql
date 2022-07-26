-- Verify ccbc:tables/applications/change_to_ccbc_number on pg

BEGIN;

do $$
    begin
        assert (select pg_typeof(reference_number)::text from ccbc_public.applications) = 'integer', 'reference_number not integer' ;
    end;
$$;

ROLLBACK;
