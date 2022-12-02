-- Deploy ccbc:computed_columns/application_rfi_list to pg

begin;

create or replace function ccbc_public.application_rfi_list(application ccbc_public.application) 
returns ccbc_public.rfi_data as
$$
  select row(rd.*)::ccbc_public.rfi_data from ccbc_public.rfi_data as rd 
  inner join ccbc_public.application_rfi_data as arf on rd.id = arf.rfi_data_id
   where arf.application_id = application.id order by rd.id desc;
$$ language sql stable;

grant execute on function ccbc_public.application_rfi_list to ccbc_auth_user;
grant execute on function ccbc_public.application_rfi_list to ccbc_analyst;
grant execute on function ccbc_public.application_rfi_list to ccbc_admin;

comment on function ccbc_public.application_rfi_list is 'Computed column to display list of rfi';

commit;