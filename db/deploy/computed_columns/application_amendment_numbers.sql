-- Deploy ccbc:computed_columns/application_amendment_numbers to pg

create or replace function ccbc_public.application_amendment_numbers(application ccbc_public.application) returns varchar as
$$

-- Add 0 to list of amendment numbers so we include the original sow data number
select '0 ' || string_agg(cast(amendment_number as varchar), ' ') as amendment_numbers from ccbc_public.change_request_data
where application_id = application.id and archived_at is null;

$$ language sql stable;

grant execute on function ccbc_public.application_amendment_numbers to ccbc_auth_user, ccbc_admin, ccbc_analyst;

comment on function ccbc_public.application_amendment_numbers is 'computed column to return space separated list of amendment numbers for a change request';

commit;
