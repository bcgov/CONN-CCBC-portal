-- deploy ccbc:tables/analyst_002_update_lia_lastname to pg

begin;

update ccbc_public.analyst set family_name = 'Pittappillil'
  where given_name = 'Lia' and family_name = 'Wilson';

commit;
