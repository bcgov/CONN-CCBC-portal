-- Deploy ccbc:tables/sow_grant_update to pg

begin;

do
$$
begin

    -- admin
    perform ccbc_private.grant_permissions('update', 'application_sow_data', 'ccbc_admin');
    perform ccbc_private.grant_permissions('update', 'sow_tab_1', 'ccbc_admin');
    perform ccbc_private.grant_permissions('update', 'sow_tab_2', 'ccbc_admin');
    perform ccbc_private.grant_permissions('update', 'sow_tab_7', 'ccbc_admin');
    perform ccbc_private.grant_permissions('update', 'sow_tab_8', 'ccbc_admin');

    --analyst
    perform ccbc_private.grant_permissions('update', 'sow_tab_1', 'ccbc_analyst');
    perform ccbc_private.grant_permissions('update', 'sow_tab_2', 'ccbc_analyst');
    perform ccbc_private.grant_permissions('update', 'sow_tab_7', 'ccbc_analyst');
    perform ccbc_private.grant_permissions('update', 'sow_tab_8', 'ccbc_analyst');
    perform ccbc_private.grant_permissions('update', 'application_sow_data', 'ccbc_analyst');

end
$$;

commit;
