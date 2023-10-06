-- deploy ccbc:tables/application_002_analyst_can_see_withdrawn to pg

begin;
do
$$
begin
perform ccbc_private.upsert_policy('ccbc_analyst_can_see_received_applications',
'application','select','ccbc_analyst','id in (select application_id from ccbc_public.application_status where status=' || quote_literal('received') || 'or status=' || quote_literal('withdrawn') || ')');

perform ccbc_private.upsert_policy('ccbc_admin_can_see_received_applications',
'application','select','ccbc_admin','id in (select application_id from ccbc_public.application_status where status=' || quote_literal('received') || 'or status=' || quote_literal('withdrawn') || ')');
end
$$;
commit;
