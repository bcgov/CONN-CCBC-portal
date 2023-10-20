-- deploy ccbc:tables/intake_008_hidden_code_column to pg

begin;

alter table ccbc_public.intake add column hidden_code uuid default null;

comment on column ccbc_public.intake.hidden_code is 'A column that stores the code used to access the hidden intake. Only used on intakes that are hidden';

commit;
