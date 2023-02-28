-- Deploy ccbc:import/import_once to pg

BEGIN;

create or replace function ccbc_public.import_once() returns table(result_id int)
as $function$
begin
    return query select 0 as result_id; 
end;
$function$ language plpgsql volatile;
-- grant execute on function ccbc_public.import_once to ccbc;
COMMIT;
