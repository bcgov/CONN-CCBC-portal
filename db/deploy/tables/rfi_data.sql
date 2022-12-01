-- deploy ccbc:tables/rfi_data to pg

begin;

create table ccbc_public.rfi_data(
  id integer primary key generated always as identity,
  json_data jsonb not null default '{}'::jsonb,
  last_edited_page varchar(100),
  rfi_data_status_type_id varchar(1000) references ccbc_public.rfi_data_status_type(name) default 'draft'
);
select ccbc_private.upsert_timestamp_columns('ccbc_public', 'rfi_data');

alter table ccbc_public.rfi_data force row level security;
alter table ccbc_public.rfi_data enable row level security;

grant usage, select on sequence ccbc_public.rfi_data_id_seq to ccbc_analyst;

do
$grant$
begin

perform ccbc_private.grant_permissions('select', 'rfi_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'rfi_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'rfi_data', 'ccbc_analyst');

perform ccbc_private.upsert_policy('ccbc_analyst can always insert', 'rfi_data', 'insert', 'ccbc_analyst',
'true');
end
$grant$;

comment on table ccbc_public.rfi_data is 'Table to hold applicant form data';

comment on column ccbc_public.rfi_data.id is 'The unique id of the form data';

comment on column ccbc_public.rfi_data.json_data is 'The data entered into the form by the respondent';

comment on column ccbc_public.rfi_data.last_edited_page is 'Column saving the key of the last edited form page';

comment on column ccbc_public.rfi_data.rfi_data_status_type_id is 'Column referencing the form data status type, defaults to draft';

commit;
