-- revert ccbc:tables/analyst_002_update_lia_lastname from pg

begin;

update ccbc_public.analyst set family_name = 'Wilson'
  where given_name = 'Lia' and family_name = 'Pittappillil';

commit;
