-- Revert ccbc:mutations/create_announcement_record from pg

BEGIN;

drop function if exists ccbc_public.create_announcement_record(project_numbers varchar, json_data jsonb, old_row_id int);
drop function if exists ccbc_public.create_announcement_record(project_numbers varchar, json_data jsonb);
drop function if exists ccbc_public.create_announcement;

COMMIT;
