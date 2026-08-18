-- Deploy ccbc:tables/feature_flag to pg

begin;

create table ccbc_public.feature_flag(
  id integer primary key generated always as identity,
  flag_key text not null,
  is_enabled boolean not null default false,
  value jsonb,
  description text,
  constraint feature_flag_flag_key_key unique (flag_key)
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'feature_flag');

do
$grant$
begin

perform ccbc_private.grant_permissions('select', 'feature_flag', 'ccbc_guest');
perform ccbc_private.grant_permissions('select', 'feature_flag', 'ccbc_auth_user');
perform ccbc_private.grant_permissions('select', 'feature_flag', 'ccbc_analyst');
perform ccbc_private.grant_permissions('select', 'feature_flag', 'ccbc_admin');
perform ccbc_private.grant_permissions('select', 'feature_flag', 'cbc_admin');
perform ccbc_private.grant_permissions('select', 'feature_flag', 'super_admin');
perform ccbc_private.grant_permissions('select', 'feature_flag', 'ccbc_job_executor');
perform ccbc_private.grant_permissions('select', 'feature_flag', 'ccbc_archiver');
perform ccbc_private.grant_permissions('select', 'feature_flag', 'ccbc_service_account');

perform ccbc_private.grant_permissions('update', 'feature_flag', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'feature_flag', 'super_admin');

end
$grant$;

comment on table ccbc_public.feature_flag is 'Internally-managed feature flags, read by both portals to gate UI and content';
comment on column ccbc_public.feature_flag.id is 'Unique ID for the feature flag';
comment on column ccbc_public.feature_flag.flag_key is 'The unique key code checks to look up this flag, e.g. show_lead';
comment on column ccbc_public.feature_flag.is_enabled is 'Whether the flag is currently on; the single value most call sites need';
comment on column ccbc_public.feature_flag.value is 'Optional JSON payload for flags that carry data beyond on/off, e.g. banner text/variant';
comment on column ccbc_public.feature_flag.description is 'Human-readable note on what the flag controls, shown in the admin UI';

insert into ccbc_public.feature_flag (flag_key, is_enabled, value, description) values
('header-banner', false, '{"message": null, "type": "warn", "environment-indicator": true}'::jsonb, 'Content for the site-wide header banner shown on the portal'),
('open_intake_alert', true, '{"variant": "success", "text": "Applications are now being accepted."}'::jsonb, 'Banner shown to applicants while an intake is open'),
('closed_intake_alert', true, null, 'Banner shown to applicants while an intake is closed'),
('show_subtracted_time', true, '30'::jsonb, 'Number of minutes subtracted from submission description time'),
('internal_intake', true, null, 'Whether the internal (CBC-only) intake is enabled on the applicant dashboard'),
('show_lead', false, null, 'Whether the lead application column/actions are shown to analysts'),
('show_claims', false, null, 'Whether the claims section is shown on the analyst project page'),
('show_summary_map', true, null, 'Whether the map is shown on the analyst application summary page');

commit;
