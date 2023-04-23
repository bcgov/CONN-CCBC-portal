-- Revert ccbc:schemas/public from pg

begin;

drop schema ccbc_public cascade;

commit;
