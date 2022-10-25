-- Deploy ccbc:tables/application_001_add_analyst_permission to pg

begin;


do
$$
begin
perform ccbc_private.grant_permissions('select', 'application', 'ccbc_analyst');
-- analyst can see applications RLS
perform ccbc_private.upsert_policy('ccbc_analyst_can_see_received_applications',
'application','select','ccbc_analyst','id in (select application_id from ccbc_public.application_status where status=' || quote_literal('received') || ')');
end
$$;

commit;
