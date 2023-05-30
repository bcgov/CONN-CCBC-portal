-- Deploy ccbc:tables/sow_tab_7.sql to pg

begin;

create table ccbc_public.sow_tab_7(
  id integer primary key generated always as identity,
  sow_id integer references ccbc_public.application_sow_data(id),
  json_data jsonb not null default '{}'::jsonb
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'sow_tab_7');

create index sow_tab_7_sow_id_index on ccbc_public.sow_tab_7(sow_id);


do
$grant$
begin
-- admin
perform ccbc_private.grant_permissions('select', 'sow_tab_7', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'sow_tab_7', 'ccbc_admin');

-- analyst
perform ccbc_private.grant_permissions('select', 'sow_tab_7', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'sow_tab_7', 'ccbc_analyst');


end
$grant$;

commit;
