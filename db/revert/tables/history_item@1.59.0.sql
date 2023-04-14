-- Deploy ccbc:types/history_item to pg

BEGIN;

create table if not exists ccbc_public.history_item (
    application_id integer,
    created_at timestamptz,
    op audit.operation,
    table_name name,
    record_id uuid,
    record jsonb,
    old_record jsonb,
    item varchar,
    family_name varchar,
    given_name varchar,
    session_sub varchar
);

do
$policy$
begin
  perform ccbc_private.grant_permissions('insert', 'history_item', 'ccbc_admin');
  perform ccbc_private.grant_permissions('insert', 'history_item', 'ccbc_analyst');
  perform ccbc_private.grant_permissions('select', 'history_item', 'ccbc_admin');
  perform ccbc_private.grant_permissions('select', 'history_item', 'ccbc_analyst');
  perform ccbc_private.grant_permissions('delete', 'history_item', 'ccbc_admin');
  perform ccbc_private.grant_permissions('delete', 'history_item', 'ccbc_analyst');

end
$policy$;

comment on column ccbc_public.history_item.application_id is
  'Application Id.';
comment on column ccbc_public.history_item.created_at is
  'Timestamp of the operation recorded.';
comment on column ccbc_public.history_item.op is
  'Type of operation: INSERT/UPDATE/DELETE/TRUNCATE/SNAPSHOT.';
comment on column ccbc_public.history_item.table_name is
  'Table name.';
comment on column ccbc_public.history_item.record_id is
  'Identifier that uniquely identifies a record by primary key [primary key + table_oid].';
comment on column ccbc_public.history_item.record is
  'New record in Json format.';
comment on column ccbc_public.history_item.old_record is
  'Old record in Json format.';
comment on column ccbc_public.history_item.item is
  'Main object affected by the operation (i.e. status, or file name or RFI type).';
comment on column ccbc_public.history_item.family_name is
  'First Name of the user who performed the operation.';
comment on column ccbc_public.history_item.given_name is
  'Last Name of the user who performed the operation.';
comment on column ccbc_public.history_item.session_sub is
  'Session sub of the user who performed the operation.';

COMMIT;
