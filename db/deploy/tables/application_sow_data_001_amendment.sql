-- Deploy ccbc:tables/application_sow_data_001_amendment to pg

begin;

alter table ccbc_public.application_sow_data add column amendment_number integer default 0;
alter table ccbc_public.application_sow_data add column is_amendment boolean default false;

comment on column ccbc_public.application_sow_data.amendment_number is 'The amendment number';
comment on column ccbc_public.application_sow_data.is_amendment is 'Column identifying if the record is an amendment';

do
$$
begin

perform ccbc_private.grant_permissions('update', 'application_sow_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'application_sow_data', 'ccbc_admin');

end
$$;

commit;
