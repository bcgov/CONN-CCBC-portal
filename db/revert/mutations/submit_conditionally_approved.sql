-- Revert ccbc:mutations/submit_conditionally_approved from pg

begin;

drop function ccbc_public.submit_conditionally_approved;

commit;
