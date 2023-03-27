begin;

insert into ccbc_public.application_status_type (name, description, status_order) values ('fake_status', 'Fake Status', 1000) on conflict (name) do nothing;

commit;
