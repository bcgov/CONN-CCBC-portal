-- Deploy ccbc:tables/application_001.sql to pg

begin;

alter table ccbc_public.application drop column form_data;

commit;
