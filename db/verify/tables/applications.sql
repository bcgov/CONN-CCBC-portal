-- Verify ccbc:tables/applications on pg

begin;

select id, reference_number, created_by, form_data, status
  from ccbc_public.applications
  where false;

rollback;
