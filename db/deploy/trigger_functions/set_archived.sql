-- Deploy ccbc:trigger_functions/set_archived to pg 
-- requires: schemas/private

begin;

create or replace function ccbc_private.set_archived()
  returns trigger as $$

declare
  user_role varchar;
  user_sub varchar;
  user_id int;

begin
  user_sub := (select sub from ccbc_public.session());
  user_id := (select id from ccbc_public.ccbc_user where ccbc_user.session_sub = user_sub);
  user_role := (select current_role);

  -- RAISE NOTICE 'user_role is currently %', user_role; 
  if exists (SELECT 1 FROM information_schema.columns 
    WHERE table_schema = TG_TABLE_SCHEMA AND table_name=TG_TABLE_NAME AND column_name='application_id')
    and tg_op = 'INSERT' then
    if to_jsonb(new) ? 'created_at' then
      --  using `postgres` role to bypass RLS that prevents edit of the application created by another ccbc_auth_user
      set role postgres;
      EXECUTE 'UPDATE ' || quote_ident(TG_TABLE_SCHEMA)
        || '.' || quote_ident(TG_TABLE_NAME)
        || ' SET archived_at=now(), archived_by=$1 where application_id=$2 and archived_at is null and id <> $3'
        using user_id, new.application_id, new.id;
      execute 'set role '|| quote_ident(user_role);
    end if;    
  end if;
  return new;
end;
$$ language plpgsql;

grant execute on function ccbc_private.set_archived to ccbc_auth_user;

comment on function ccbc_private.set_archived()
  is $$
  a trigger to set archived_at/archived_by columns for older records with same application_id 
  example usage:

  create trigger _300_archive
    before insert on some_schema.some_table
    for each row
    execute procedure ccbc_private.set_archived();
  $$;

commit;
