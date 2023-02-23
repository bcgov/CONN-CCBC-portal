-- deploy ccbc:util_functions/increment_counter to pg

begin;

create or replace function ccbc_public.increment_counter( counter_id int) returns int as $$

  update ccbc_public.gapless_counter set counter = counter + 1 where id = counter_id returning counter;

$$ language sql volatile;

grant execute on function ccbc_public.increment_counter to ccbc_auth_user, ccbc_analyst, ccbc_admin;

commit;

comment on function ccbc_public.increment_counter is 'Utility funciton to increment counter on an id';
