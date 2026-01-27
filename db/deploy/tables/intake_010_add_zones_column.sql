-- Deploy ccbc:tables/intake_010_add_zones_column to pg

BEGIN;

alter table ccbc_public.intake add column zones int[];

update ccbc_public.intake set zones = ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]::int[] where zones is null and archived_at is null;

alter table ccbc_public.intake
  alter column zones set default ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]::int[];

comment on column ccbc_public.intake.zones is 'A list of zones accepted for the intake';

COMMIT;
