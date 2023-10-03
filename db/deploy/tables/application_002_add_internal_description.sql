-- Deploy ccbc:application_002_add_internal_description to pg

begin;

alter table ccbc_public.application add column internal_description text;

comment on column ccbc_public.application.internal_description is 'Internal project description for analysts';

do
$$
begin

perform ccbc_private.grant_permissions('update', 'application', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'application', 'ccbc_admin');

perform ccbc_private.upsert_policy('ccbc_analyst_update_application', 'application', 'update', 'ccbc_analyst','id in (select application_id from ccbc_public.application_status where status=' || quote_literal('received') || ')');
perform ccbc_private.upsert_policy('ccbc_admin_update_application', 'application', 'update', 'ccbc_admin','id in (select application_id from ccbc_public.application_status where status=' || quote_literal('received') || ')');


end
$$;

commit;
