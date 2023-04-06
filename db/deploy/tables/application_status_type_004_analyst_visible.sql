-- Deploy ccbc:tables/application_status_type_004_analyst_visible to pg

begin;

alter table ccbc_public.application_status_type add column visible_by_analyst boolean default true;

update ccbc_public.application_status_type set visible_by_analyst = false where name = 'draft';

commit;
