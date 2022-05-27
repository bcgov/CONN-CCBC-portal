-- Revert ccbc:util_functions/upsert_policy from pg

begin;

drop function ccbc_private.upsert_policy(text, text, text, text, text, text);
drop function ccbc_private.upsert_policy(text, text, text, text, text, text, text);

commit;
