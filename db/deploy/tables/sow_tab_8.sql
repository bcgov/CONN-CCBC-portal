-- Deploy ccbc:tables/sow_tab_8 to pg

begin;

create table ccbc_public.sow_tab_8(
  id integer primary key generated always as identity,
  sow_id integer references ccbc_public.application_sow_data(id),
  json_data jsonb not null default '{}'::jsonb
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'sow_tab_8');

create index sow_tab_8_sow_id_index on ccbc_public.sow_tab_8(sow_id);
do
$grant$
begin

-- Grant ccbc_admin permissions
perform ccbc_private.grant_permissions('select', 'sow_tab_8', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'sow_tab_8', 'ccbc_admin');

-- Grant ccbc_analyst permissions
perform ccbc_private.grant_permissions('select', 'sow_tab_8', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'sow_tab_8', 'ccbc_analyst');

end
$grant$;

comment on table ccbc_public.sow_tab_8 is 'Table containing the detailed budget data for the given SoW';
comment on column ccbc_public.sow_tab_8.id is 'Unique ID for the SoW Tab 8';
comment on column ccbc_public.sow_tab_8.sow_id is 'ID of the SoW';
comment on column ccbc_public.sow_tab_8.json_data is 'The data imported from the Excel filled by the respondent';

commit;