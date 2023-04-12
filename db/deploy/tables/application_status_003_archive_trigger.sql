-- Deploy ccbc:tables/application_status_003_archive_trigger to pg

BEGIN;

    select ccbc_private.upsert_timestamp_columns('ccbc_public', 'application_status');
    select ccbc_private.upsert_archive_trigger('ccbc_public', 'application_status');
    select ccbc_private.upsert_policy('ccbc_auth_user_update_application_status', 'application_status', 'update', 'ccbc_auth_user', 'application_id in (select id from ccbc_public.application where owner=(select sub from ccbc_public.session()))');

    create policy application_status_archive_by_user on ccbc_public.application_status
      as restrictive for update to ccbc_auth_user USING
      (status in (select name from ccbc_public.application_status_type where visible_by_applicant = true));

    create policy application_status_archive_by_analyst on ccbc_public.application_status
      as restrictive for update to ccbc_analyst USING (true);

    create policy application_status_archive_by_admin on ccbc_public.application_status
      as restrictive for update to ccbc_admin USING (true);

COMMIT;
