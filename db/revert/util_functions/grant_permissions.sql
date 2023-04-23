-- Revert ccbc:util_functions/grant_permissions from pg

begin;

drop function if exists ccbc_private.grant_permissions(text, text, text, text);
drop function if exists ccbc_private.grant_permissions(text, text, text, text[], text);

commit;
