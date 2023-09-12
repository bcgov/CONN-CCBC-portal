-- Deploy ccbc:tables/intake_007_add_hidden to pg
begin;

alter table ccbc_public.intake add column hidden integer default 0;

comment on column ccbc_public.intake.hidden is 'Flag to identify internal-only intake';

commit;
