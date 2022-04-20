-- Deploy ccbc:create_roles to pg

begin;

do
$do$
begin

  if not exists (
    select true
    from pg_catalog.pg_roles
    where rolname = 'ccbc_guest') then
    
    create role ccbc_guest;
  end if;

  if not exists (
    select true
    from pg_catalog.pg_roles
    where rolname = 'ccbc_auth_user') then

    create role ccbc_auth_user;
  end if;

  if not exists (
    select true
    from pg_catalog.pg_roles
    where rolname = 'ccbc_app') then

    create user ccbc_app;
  end if;
  

  grant ccbc_guest, ccbc_auth_user to ccbc_app;
  execute format('grant create, connect on database %I to ccbc_app', current_database());

end
$do$;

commit;
