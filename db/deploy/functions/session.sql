-- Deploy ccbc:function/session to pg
-- requires: schemas/public
-- requires: types/keycloak_jwt

begin;

create or replace function ccbc_public.session()
    returns ccbc_public.keycloak_jwt as
$function$
declare
  _sub text := current_setting('jwt.claims.sub', true);
  _preferred_username text := current_setting('jwt.claims.preferred_username', true);
  _identity_provider text := current_setting('jwt.claims.identity_provider', true);
begin
  if ((coalesce(trim(_sub), '') = '') is not false) then
    return null; -- ensure null, empty and whitespace _sub claims are filtered out
  end if;

  -- Replace @azureidir with @idir in sub and preferred_username
  if _sub like '%@azureidir' then
    _sub := replace(_sub, '@azureidir', '@idir');
  end if;

  if _preferred_username like '%@azureidir' then
    _preferred_username := replace(_preferred_username, '@azureidir', '@idir');
  end if;

  -- Set identity_provider to idir if it is azureidir
  if _identity_provider = 'azureidir' then
    _identity_provider := 'idir';
  end if;

  return (
    select row (
      current_setting('jwt.claims.jti', true),
      current_setting('jwt.claims.exp', true),
      current_setting('jwt.claims.nbf', true),
      current_setting('jwt.claims.iat', true),
      current_setting('jwt.claims.iss', true),
      current_setting('jwt.claims.aud', true),
      _sub,
      current_setting('jwt.claims.typ', true),
      current_setting('jwt.claims.azp', true),
      current_setting('jwt.claims.auth_time', true),
      current_setting('jwt.claims.session_state', true),
      current_setting('jwt.claims.acr', true),
      current_setting('jwt.claims.email_verified', true),
      current_setting('jwt.claims.name', true),
      _preferred_username,
      current_setting('jwt.claims.given_name', true),
      current_setting('jwt.claims.family_name', true),
      current_setting('jwt.claims.email', true),
      current_setting('jwt.claims.broker_session_id', true),
      current_setting('jwt.claims.priority_group', true),
      _identity_provider,
      (select string_to_array(current_setting('jwt.claims.user_groups', true), ',')),
      current_setting('role', true)
    )::ccbc_public.keycloak_jwt
  );
end
$function$ language 'plpgsql' stable;

grant execute on function ccbc_public.session to ccbc_auth_user, ccbc_guest, ccbc_analyst, ccbc_admin, ccbc_job_executor, ccbc_archiver, ccbc_service_account;

commit;
