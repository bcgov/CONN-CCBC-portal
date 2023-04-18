-- Deploy ccbc:tables/application_status_type_004_analyst_visible to pg

begin;

alter table ccbc_public.application_status_type add column visible_by_analyst boolean default true;

alter table ccbc_public.application_status_type add constraint no_invisible_status check (visible_by_analyst or visible_by_applicant);

update ccbc_public.application_status_type set visible_by_analyst = false where name = 'draft';
update ccbc_public.application_status_type set visible_by_analyst = false where name = 'submitted';

commit;
