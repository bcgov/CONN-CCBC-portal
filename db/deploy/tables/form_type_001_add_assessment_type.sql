-- deploy ccbc:tables/form_type_001_add_assessment_type to pg

begin;

insert into ccbc_public.form_type (name, description) values ('assessment', 'Schema that is part of the assessment of an application');

commit;
