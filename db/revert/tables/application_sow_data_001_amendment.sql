-- Revert ccbc:tables/application_sow_data_001_amendment from pg

begin;

alter table ccbc_public.application_sow_data drop column amendment_number;
alter table ccbc_public.application_sow_data drop column is_amendment;

commit;
