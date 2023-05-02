-- Revert ccbc:mutations/update_announcement from pg 

begin;

drop function ccbc_public.update_announcement;

commit;