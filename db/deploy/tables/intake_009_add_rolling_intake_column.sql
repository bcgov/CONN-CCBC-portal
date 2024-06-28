-- Deploy ccbc:tables/intake_009_add_rolling_intake_column to pg

BEGIN;

alter table ccbc_public.intake add column rolling_intake boolean default 'false';

comment on column ccbc_public.intake.rolling_intake is 'A column to denote whether the intake is a rolling intake';

COMMIT;
