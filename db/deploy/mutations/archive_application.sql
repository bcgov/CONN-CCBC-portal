-- Deploy ccbc:mutations/archive_application to pg

begin;

create or replace function ccbc_public.archive_application(application_row_id int)
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


-- Just one more check at the DB level making sure form is in draft
if application_status = 'draft' then
  update ccbc_public.form_data set archived_at = now() where id = form_data_id;
  update ccbc_public.application set archived_at = now() where id = application_row_id;
end if;

return (select row(application.*)::ccbc_public.application from ccbc_public.application where id = application_row_id);

end

$$ language plpgsql;

grant execute on function ccbc_public.archive_application to ccbc_auth_user;

comment on function ccbc_public.archive_application is 'Mutation to archive an application and its related data';

commit;
