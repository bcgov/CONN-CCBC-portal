-- Deploy ccbc:tables/application_rfi_data to pg

begin;

create table ccbc_public.application_rfi_data(
  rfi_data_id integer references ccbc_public.rfi_data(id),
  application_id integer references ccbc_public.application(id),
  primary key(rfi_data_id, application_id)
);

create index application_rfi_data_rfi_data_id_idx on ccbc_public.application_rfi_data(rfi_data_id);

create index application_rfi_data_application_id_idx on ccbc_public.application_rfi_data(application_id);

-- Enable row-level security
alter table ccbc_public.application_rfi_data force row level security;
alter table ccbc_public.application_rfi_data enable row level security;

do
$grant$
begin
perform ccbc_private.grant_permissions('select', 'application_rfi_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'application_rfi_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('select', 'application_rfi_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'application_rfi_data', 'ccbc_admin'); 
perform ccbc_private.grant_permissions('select', 'application_rfi_data', 'ccbc_auth_user');

end
$grant$;

-- RLS
do
$policy$
begin

perform ccbc_private.upsert_policy('ccbc_analyst_insert_application_rfi_data', 
  'application_rfi_data', 'insert', 'ccbc_analyst', 'true');
perform ccbc_private.upsert_policy('ccbc_analyst_select_application_rfi_data', 
  'application_rfi_data', 'select', 'ccbc_analyst', 'true');
perform ccbc_private.upsert_policy('ccbc_analyst_select_rfi_data',
  'rfi_data', 'select', 'ccbc_analyst','true');
perform ccbc_private.upsert_policy('ccbc_analyst_update_rfi_data',
 'rfi_data', 'update', 'ccbc_analyst', 'true');

-- same for admin

perform ccbc_private.upsert_policy('ccbc_admin_insert_application_rfi_data', 
  'application_rfi_data', 'insert', 'ccbc_admin', 'true');
perform ccbc_private.upsert_policy('ccbc_admin_select_application_rfi_data', 
  'application_rfi_data', 'select', 'ccbc_admin', 'true');
perform ccbc_private.upsert_policy('ccbc_admin_select_rfi_data',
  'rfi_data', 'select', 'ccbc_admin', 'true');
perform ccbc_private.upsert_policy('ccbc_admin_update_rfi_data',
 'rfi_data', 'update', 'ccbc_admin', 'true');

end
$policy$;


comment on table ccbc_public.application_rfi_data is 'Table to pair an application to RFI data';

comment on column ccbc_public.application_rfi_data.rfi_data_id is 'The foreign key of a form';

comment on column ccbc_public.application_rfi_data.application_id is 'The foreign key of an application';

commit;
