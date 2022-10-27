-- Revert ccbc:tables/application_001_add_analyst_permission from pg

begin;

drop policy if exists ccbc_analyst_can_see_received_applications on ccbc_public.application;

commit;
