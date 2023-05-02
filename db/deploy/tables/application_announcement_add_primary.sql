-- Deploy ccbc:tables/application_announcement_add_primary to pg

BEGIN;

alter table ccbc_public.application_announcement add column if not exists is_primary  bool DEFAULT 'f';

comment on column ccbc_public.application_announcement.is_primary is 'Flag to identify either announcement is primary or secondary';

COMMIT;
