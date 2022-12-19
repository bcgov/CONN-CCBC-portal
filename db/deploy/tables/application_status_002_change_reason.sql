-- Deploy ccbc:tables/application_status_002_change_reason to pg

begin;

  alter table ccbc_public.application_status add column change_reason varchar(1000) null;

  comment on column ccbc_public.application_status.change_reason is 'Change reason for analyst status change';

  create policy application_status_visible on ccbc_public.application_status
      as restrictive for select to ccbc_auth_user USING
      (status in (select name from ccbc_public.application_status_type where visible_by_applicant = true));

  create policy application_status_insert_only_allowed on ccbc_public.application_status as restrictive to ccbc_auth_user
     with check
      (status in (select name from ccbc_public.application_status_type where visible_by_applicant = true));

commit;
