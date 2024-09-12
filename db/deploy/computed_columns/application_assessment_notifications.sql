-- Deploy ccbc:computed_columns/application_assessment_notifications to pg

BEGIN;

create or replace function ccbc_public.application_assessment_notifications(application ccbc_public.application) returns setof ccbc_public.notification as
$$
    select distinct on (notification_type) *
    from ccbc_public.notification
    where application_id = application_id
    ORDER BY notification_type, created_at DESC;
$$ language sql stable;

grant execute on function ccbc_public.application_assessment_notifications to ccbc_analyst;
grant execute on function ccbc_public.application_assessment_notifications to ccbc_admin;
grant execute on function ccbc_public.application_assessment_notifications to ccbc_auth_user;

comment on function ccbc_public.application_assessment_notifications is 'Computed column to get assessment notifications by assessment type';

COMMIT;
