-- revert ccbc:tables/intake_007_add_hidden_column from pg

begin;

alter table ccbc_public.intake drop column if exists hidden;

commit;
