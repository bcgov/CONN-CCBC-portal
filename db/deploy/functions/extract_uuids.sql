-- Deploy ccbc:functions/extract_uuids to pg

begin;

create or replace function ccbc_public.extract_uuids(json_data jsonb)
returns uuid[] as $$
declare
 result uuid[] := '{}';
 queue jsonb[] := array[json_data];
 current_element jsonb;
 iterator record;
begin
  while array_length(queue,1) > 0
  loop
  -- get first element from queue
    current_element := queue[1];
    -- pop queued element
    queue := array_remove(queue, current_element);
    -- if we have an object
    if jsonb_typeof(current_element) = 'object' then
      for iterator in select * from jsonb_each(current_element)
      loop
      -- iterate through keys for uuid
        if iterator.key = 'uuid' then
        -- if uuid present, add to results
          result := array_append(result,(select trim( both '"' from iterator.value::text))::uuid);
        else
        -- otherwise, queue up others
          queue := array_append(queue,iterator.value);
        end if;
      end loop;
    end if;
    -- if we have a jsonb array
    if jsonb_typeof(current_element) = 'array' then
    -- iterate through jsonb array
      for iterator in select * from jsonb_array_elements(current_element) loop
        -- append to queue if jsonb is of type object (we aren't concerned with strings)
        if jsonb_typeof(iterator.value) = 'object' then
          queue := array_append(queue, iterator.value);
        end if;
      end loop;
    end if;
  end loop;
  return result;
end;
$$ language plpgsql;

grant execute on function ccbc_public.extract_uuids to ccbc_auth_user, ccbc_analyst, ccbc_admin;

comment on function ccbc_public.extract_uuids(jsonb) is 'Utility function to extract all uuids from a jsonb column';

commit;
