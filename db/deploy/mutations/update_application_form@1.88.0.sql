-- Deploy ccbc:mutations/update_application_form to pg

begin;

create or replace function ccbc_public.update_application_form(form_data_row_id int, json_data jsonb, last_edited_page varchar)
returns ccbc_public.form_data as
$$

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
returning *;

$$ language sql;

grant execute on function ccbc_public.update_application_form to ccbc_auth_user;

comment on function ccbc_public.update_application_form is
$$
Mutation to update the "application" form.
This mutation should only be used by applicants as it sets the submission page data
$$;


commit;
