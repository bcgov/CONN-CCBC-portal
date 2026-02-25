-- Deploy ccbc:tables/change_log_data to pg

begin;

create table ccbc_public.change_log_data (
  id integer primary key generated always as identity,
  json_data jsonb not null
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'change_log_data');

GRANT TRIGGER ON ccbc_public.change_log_data TO ccbc;
select audit.enable_tracking('ccbc_public.change_log_data'::regclass);

do
$grant$
begin

  perform ccbc_private.grant_permissions('select', 'change_log_data', 'ccbc_admin');
  perform ccbc_private.grant_permissions('insert', 'change_log_data', 'ccbc_admin');
  perform ccbc_private.grant_permissions('update', 'change_log_data', 'ccbc_admin');

  perform ccbc_private.grant_permissions('select', 'change_log_data', 'ccbc_analyst');
  perform ccbc_private.grant_permissions('insert', 'change_log_data', 'ccbc_analyst');
  perform ccbc_private.grant_permissions('update', 'change_log_data', 'ccbc_analyst');

  perform ccbc_private.grant_permissions('select', 'change_log_data', 'cbc_admin');
  perform ccbc_private.grant_permissions('insert', 'change_log_data', 'cbc_admin');
  perform ccbc_private.grant_permissions('update', 'change_log_data', 'cbc_admin');

  perform ccbc_private.grant_permissions('select', 'change_log_data', 'super_admin');
  perform ccbc_private.grant_permissions('insert', 'change_log_data', 'super_admin');
  perform ccbc_private.grant_permissions('update', 'change_log_data', 'super_admin');

end
$grant$;

comment on table ccbc_public.change_log_data is 'Cached change log data for the analyst change log table';
comment on column ccbc_public.change_log_data.json_data is 'Serialized change log payload';

commit;
