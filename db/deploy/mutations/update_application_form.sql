-- Deploy ccbc:mutations/update_application_form to pg

begin;
-- Since we're updating the function definition, need to manually drop
drop function ccbc_public.update_application_form;

create or replace function ccbc_public.update_application_form(form_data_row_id int, json_data jsonb, last_edited_page varchar, client_updated_at timestamp with time zone)
returns ccbc_public.form_data as
$func$
declare
  current_updated_at timestamp with time zone;
  current_last_edited_page varchar;
  updated_form_data ccbc_public.form_data;
begin

  select updated_at, fd.last_edited_page into current_updated_at, current_last_edited_page from ccbc_public.form_data as fd where id = form_data_row_id;

  -- Adding a buffer, can be used to update if someone happens to have a version of the form on a separate page that was opened <3 seconds from the last save if the last.
  if current_last_edited_page != last_edited_page and client_updated_at < current_updated_at  - interval '3 second' then
    raise exception 'Data is Out of Sync, client_updated_at: % < current_updated_at: %, current_last_edited_page: %, client_last_edited_page: %', client_updated_at, current_updated_at - interval '3 second', current_last_edited_page, last_edited_page;
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
