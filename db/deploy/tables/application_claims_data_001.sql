-- Deploy ccbc:tables/application_claims_data_001 to pg

begin;

alter table ccbc_public.application_claims_data add column history_operation varchar(1000) default 'created';

comment on column ccbc_public.application_claims_data.history_operation is 'Column to track if record was created, updated or deleted for history';

commit;
