-- Deploy ccbc:trigger_functions/create_draft_status to pg
BEGIN;

create or replace function ccbc_private.create_draft_status()
returns trigger as $$
begin
    insert into ccbc_public.application_status (application_id, status)
     VALUES (new.id, 'draft');
    return new;
end
$$ language plpgsql;

grant execute on function ccbc_private.create_draft_status to ccbc_auth_user;

COMMIT;
