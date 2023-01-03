-- Deploy ccbc:computed_columns/application_rfi to pg
begin;
do
$$
begin
drop function ccbc_public.application_rfi(ccbc_public.application);
end;
$$;

create or replace function ccbc_public.application_rfi(application ccbc_public.application) returns ccbc_public.rfi_data as
$$
select row(rd.*) from ccbc_public.rfi_data as rd
    inner join ccbc_public.application_rfi_data arf
    on arf.rfi_data_id = rd.id
    where arf.application_id = application.id
    order by rd.id desc limit 1;
$$ language sql stable;

grant execute on function ccbc_public.application_rfi to ccbc_analyst;
grant execute on function ccbc_public.application_rfi to ccbc_admin;
grant execute on function ccbc_public.application_rfi to ccbc_auth_user;

comment on function ccbc_public.application_rfi is 'Computed column to return last RFI for an application';

commit;
