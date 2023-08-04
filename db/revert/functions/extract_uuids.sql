-- revert ccbc:functions/extract_uuids from pg

begin;

drop function ccbc_public.extract_uuids(jsonb);

commit;
