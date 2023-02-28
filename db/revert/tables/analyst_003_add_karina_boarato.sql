-- Revert ccbc:tables/analyst_003_add_karina_boarato from pg

begin;

delete from ccbc_public.analyst where given_name = 'Karina' and family_name='Boarato';

commit;
