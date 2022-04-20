-- Revert ccbc:tables/connect_session from pg

begin;

drop table ccbc_private.connect_session;

commit;
