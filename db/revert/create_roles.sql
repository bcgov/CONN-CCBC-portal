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
    where rolname = 'ccbc_job_executor') then

    create role ccbc_job_executor;
  end if;

    if not exists (
    select true
    from pg_catalog.pg_roles
    where rolname = 'ccbc_analyst') then

    create role ccbc_analyst;
  end if;

    if not exists (
    select true
    from pg_catalog.pg_roles
    where rolname = 'ccbc_admin') then

    create role ccbc_admin;
  end if;

    if not exists (
    select true
    from pg_catalog.pg_roles
    where rolname = 'ccbc_service_account') then

    create role ccbc_service_account;
  end if;

  if not exists (
    select true
    from pg_catalog.pg_roles
    where rolname = 'ccbc_app') then

    create user ccbc_app;
  end if;

  if not exists (
    select true
    from pg_catalog.pg_roles
    where rolname = 'ccbc_archiver') then

    create user ccbc_archiver;
  end if;


  grant ccbc_guest, ccbc_auth_user, ccbc_job_executor, ccbc_analyst, ccbc_admin, ccbc_archiver, ccbc_service_account to ccbc_app;
  execute format('grant create, connect on database %I to ccbc_app', current_database());

end
$do$;

commit;
