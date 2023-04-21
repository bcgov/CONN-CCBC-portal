-- Deploy ccbc:mutations/create_user_from_session to pg

begin;

create or replace function ccbc_public.create_user_from_session()
returns ccbc_public.ccbc_user
as $function$
declare
  jwt ccbc_public.keycloak_jwt;
  result ccbc_public.ccbc_user;
  is_external_analyst boolean;
begin
  select * from ccbc_public.session() into jwt;

  select true into is_external_analyst
  where jwt.identity_provider = 'bceidbusiness' and jwt.auth_role = 'ccbc_analyst';

  if ((select count(*) from ccbc_public.ccbc_user where session_sub = jwt.sub) = 0) then
    insert into ccbc_public.ccbc_user(session_sub, given_name, family_name, email_address, external_analyst)
    values (jwt.sub, jwt.given_name, jwt.family_name, jwt.email, is_external_analyst);
  elseif
    ((select external_analyst from ccbc_public.ccbc_user where session_sub = jwt.sub) is null)
    and is_external_analyst = true then
    update ccbc_public.ccbc_user set external_analyst = true where session_sub = jwt.sub;
  end if;

  select * from ccbc_public.ccbc_user where session_sub = jwt.sub into result;
  return result;
end;
$function$ language plpgsql strict volatile;

grant execute on function ccbc_public.create_user_from_session to ccbc_auth_user, ccbc_admin, ccbc_analyst;

commit;
