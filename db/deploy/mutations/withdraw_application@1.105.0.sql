-- Deploy ccbc:mutations/withdraw_application to pg
-- requires: tables/application_status
-- requires: tables/application

begin;

create or replace function ccbc_public.withdraw_application(application_row_id int)
returns ccbc_public.application as $$
declare
application_status varchar;
form_data_id int;
form_data_status varchar(1000);
begin

select ccbc_public.application_status(ccbc_public.application.*) into application_status from ccbc_public.application where id = application_row_id;

select id, form_data_status_type_id from
ccbc_public.application_form_data((select row(ccbc_public.application.*)::ccbc_public.application from ccbc_public.application where id = application_row_id))
into form_data_id, form_data_status;

if form_data_status != 'committed' then
  update ccbc_public.form_data set form_data_status_type_id = 'committed' where id = form_data_id;
end if;

if application_status != 'withdrawn' then
  insert into ccbc_public.application_status (application_id, status) values (application_row_id, 'withdrawn');
end if;

return (select row(application.*)::ccbc_public.application from ccbc_public.application where id = application_row_id);

end

$$ language plpgsql;

grant execute on function ccbc_public.withdraw_application to ccbc_auth_user;

comment on function ccbc_public.withdraw_application is 'Mutation to change the status of an application to withdrawn';

commit;
