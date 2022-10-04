-- Deploy ccbc:tables/application_form_data to pg

begin;

create table ccbc_public.application_form_data(
  form_data_id integer references ccbc_public.form_data(id),
  application_id integer references ccbc_public.application(id),
  primary key(form_data_id, application_id)
);

-- Enable row-level security
alter table ccbc_public.application_form_data force row level security;
alter table ccbc_public.application_form_data enable row level security;

do
$grant$
begin
perform ccbc_private.grant_permissions('select', 'application_form_data', 'ccbc_auth_user');
perform ccbc_private.grant_permissions('insert', 'application_form_data', 'ccbc_auth_user');

end
$grant$;

-- RLS: can only see and insert its own records in form_data
do
$policy$
begin
perform ccbc_private.upsert_policy('ccbc_auth_user_select_form_data', 'form_data', 'select', 'ccbc_auth_user', 'id in (select form_data_id from ccbc_public.application_form_data where form_data_id = id )');
perform ccbc_private.upsert_policy('ccbc_auth_user_update_form_data', 'form_data', 'update', 'ccbc_auth_user',
'id in (select form_data_id from ccbc_public.application_form_data where form_data_id=id)');

perform ccbc_private.upsert_policy('ccbc_auth_user_insert_application_form_data', 'application_form_data', 'insert', 'ccbc_auth_user',
'application_id in (select id from ccbc_public.application where owner=(select sub from ccbc_public.session()))');

perform ccbc_private.upsert_policy('ccbc_auth_user_select_application_form_data', 'application_form_data', 'select', 'ccbc_auth_user',
'application_id in (select id from ccbc_public.application where owner=(select sub from ccbc_public.session()))');
end
$policy$;


comment on table ccbc_public.application_form_data is 'Table to pair an application to form data';

comment on column ccbc_public.application_form_data.form_data_id is 'The foreign key of a form';

comment on column ccbc_public.application_form_data.application_id is 'The foreign key of an application';

commit;
