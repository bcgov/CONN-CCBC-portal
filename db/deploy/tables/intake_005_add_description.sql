-- Deploy ccbc:tables/intake_005_add_description to pg

begin;

alter table ccbc_public.intake add column description text default null;

comment on column ccbc_public.intake.description is 'A description of the intake';

commit;
