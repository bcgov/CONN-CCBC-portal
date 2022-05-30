-- Revert ccbc:util_functions/verify_grants from pg

begin;

drop function ccbc_private.verify_grant(text, text, text, text);
drop function ccbc_private.verify_grant(text, text, text, text[], text);

commit;
