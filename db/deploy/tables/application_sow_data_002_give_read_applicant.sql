-- Deploy ccbc:tables/application_sow_data_002_give_read_applicant to pg

begin;
do
$grant$
begin

perform ccbc_private.grant_permissions('select', 'application_sow_data', 'ccbc_auth_user');

end
$grant$;

commit;
