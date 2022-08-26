-- Deploy ccbc:tables/application to pg
-- requires: schemas/public

begin;

create table if not exists ccbc_public.application (
  id integer primary key generated always as identity,
  ccbc_number varchar(1000),
  owner varchar(1000) not null,
  form_data jsonb not null default '{}'::jsonb,
  status varchar(1000) default 'draft',
  last_edited_page varchar(100),
  intake_id int references ccbc_public.intake
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'application');

create index ccbc_owner on ccbc_public.application(owner);
create index application_intake_id on ccbc_public.application(intake_id);


do
$grant$
begin

-- Grant ccbc_auth_user permissions
perform ccbc_private.grant_permissions('select', 'application', 'ccbc_auth_user');
perform ccbc_private.grant_permissions('insert', 'application', 'ccbc_auth_user');
perform ccbc_private.grant_permissions('update', 'application', 'ccbc_auth_user');

end
$grant$;

-- Enable row-level security
alter table ccbc_public.application force row level security;
alter table ccbc_public.application enable row level security;

do
$policy$
begin
-- ccbc_auth_user RLS: can see and modify only its own records
perform ccbc_private.upsert_policy('ccbc_auth_user_select_application', 'application', 'select', 'ccbc_auth_user', 'owner=(select sub from ccbc_public.session())');
perform ccbc_private.upsert_policy('ccbc_auth_user_insert_application', 'application', 'insert', 'ccbc_auth_user', 'owner=(select sub from ccbc_public.session())');
perform ccbc_private.upsert_policy('ccbc_auth_user_update_application', 'application', 'update', 'ccbc_auth_user', 'owner=(select sub from ccbc_public.session())');

end
$policy$;

comment on table ccbc_public.application is 'Table containing the data associated with the CCBC respondents application';
comment on column ccbc_public.application.id is 'Primary key ID for the application';
comment on column ccbc_public.application.ccbc_number is 'Reference number assigned to the application';
comment on column ccbc_public.application.owner is 'The owner of the application, identified by its JWT sub';
comment on column ccbc_public.application.form_data is 'The data entered into the form by the respondent';
comment on column ccbc_public.application.status is 'The status of the application, draft or complete';
comment on column ccbc_public.application.intake_id is 'The intake associated with the application, set when it is submitted';
comment on column ccbc_public.application.last_edited_page is 'Column saving the key of the last edited form page';

commit;
