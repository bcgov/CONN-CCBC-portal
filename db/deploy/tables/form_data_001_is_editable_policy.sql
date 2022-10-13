-- Deploy ccbc:tables/form_data_001_is_editable_policy to pg

-- This RLS policy prevents the form_data from being edited, by only doing a using statement
-- as the new record might not be editable after update
-- As an example, withdrawing an application sets it to committed and is no longer editable

begin;

  create policy form_data_editable_update_policy on ccbc_public.form_data
  as restrictive for update
  to public using (ccbc_public.form_data_is_editable(form_data))
  with check (true);

commit;
