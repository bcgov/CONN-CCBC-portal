-- Revert ccbc:tables/ccbc_user_001_no_unique_email from pg

begin;

create unique index ccbc_user_email_address on ccbc_public.ccbc_user(email_address);

commit;
