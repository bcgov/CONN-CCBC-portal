-- Deploy ccbc:tables/form_data_005_add_reason_for_change to pg

begin;

  alter table ccbc_public.form_data add column reason_for_change varchar(1000);

  comment on column ccbc_public.form_data.reason_for_change is 'Column to track analysts reason for changing form data';


  alter policy form_data_editable_update_policy on ccbc_public.form_data
  to ccbc_auth_user using (ccbc_public.form_data_is_editable(form_data))
  with check (true);


do
$$
begin

  perform ccbc_private.grant_permissions('update', 'form_data', 'ccbc_admin');
  perform ccbc_private.grant_permissions('update', 'form_data', 'ccbc_analyst');

  perform ccbc_private.upsert_policy('ccbc_admin_user_update_form_data', 'form_data',
  'update', 'ccbc_admin', 'id in (select form_data_id from ccbc_public.application_form_data)');
  perform ccbc_private.upsert_policy('ccbc_analyst_user_update_form_data', 'form_data',
  'update', 'ccbc_analyst', 'id in (select form_data_id from ccbc_public.application_form_data)');

end
$$;

commit;
