-- revert ccbc:tables/form_type_001_add_assessment_type from pg

begin;

delete from ccbc_public.form_type where name = 'assessment';

commit;
