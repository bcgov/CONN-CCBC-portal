-- Deploy ccbc:tables/ccbc_user to pg

begin;

create table ccbc_public.ccbc_user(
  id integer primary key generated always as identity,
  uuid uuid not null,
  given_name varchar(1000),
  family_name varchar(1000),
  email_address varchar(1000)
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'ccbc_user');

create unique index ccbc_user_uuid on ccbc_public.ccbc_user(uuid);
create unique index ccbc_user_email_address on ccbc_public.ccbc_user(email_address);

do
$grant$
begin

-- Grant ccbc_auth_user permissions
perform ccbc_private.grant_permissions('select', 'ccbc_user', 'ccbc_auth_user');
perform ccbc_private.grant_permissions('insert', 'ccbc_user', 'ccbc_auth_user');
perform ccbc_private.grant_permissions('update', 'ccbc_user', 'ccbc_auth_user',
  ARRAY['given_name', 'family_name', 'email_address', 'created_by', 'created_at', 'updated_by', 'updated_at', 'archived_by', 'archived_at']);

-- Grant ccbc_guest persmissions
perform ccbc_private.grant_permissions('select', 'ccbc_user', 'ccbc_guest');

end
$grant$;

-- Enable row-level security
alter table ccbc_public.ccbc_user enable row level security;

do
$policy$
begin
-- ccbc_auth_user RLS: can see all users, but can only modify its own record
perform ccbc_private.upsert_policy('ccbc_auth_user_select_ccbc_user', 'ccbc_user', 'select', 'ccbc_auth_user', 'true');
perform ccbc_private.upsert_policy('ccbc_auth_user_insert_ccbc_user', 'ccbc_user', 'insert', 'ccbc_auth_user', 'uuid=(select sub from ccbc_public.session())');
perform ccbc_private.upsert_policy('ccbc_auth_user_update_ccbc_user', 'ccbc_user', 'update', 'ccbc_auth_user', 'uuid=(select sub from ccbc_public.session())');

-- ccbc_guest RLS: can only see its own (empty) record
perform ccbc_private.upsert_policy('ccbc_guest_select_ccbc_user', 'ccbc_user', 'select', 'ccbc_guest', 'uuid=(select sub from ccbc_public.session())');

end
$policy$;

comment on table ccbc_public.ccbc_user is 'Table containing information about the application''s users ';
comment on column ccbc_public.ccbc_user.id is 'Unique ID for the user';
comment on column ccbc_public.ccbc_user.uuid is 'Universally Unique ID for the user, defined by the single sign-on provider';
comment on column ccbc_public.ccbc_user.given_name is 'User''s first name';
comment on column ccbc_public.ccbc_user.family_name is 'User''s last name';
comment on column ccbc_public.ccbc_user.email_address is 'User''s email address';

commit;
