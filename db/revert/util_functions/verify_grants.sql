-- Revert ccbc:util_functions/verify_grants from pg

begin;

drop function if exists ccbc_private.verify_grant(text, text, text, text);
drop function if exists ccbc_private.verify_grant(text, text, text, text[], text);

commit;
