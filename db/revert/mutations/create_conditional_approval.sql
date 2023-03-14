-- Revert ccbc:mutations/create_conditional_approval from pg

begin;

drop function ccbc_public.create_conditional_approval;

commit;
