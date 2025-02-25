-- Revert ccbc:mutations/save_fnha_contribution from pg

BEGIN;

drop function ccbc_public.save_fnha_contribution(int, decimal, text);

COMMIT;
