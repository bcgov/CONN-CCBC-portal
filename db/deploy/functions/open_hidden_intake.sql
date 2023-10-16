-- deploy ccbc:functions/open_hidden_intake to pg

begin;

create or replace function ccbc_public.open_hidden_intake(code text) returns ccbc_public.intake as
$function$
 select * from ccbc_public.intake
 where now() >= open_timestamp and now() <= close_timestamp and hidden = 'true' and hidden_code::text = code
 and archived_at is null;
$function$ language sql stable;

grant execute on function ccbc_public.open_hidden_intake to ccbc_auth_user;

comment on function ccbc_public.open_hidden_intake is 'Returns the current hidden open intake';

commit;
