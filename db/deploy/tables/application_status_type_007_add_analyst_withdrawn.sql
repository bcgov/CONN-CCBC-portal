-- Deploy ccbc:tables/application_status_type_007_add_analyst_withdrawn to pg

begin;

update ccbc_public.application_status_type set status_order = 36 where name = 'withdrawn';

insert into ccbc_public.application_status_type (name, description, visible_by_applicant, visible_by_analyst, status_order)
  values ('analyst_withdrawn', 'Withdrawn', false, true, 37);

commit;
