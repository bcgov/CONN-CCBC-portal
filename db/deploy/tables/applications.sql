-- Deploy ccbc:tables/applications to pg
-- requires: schemas/public

begin;

create table if not exists ccbc_public.applications (
  id integer primary key generated always as identity,
  reference_number varchar(1000),
  owner uuid,
  form_data jsonb not null default '{}'::jsonb,
  status varchar(1000) default 'draft',
  unique(owner)
);

create index ccbc_owner on ccbc_public.applications(owner);

do
$grant$
begin

-- Grant ccbc_auth_user permissions
perform ccbc_public.grant_permissions('select', 'applications', 'ccbc_auth_user');
perform ccbc_public.grant_permissions('insert', 'applications', 'ccbc_auth_user');
perform ccbc_public.grant_permissions('update', 'applications', 'ccbc_auth_user',
  ARRAY['id', 'owner', 'form_data', 'status']);

-- Grant  ccbc_guest persmissions
perform ccbc_public.grant_permissions('select', 'applications', 'ccbc_guest');

end
$grant$;

commit;
