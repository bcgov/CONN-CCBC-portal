-- Deploy ccbc:computed_columns/application_rfi to pg
begin;

DROP FUNCTION if exists ccbc_public.application_rfi(ccbc_public.application);

create or replace function ccbc_public.application_rfi(application ccbc_public.application) returns varchar as
$$
select rd.rfi_number from ccbc_public.rfi_data as rd
    inner join ccbc_public.application_rfi_data arf
    on arf.rfi_data_id = rd.id
    where arf.application_id = application.id
    order by rd.updated_at desc limit 1;
$$ language sql stable;

grant execute on function ccbc_public.application_rfi to ccbc_analyst;
grant execute on function ccbc_public.application_rfi to ccbc_admin;

comment on function ccbc_public.application_rfi is 'Computed column to return last RFI for an application';

commit;
