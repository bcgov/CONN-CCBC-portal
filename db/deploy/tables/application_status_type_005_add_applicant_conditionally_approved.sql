-- Deploy ccbc:tables/application_status_type_005_add_applicant_conditionally_approved to pg

begin;

insert into ccbc_public.application_status_type (name, description, visible_by_applicant, visible_by_analyst, status_order)
  values ('applicant_conditionally_approved', 'Conditionally approved', true, false, 16);

insert into ccbc_public.application_status_type (name, description, visible_by_applicant, visible_by_analyst, status_order)
  values ('applicant_received', 'Received', true, false, 1);

commit;
