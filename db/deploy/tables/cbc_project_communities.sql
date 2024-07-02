-- Deploy ccbc:tables/cbc_project_communities to pg

BEGIN;

create table ccbc_public.cbc_project_communities(
  id integer primary key generated always as identity,
  cbc_id integer references ccbc_public.cbc(id),
  communities_source_data_id integer references ccbc_public.communities_source_data(geographic_name_id)
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'cbc_project_communities');

do
$grant$
begin

-- Grant ccbc_admin permissions
perform ccbc_private.grant_permissions('select', 'cbc_project_communities', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'cbc_project_communities', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'cbc_project_communities', 'ccbc_admin');

-- Grant ccbc_analyst permissions
perform ccbc_private.grant_permissions('select', 'cbc_project_communities', 'ccbc_analyst');

-- Grant ccbc_service_account permissions
perform ccbc_private.grant_permissions('select', 'cbc_project_communities', 'cbc_admin');
perform ccbc_private.grant_permissions('insert', 'cbc_project_communities', 'cbc_admin');
perform ccbc_private.grant_permissions('update', 'cbc_project_communities', 'cbc_admin');

end
$grant$;

comment on table ccbc_public.cbc_project_communities is 'Table containing the communities data for a CBC project';
comment on column ccbc_public.cbc_project_communities.id is 'Unique ID for the row';
comment on column ccbc_public.cbc_project_communities.cbc_id is 'The cbc id of the record';
comment on column ccbc_public.cbc_project_communities.communities_source_data_id is 'The reference to the communities source data id';

COMMIT;
