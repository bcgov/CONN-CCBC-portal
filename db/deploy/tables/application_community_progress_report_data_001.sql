-- Deploy ccbc:tables/application_community_progress_report_data_001 to pg

begin;

do
$grant$
begin

-- Grant ccbc_admin permissions
perform ccbc_private.grant_permissions('update', 'application_community_progress_report_data', 'ccbc_admin');

-- Grant ccbc_analyst permissions
perform ccbc_private.grant_permissions('update', 'application_community_progress_report_data', 'ccbc_analyst');

end
$grant$;

commit;
