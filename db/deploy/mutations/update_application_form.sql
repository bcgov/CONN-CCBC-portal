-- Deploy ccbc:mutations/update_application_form to pg

begin;
-- Since we're updating the function definition, need to manually drop
drop function ccbc_public.update_application_form;

create or replace function ccbc_public.update_application_form(form_data_row_id int, json_data jsonb, last_edited_page varchar, client_updated_at timestamp with time zone)
returns ccbc_public.form_data as
$func$
declare
  current_updated_at timestamp with time zone;
  updated_form_data ccbc_public.form_data;
begin

  select updated_at into current_updated_at from ccbc_public.form_data where id = form_data_row_id;
  -- Adding a buffer, can be used to update if someone happens to have a version of the form that was opened <1 second from the last save
  -- Risk is that there can still be overwritten data.
  if client_updated_at < current_updated_at  - interval '1 second' then
    raise exception 'Data is Out of Sync';
  end if;

  update ccbc_public.form_data
  set
  -- use json concatenation operator to merge the provided json_data with the dynamic submission values
    json_data = $2 || jsonb_build_object(
      'submission', coalesce($2->'submission', jsonb_build_object()) || jsonb_build_object(
        'submissionCompletedFor', $2->'organizationProfile'->'organizationName',
        'submissionDate', (date_trunc('day', now(), 'America/Vancouver')::date)
      )
    ),
    last_edited_page = $3
  where id = form_data_row_id
  returning * into updated_form_data;

  return updated_form_data;
end;
$func$ language plpgsql;

grant execute on function ccbc_public.update_application_form to ccbc_auth_user;

comment on function ccbc_public.update_application_form is
$$
Mutation to update the "application" form.
This mutation should only be used by applicants as it sets the submission page data
$$;


commit;
