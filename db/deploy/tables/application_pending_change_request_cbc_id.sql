-- Deploy ccbc:tables/application_pending_change_request_cbc_id to pg

BEGIN;


alter table ccbc_public.application_pending_change_request add column cbc_id integer references ccbc_public.cbc(id);

comment on column ccbc_public.application_pending_change_request.cbc_id is 'ID of the cbc application this application_pending_change_request belongs to';

COMMIT;
