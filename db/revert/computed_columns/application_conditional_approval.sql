-- Revert ccbc:computed_columns/application_conditional_approval from pg

begin;

drop function ccbc_public.application_conditional_approval;

commit;
