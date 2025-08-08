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
  ccbc_public.gis_data,
  ccbc_public.application_announcement,
  ccbc_public.announcement,
  ccbc_public.conditional_approval_data,
  ccbc_public.project_information_data,
  ccbc_public.application_sow_data,
  ccbc_public.sow_tab_1,
  ccbc_public.sow_tab_2,
  ccbc_public.sow_tab_7,
  ccbc_public.sow_tab_8,
  ccbc_public.application_fnha_contribution,
  ccbc_public.application_milestone_excel_data
restart identity cascade;

commit;
