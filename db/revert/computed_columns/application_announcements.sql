-- Deploy ccbc:computed_columns/application_announcements to pg

begin;

create or replace function ccbc_public.application_announcements(application ccbc_public.application) returns setof ccbc_public.announcement as $$

  select row(ad.*) from ccbc_public.announcement as ad
  inner join ccbc_public.application_announcement as app
  on app.announcement_id = ad.id 
  where app.application_id = application.id
  and ad.archived_at is null
  order by ad.id;

$$ language sql stable;

grant execute on function ccbc_public.application_announcements to ccbc_admin;
grant execute on function ccbc_public.application_announcements to ccbc_analyst;

comment on function ccbc_public.application_announcements is 'Computed column that returns list of announcements for the application';

commit;
