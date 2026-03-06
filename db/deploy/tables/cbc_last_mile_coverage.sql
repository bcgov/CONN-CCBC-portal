-- Deploy ccbc:tables/cbc_last_mile_coverage to pg

begin;

create sequence ccbc_public.cbc_last_mile_coverage_gid_seq;

create table ccbc_public.cbc_last_mile_coverage(
  gid integer not null default nextval('ccbc_public.cbc_last_mile_coverage_gid_seq'::regclass),
  proj_num numeric,
  project__ varchar(254),
  program varchar(254),
  original_p varchar(254),
  phase varchar(254),
  intake_num numeric,
  zones varchar(254),
  internal_s varchar(254),
  external_s varchar(254),
  change_req varchar(254),
  project_ti varchar(254),
  project_de varchar(254),
  applicant_ varchar(254),
  current_op varchar(254),
  f_830_mill varchar(254),
  federal_fu varchar(254),
  federal_pr varchar(254),
  project_ty varchar(254),
  transport_ varchar(254),
  highway_pr varchar(254),
  last_mile_ varchar(254),
  last_mile1 varchar(254),
  connected_ varchar(254),
  crtc_proje varchar(254),
  project_lo varchar(254),
  economic_r varchar(254),
  regional_d varchar(254),
  communitie numeric,
  indigenous numeric,
  household_ numeric,
  transport1 numeric,
  highway_km varchar(254),
  rest_areas varchar(254),
  funding_so varchar(254),
  bc_funding numeric,
  federal__1 numeric,
  applicant1 numeric,
  other_fund numeric,
  total_fnha numeric,
  total_proj numeric,
  conditiona varchar(254),
  agreement_ varchar(254),
  announced_ varchar(254),
  date_appli varchar(254),
  date_condi varchar(254),
  date_exter varchar(254),
  date_agree varchar(254),
  proposed_s varchar(254),
  proposed_c varchar(254),
  reporting_ varchar(254),
  date_annou varchar(254),
  f__project numeric,
  constructi varchar(254),
  milestone_ varchar(254),
  primary_ne varchar(254),
  secondary_ varchar(254),
  notes varchar(254),
  locked varchar(254),
  last_revie varchar(254),
  review_not varchar(254),
  error_log varchar(254),
  objectid_1 double precision,
  shape_leng numeric,
  shape_area numeric,
  geom geometry(MultiPolygonZM,4326)
);

alter table ccbc_public.cbc_last_mile_coverage add constraint cbc_last_mile_coverage_pkey primary key (gid);

alter sequence ccbc_public.cbc_last_mile_coverage_gid_seq owned by ccbc_public.cbc_last_mile_coverage.gid;

create index cbc_last_mile_coverage_geom_idx on ccbc_public.cbc_last_mile_coverage using gist (geom);

do
$grant$
begin

perform ccbc_private.grant_permissions('select', 'cbc_last_mile_coverage', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'cbc_last_mile_coverage', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'cbc_last_mile_coverage', 'ccbc_admin');

perform ccbc_private.grant_permissions('select', 'cbc_last_mile_coverage', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'cbc_last_mile_coverage', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'cbc_last_mile_coverage', 'ccbc_analyst');

perform ccbc_private.grant_permissions('select', 'cbc_last_mile_coverage', 'cbc_admin');
perform ccbc_private.grant_permissions('insert', 'cbc_last_mile_coverage', 'cbc_admin');
perform ccbc_private.grant_permissions('update', 'cbc_last_mile_coverage', 'cbc_admin');

perform ccbc_private.grant_permissions('select', 'cbc_last_mile_coverage', 'super_admin');
perform ccbc_private.grant_permissions('insert', 'cbc_last_mile_coverage', 'super_admin');
perform ccbc_private.grant_permissions('update', 'cbc_last_mile_coverage', 'super_admin');

end
$grant$;

comment on table ccbc_public.cbc_last_mile_coverage is 'Table containing CBC last mile coverage geometries imported from shapefiles';
comment on column ccbc_public.cbc_last_mile_coverage.gid is 'Unique ID for the row';
comment on column ccbc_public.cbc_last_mile_coverage.geom is 'The geometry of the coverage area (MultiPolygonZM, SRID 4326)';

commit;
