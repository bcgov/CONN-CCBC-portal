-- deploy ccbc:tables/assessment to pg

begin;

create table ccbc_public.assessment_data(
  id integer primary key generated always as identity,
  application_id integer not null references ccbc_public.application(id),
  json_data jsonb not null default '{}'::jsonb,
  assessment_data_type varchar(1000) references ccbc_public.assessment_type(name)
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'assessment_data');

alter table ccbc_public.assessment_data force row level security;
alter table ccbc_public.assessment_data enable row level security;

grant usage, select on sequence ccbc_public.assessment_data_id_seq to ccbc_analyst;
grant usage, select on sequence ccbc_public.assessment_data_id_seq to ccbc_admin;

do
$grant$
begin
perform ccbc_private.grant_permissions('select', 'assessment_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'assessment_data', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'assessment_data', 'ccbc_admin');

perform ccbc_private.grant_permissions('select', 'assessment_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'assessment_data', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'assessment_data', 'ccbc_analyst');

perform ccbc_private.upsert_policy('ccbc_analyst can always insert', 'assessment_data', 'insert', 'ccbc_analyst',
'true');

perform ccbc_private.upsert_policy('ccbc_analyst can always select', 'assessment_data', 'select', 'ccbc_analyst',
'true');

perform ccbc_private.upsert_policy('ccbc_analyst can always update', 'assessment_data', 'update', 'ccbc_analyst',
'true');

perform ccbc_private.upsert_policy('ccbc_admin can always select', 'assessment_data', 'select', 'ccbc_admin',
'true');

perform ccbc_private.upsert_policy('ccbc_admin can always insert', 'assessment_data', 'insert', 'ccbc_admin',
'true');

perform ccbc_private.upsert_policy('ccbc_admin can always update', 'assessment_data', 'update', 'ccbc_admin',
'true');

end
$grant$;

-- copy all data
insert into ccbc_public.assessment_data(application_id, json_data, assessment_data_type)
  select afd.application_id, fd.json_data, 'screening'
  from ccbc_public.application_form_data as afd, ccbc_public.form_data as fd, ccbc_public.form as fs
  where afd.form_data_id = fd.id and fd.form_schema_id = fs.id and fs.slug = 'screeningAssessmentSchema';

-- delete remaining data? Or just archive...

commit;
