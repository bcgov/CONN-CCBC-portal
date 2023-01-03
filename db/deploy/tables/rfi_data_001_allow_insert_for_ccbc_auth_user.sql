-- deploy ccbc:tables/rfi_data_001_allow_insert_for_ccbc_auth_user to pg

begin;

-- create index on rfi_number

create index rfi_data_rfi_number_idx on ccbc_public.rfi_data (rfi_number);

do
$grant$
begin
  perform ccbc_private.grant_permissions('insert', 'application_rfi_data', 'ccbc_auth_user');
  perform ccbc_private.grant_permissions('insert', 'rfi_data', 'ccbc_auth_user');
  perform ccbc_private.grant_permissions('update', 'rfi_data', 'ccbc_auth_user');

  grant usage, select on sequence ccbc_public.rfi_data_id_seq to ccbc_auth_user;
end
$grant$;
do
$policy$
begin
  -- Only allow a ccbc_auth_user to create an rfi they are inserting with the previously used rfi_number
  -- ccbc_auth_user can only see their own rfi_data so no risk
  perform ccbc_private.upsert_policy('ccbc_auth_user_insert_existing_rfi', 'rfi_data', 'insert',
   'ccbc_auth_user', '(true)');

  perform ccbc_private.upsert_policy('ccbc_auth_user_update_existing_rfi', 'rfi_data', 'update',
   'ccbc_auth_user', 'id in (select rfi_data_id from ccbc_public.application_rfi_data)');

  -- only allow an applicant to see their own RFIs
  perform ccbc_private.upsert_policy('ccbc_auth_user_select_rfi', 'rfi_data', 'select',
   'ccbc_auth_user', 'id in (select rfi_data_id from ccbc_public.application_rfi_data)');

  -- Only allow an applicant to see their own application_rfi_data (used in conjunction with above)
  perform ccbc_private.upsert_policy('ccbc_auth_user_select_application_rfi_data', 'application_rfi_data', 'select',
    'ccbc_auth_user', 'application_id in (select id from ccbc_public.application)');

  -- Only allow an applicant to insert rfi data for their own application
  perform ccbc_private.upsert_policy('ccbc_auth_user_insert_application_rfi_data', 'application_rfi_data', 'insert',
  'ccbc_auth_user', 'application_id in (select id from ccbc_public.application)');

end
$policy$;
commit;
