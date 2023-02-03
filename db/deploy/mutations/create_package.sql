-- Deploy ccbc:mutations/create_package.sql to pg

begin;

create or replace function ccbc_public.create_package(_application_id int, _package int default null) returns ccbc_public.application_package as $$
declare
new_application_package_id int;
old_application_package_id int;
begin

  select ap.id into old_application_package_id from ccbc_public.application_package as ap where ap.application_id = application_id
  order by ap.id desc limit 1;

  insert into ccbc_public.application_package (application_id, package)
    values (_application_id, _package) returning id into new_application_package_id;

  if exists (select * from ccbc_public.application_package where id = old_application_package_id)
    then update ccbc_public.application_package set archived_at = now() where id = old_application_package_id;
  end if;

  return (select row(ccbc_public.application_package.*) from ccbc_public.application_package where id = new_application_package_id);
end;
$$ language plpgsql volatile;

grant execute on function ccbc_public.create_package to ccbc_analyst;
grant execute on function ccbc_public.create_package to ccbc_admin;

commit;
