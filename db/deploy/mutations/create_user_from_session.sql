-- Deploy ccbc:mutations/create_user_from_session to pg

begin;

create or replace function ccbc_public.create_user_from_session()
returns ccbc_public.ccbc_user
as $function$
declare
  jwt ccbc_public.keycloak_jwt;
  result ccbc_public.ccbc_user;
begin
  select * from ccbc_public.session() into jwt;

  if ((select count(*) from ccbc_public.ccbc_user where session_sub = jwt.sub) = 0) then
    insert into ccbc_public.ccbc_user(session_sub, given_name, family_name, email_address)
    values (jwt.sub, jwt.given_name, jwt.family_name, jwt.email);
  end if;


  select * from ccbc_public.ccbc_user where session_sub = jwt.sub into result;
  return result;
end;
$function$ language plpgsql strict volatile;

grant execute on function ccbc_public.create_user_from_session to ccbc_auth_user;

commit;
