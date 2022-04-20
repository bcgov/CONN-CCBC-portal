-- Revert ccbc:schemas/private from pg

begin;

drop schema ccbc_private;

commit;
