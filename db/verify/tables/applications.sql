-- Verify ccbc:tables/applications on pg

begin;

select id, reference_number, owner, form_data, status
  from ccbc_public.applications
  where false;

rollback;
