-- revert ccbc:tables/intake_008_hidden_code_column from pg

begin;

alter table ccbc_public.intake drop column if exists hidden_code;

commit;
