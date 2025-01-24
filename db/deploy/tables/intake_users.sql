-- Deploy ccbc:tables/intake_users to pg

BEGIN;

create table ccbc_public.intake_users(
  id integer primary key generated always as identity,
  intake_id integer references ccbc_public.intake(id),
  user_id integer references ccbc_public.ccbc_user(id)
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'intake_users');

select audit.enable_tracking('ccbc_public.intake_users'::regclass);

do
$grant$
begin

-- admin
perform ccbc_private.grant_permissions('select', 'intake_users', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'intake_users', 'ccbc_admin');

-- analyst
perform ccbc_private.grant_permissions('select', 'intake_users', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'intake_users', 'ccbc_analyst');

-- applicant
perform ccbc_private.grant_permissions('select', 'intake_users', 'ccbc_auth_user');
perform ccbc_private.grant_permissions('insert', 'intake_users', 'ccbc_auth_user');

-- cbc admin
perform ccbc_private.grant_permissions('select', 'intake_users', 'cbc_admin');
perform ccbc_private.grant_permissions('insert', 'intake_users', 'cbc_admin');

-- service account
perform ccbc_private.grant_permissions('select', 'intake_users', 'ccbc_service_account');
perform ccbc_private.grant_permissions('insert', 'intake_users', 'ccbc_service_account');


end
$grant$;

COMMIT;
