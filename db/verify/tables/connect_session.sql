-- Verify ccbc:tables/connect_session on pg

begin;

select sid, sess, expire from ccbc_private.connect_session where false;

rollback;
