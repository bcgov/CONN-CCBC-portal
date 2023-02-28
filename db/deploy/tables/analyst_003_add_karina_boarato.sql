-- Deploy ccbc:tables/analyst_003_add_karina_boarato to pg

begin;

insert into ccbc_public.analyst (given_name, family_name) values ('Karina', 'Boarato');

commit;
