-- Deploy ccbc:tables/application_status_type_011_add_merged_status to pg

begin;

update ccbc_public.application_status_type set status_order = 21 where name = 'applicant_complete';
update ccbc_public.application_status_type set status_order = 20 where name = 'approved';
update ccbc_public.application_status_type set status_order = 19 where name = 'applicant_approved';

insert into ccbc_public.application_status_type (name, description, visible_by_applicant, visible_by_analyst, status_order)
  values ('merged', 'Merged', false, true, 17);

insert into ccbc_public.application_status_type (name, description, visible_by_applicant, visible_by_analyst, status_order)
  values ('applicant_merged', 'Merged', true, false, 18);

commit;
