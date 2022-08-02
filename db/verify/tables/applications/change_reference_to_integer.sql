-- Verify ccbc:tables/applications/change_to_ccbc_number on pg

BEGIN;

do $$
    begin
        assert (select data_type from information_schema.columns where table_name='applications' AND column_name='reference_number') = 'integer', 'reference_number not integer' ;
    end;
$$;

ROLLBACK;
