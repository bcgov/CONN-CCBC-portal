-- Deploy ccbc:mutations/withdraw_application to pg
-- requires: tables/application_status
-- requires: tables/application

begin;

create or replace function ccbc_public.withdraw_application(application_row_id int)
returns ccbc_public.application as $$
declare
application_status varchar;
begin

select status into application_status from ccbc_public.application_status where application_id = application_row_id order by id desc;

if application_status != 'withdrawn' then
  insert into ccbc_public.application_status (application_id, status) values (application_row_id, 'withdrawn');
end if;

return (select row(application.*)::ccbc_public.application from ccbc_public.application where id = application_row_id);

end

$$ language plpgsql;

grant execute on function ccbc_public.withdraw_application to ccbc_auth_user;

comment on function ccbc_public.withdraw_application is 'Mutation to change the status of an application to withdrawn';

commit;
