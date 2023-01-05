-- deploy ccbc:tables/assessment_type to pg

begin;

create table ccbc_public.assessment_type(
  name varchar(1000) primary key,
  description varchar(1000)
);

do
$grant$
begin

perform ccbc_private.grant_permissions('select', 'assessment_type', 'ccbc_analyst');
perform ccbc_private.grant_permissions('select', 'assessment_type', 'ccbc_admin');

end
$grant$;

comment on table ccbc_public.assessment_type is 'Table containing the different assessment types that can be assigned to an assessment';

comment on column ccbc_public.assessment_type.name is 'Name of and primary key of the type of an assessment';

comment on column ccbc_public.assessment_type.description is 'Description of the assessment type';

insert into ccbc_public.assessment_type (name, description) values
('screening', 'Screening'),
('technical', 'Technical'),
('projectManagement', 'Project Management'),
('financialRisk', 'Financial Risk'),
('permitting', 'Permitting'),
('gis', 'GIS');

commit;
