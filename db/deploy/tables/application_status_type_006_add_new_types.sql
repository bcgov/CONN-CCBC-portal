-- Deploy ccbc:tables/application_status_type_006_add_new_types to pg

begin;

insert into ccbc_public.application_status_type (name, description, visible_by_applicant, visible_by_analyst, status_order)
  values ('applicant_approved', 'Approved', true, false, 18);

insert into ccbc_public.application_status_type (name, description, visible_by_applicant, visible_by_analyst, status_order)
  values ('applicant_complete', 'Complete', true, false, 20);

insert into ccbc_public.application_status_type (name, description, visible_by_applicant, visible_by_analyst, status_order)
  values ('applicant_on_hold', 'On hold', true, false, 22);

insert into ccbc_public.application_status_type (name, description, visible_by_applicant, visible_by_analyst, status_order)
  values ('applicant_cancelled', 'Cancelled', true, false, 24);

insert into ccbc_public.application_status_type (name, description, visible_by_applicant, visible_by_analyst, status_order)
  values ('applicant_closed', 'Closed', true, false, 26);

commit;
