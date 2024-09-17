-- Revert ccbc:tables/cbc_data_003_include_change_reason from pg

begin;

alter table ccbc_public.cbc_data drop column change_reason;

commit;
