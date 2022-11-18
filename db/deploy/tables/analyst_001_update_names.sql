-- Deploy ccbc:tables/analyst_001_update_names to pg

begin;

delete from ccbc_public.analyst where given_name = 'Meherzad' and family_name = 'Romer';

update ccbc_public.analyst set given_name = 'Carreen' where given_name = 'Careen' and family_name = 'Unguran';

commit;
