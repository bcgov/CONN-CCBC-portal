-- Deploy ccbc:functions/next_intake to pg

begin;

create or replace function ccbc_public.next_intake()
returns ccbc_public.intake
as $function$
  select *
  from ccbc_public.intake
  where now() < open_timestamp
  order by ccbc_intake_number
  limit 1;
$function$ language sql stable;

grant execute on function ccbc_public.next_intake to ccbc_auth_user, ccbc_guest, ccbc_admin, ccbc_analyst;

comment on function ccbc_public.next_intake is 'Returns the next intake if any';

commit;
