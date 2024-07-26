-- Deploy ccbc:tables/reporting_gcpe to pg

begin;

create table ccbc_public.reporting_gcpe(
  id integer primary key generated always as identity,
  report_data jsonb not null
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'reporting_gcpe');

-- enable audit/history
select audit.enable_tracking('ccbc_public.reporting_gcpe'::regclass);

do
$grant$
begin

-- Grant ccbc_admin permissions
perform ccbc_private.grant_permissions('select', 'reporting_gcpe', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'reporting_gcpe', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'reporting_gcpe', 'ccbc_admin');

-- Grant cbc_admin permissions
perform ccbc_private.grant_permissions('select', 'reporting_gcpe', 'cbc_admin');
perform ccbc_private.grant_permissions('insert', 'reporting_gcpe', 'cbc_admin');
perform ccbc_private.grant_permissions('update', 'reporting_gcpe', 'cbc_admin');

-- Grant ccbc_analyst permissions
perform ccbc_private.grant_permissions('select', 'reporting_gcpe', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'reporting_gcpe', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'reporting_gcpe', 'ccbc_analyst');

end
$grant$;

comment on table ccbc_public.reporting_gcpe is 'Table containing the gcpe report data';
comment on column ccbc_public.reporting_gcpe.id is 'Unique ID for the row for that report';
comment on column ccbc_public.reporting_gcpe.report_data is 'The JSON data used to generate the report, includes the generated file info';

commit;
