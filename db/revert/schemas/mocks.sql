-- Revert ccbc:schemas/mocks from pg

begin;

drop schema mocks;

commit;
