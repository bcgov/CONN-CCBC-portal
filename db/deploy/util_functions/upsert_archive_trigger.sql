-- Deploy ccbc:util_functions/upsert_archive_trigger to pg
-- requires: trigger_function/set_archived

begin;

create or replace function ccbc_private.upsert_archive_trigger(
  table_schema_name text,
  table_name text,
  user_table_schema_name text default 'ccbc_public',
  user_table_name text default 'ccbc_user'
)
returns void as $$

declare
  column_string text;
  index_string text;
  comment_string text;
  trigger_string text;

begin

  if not exists (select *
    from information_schema.triggers
    where event_object_table = table_name
    and event_object_schema = table_schema_name
    and trigger_name = '_300_archive'
  ) then
    trigger_string := concat(
      'create trigger _300_archive before insert on ', table_schema_name, '.', table_name,
      ' for each row execute procedure ccbc_private.set_archived()'
    );
    execute(trigger_string);
  end if;


end;
$$ language plpgsql;

comment on function ccbc_private.upsert_archive_trigger(text, text, text, text)
  is $$
  an internal function that applies the _300_archive trigger

  example usage:

  create table some_schema.some_table (
    ...
  );
  select ccbc_private.upsert_timestamp_columns(
  table_schema_name => 'some_schema',
  table_name => 'some_table');
  $$;

commit;
