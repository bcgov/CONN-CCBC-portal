-- Verify ccbc:create_roles on pg

begin;

do
$verify$
begin

  if(select not exists(select true from pg_roles where rolname='ccbc_guest')) then
    raise exception 'role ccbc_guest does not exist';
  end if;

end
$verify$;

rollback;
