-- Revert ccbc:tables/add_intake_table from pg

begin;

drop table ccbc_public.intake;

commit;
