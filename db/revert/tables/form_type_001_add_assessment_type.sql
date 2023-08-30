-- revert ccbc:tables/form_type_001_add_assessment_type from pg

begin;

delete from ccbc_public.application_form_data where form_data_id in 
    (select id from ccbc_public.form_data where form_schema_id in 
        (select id from ccbc_public.form where form_type='assessment'));
delete from ccbc_public.form_data where form_schema_id in 
    (select id from ccbc_public.form where form_type='assessment');
delete from ccbc_public.form where form_type='assessment';
delete from ccbc_public.form_type where name = 'assessment';

commit;
