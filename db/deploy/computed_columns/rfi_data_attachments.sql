-- Deploy ccbc:computed_columns/rfi_attachments to pg

begin;

create or replace function ccbc_public.rfi_data_attachments(rfi ccbc_public.rfi_data) returns setof ccbc_public.attachment as
$$

  select * from ccbc_public.attachment where file in (select unnest(ccbc_public.extract_uuids(rfi.json_data))) order by created_at;

$$ language sql stable;

grant execute on function ccbc_public.rfi_data_attachments to ccbc_admin;
grant execute on function ccbc_public.rfi_data_attachments to ccbc_analyst;

comment on function ccbc_public.rfi_data_attachments is 'Computed column to return all attachement rows for an rfi_data row';

commit;
