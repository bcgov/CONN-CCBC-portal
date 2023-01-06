-- revert ccbc:tables/assessment from pg

begin;

drop table ccbc_public.assessment_data;

commit;
