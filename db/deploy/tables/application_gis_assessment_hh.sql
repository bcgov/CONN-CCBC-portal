-- Deploy ccbc:tables/application_gis_assessment_hh to pg

begin;

create table ccbc_public.application_gis_assessment_hh(
  id integer primary key generated always as identity,
  application_id integer not null references ccbc_public.application(id),
  eligible integer default null,
  eligible_indigenous integer default null
);

do
$grant$
begin

perform ccbc_private.grant_permissions('select', 'application_gis_assessment_hh', 'ccbc_analyst');
perform ccbc_private.grant_permissions('select', 'application_gis_assessment_hh', 'ccbc_admin');

perform ccbc_private.grant_permissions('insert', 'application_gis_assessment_hh', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'application_gis_assessment_hh', 'ccbc_admin');

perform ccbc_private.grant_permissions('update', 'application_gis_assessment_hh', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'application_gis_assessment_hh', 'ccbc_admin');



end
$grant$;

commit;

comment on table ccbc_public.application_gis_assessment_hh is 'Table containing data for the gis assessment hh numbers';

comment on column ccbc_public.application_gis_assessment_hh.id is 'Primary key and unique identifier';

comment on column ccbc_public.application_gis_assessment_hh.application_id is 'The application_id of the application this record is associated with';

comment on column ccbc_public.application_gis_assessment_hh.eligible is 'The number of eligible households';

comment on column ccbc_public.application_gis_assessment_hh.eligible_indigenous is 'The number of eligible indigenous households';
