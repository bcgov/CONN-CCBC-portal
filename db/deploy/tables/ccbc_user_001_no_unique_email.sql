-- Deploy ccbc:tables/ccbc_user_001_no_unique_email to pg

begin;

drop index ccbc_public.ccbc_user_email_address;

commit;
