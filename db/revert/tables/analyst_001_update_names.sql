-- Revert ccbc:tables/analyst_001_update_names from pg

begin;

insert into ccbc_public.analyst (given_name, family_name) values ('Meherzad' ,'Romer');

update ccbc_public.analyst set given_name = 'Careen' where given_name = 'Carreen' and family_name = 'Unguran';

commit;
