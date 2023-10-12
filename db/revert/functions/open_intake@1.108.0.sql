-- Deploy ccbc:functions/open_intake to pg

BEGIN;

create or replace function ccbc_public.open_intake() returns ccbc_public.intake as
$function$
 select * from ccbc_public.intake where now() >= open_timestamp and now() <= close_timestamp;
$function$ language sql stable;

grant execute on function ccbc_public.open_intake to ccbc_guest, ccbc_auth_user, ccbc_admin, ccbc_analyst;

comment on function ccbc_public.open_intake is 'Returns the current open intake';

COMMIT;
