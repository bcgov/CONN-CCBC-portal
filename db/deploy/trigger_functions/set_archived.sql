-- Deploy ccbc:trigger_functions/set_archived to pg 
-- requires: schemas/private

begin;

create or replace function ccbc_private.set_archived()
  returns trigger as $$

declare
  user_sub varchar;
  user_id int;

begin
  user_sub := (select sub from ccbc_public.session());
  user_id := (select id from ccbc_public.ccbc_user where ccbc_user.session_sub = user_sub);
  if tg_op = 'INSERT' then
    if to_jsonb(new) ? 'created_at' then
      new.created_at = now();
      new.created_by = user_id;
    end if;
    if to_jsonb(new) ? 'updated_at' then
      new.updated_at = now();
      new.updated_by = user_id;
    end if;
    
  end if;
  return new;
end;
$$ language plpgsql;

grant execute on function ccbc_private.update_timestamps to ccbc_auth_user;

comment on function ccbc_private.update_timestamps()
  is $$
  a trigger to set created_at and updated_at columns.
  example usage:

  create table some_schema.some_table (
    ...
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
  );
  create trigger _100_timestamps
    before insert or update on some_schema.some_table
    for each row
    execute procedure ccbc_private.update_timestamps();
  $$;

commit;
