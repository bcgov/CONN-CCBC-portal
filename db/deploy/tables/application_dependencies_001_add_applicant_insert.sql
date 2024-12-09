-- Deploy ccbc:tables/application_dependencies_001_add_applicant_insert to pg

begin;

do
$$
begin

perform ccbc_private.grant_permissions('insert', 'application_dependencies', 'ccbc_auth_user');

end
$$;

commit;
