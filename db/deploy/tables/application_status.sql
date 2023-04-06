-- Deploy ccbc:tables/application_status to pg

begin;

create table ccbc_public.application_status(
  id integer primary key generated always as identity,
  application_id integer references ccbc_public.application(id),
  status varchar(1000) references ccbc_public.application_status_type(name)
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'application_status');

create index application_status_application_id_index on ccbc_public.application_status(application_id);
do
$grant$
begin

-- Grant ccbc_auth_user permissions
perform ccbc_private.grant_permissions('select', 'application_status', 'ccbc_auth_user');
perform ccbc_private.grant_permissions('insert', 'application_status', 'ccbc_auth_user');

end
$grant$;


alter table ccbc_public.application_status force row level security;
alter table ccbc_public.application_status enable row level security;

do
$policy$
begin
-- ccbc_auth_user RLS: can see and modify only its own records
perform ccbc_private.upsert_policy('ccbc_auth_user_select_application_status', 'application_status', 'select', 'ccbc_auth_user', 'application_id in (select id from ccbc_public.application where owner=(select sub from ccbc_public.session()))');
perform ccbc_private.upsert_policy('ccbc_auth_user_insert_application_status', 'application_status', 'insert', 'ccbc_auth_user', 'application_id in (select id from ccbc_public.application where owner=(select sub from ccbc_public.session()))');

end
$policy$;

comment on table ccbc_public.application_status is 'Table containing information about possible application statuses';
comment on column ccbc_public.application_status.id is 'Unique ID for the application_status';
comment on column ccbc_public.application_status.application_id is 'ID of the application this status belongs to';

commit;
