-- Deploy ccbc:tables/application_announcement_001_operation to pg

begin;

alter table ccbc_public.application_announcement add column history_operation varchar(1000) default 'created';

commit;
