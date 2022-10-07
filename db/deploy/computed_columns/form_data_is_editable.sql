-- Deploy ccbc:computed_columns/form_data_is_editable to pg

begin;

create or replace function ccbc_public.form_data_is_editable(form_data ccbc_public.form_data) returns boolean as
$$
  select ((id is not null and form_data.form_data_status_type_id = 'submitted') or form_data.form_data_status_type_id = 'draft'
  )from ccbc_public.open_intake();
$$ language sql stable;

grant execute on function ccbc_public.form_data_is_editable to ccbc_auth_user;

comment on function ccbc_public.form_data_is_editable is 'computed column to display whether form_data is editable or not';

commit;
