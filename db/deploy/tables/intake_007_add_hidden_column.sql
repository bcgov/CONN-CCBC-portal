-- deploy ccbc:tables/intake_007_add_hidden_column to pg

begin;

alter table ccbc_public.intake add column hidden boolean default 'false';

comment on column ccbc_public.intake.hidden is 'A column to denote whether the intake is visible to the public';

commit;
