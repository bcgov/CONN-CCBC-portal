-- revert ccbc:tables/assessment_type from pg

begin;

drop table ccbc_public.assessment_type;

commit;
