begin;

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.application_analyst_lead,
  ccbc_public.analyst,
  ccbc_public.rfi_data,
  ccbc_public.gis_data
restart identity cascade;

commit;
