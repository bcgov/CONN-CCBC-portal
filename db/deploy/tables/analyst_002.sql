-- Deploy ccbc:tables/analyst_001.sql to pg

begin;

alter table ccbc_public.analyst
add column active boolean default true;

commit;
