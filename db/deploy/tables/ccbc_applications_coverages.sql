-- Deploy ccbc:tables/ccbc_applications_coverages to pg

begin;

create table if not exists ccbc_public.ccbc_applications_coverages(
  gid serial primary key,
  ccbc_numbe varchar(12),
  ccbc_appli double precision,
  intake_id double precision,
  map_max_do double precision,
  map_max_up double precision,
  map_access varchar(50),
  map_transp varchar(50),
  shape_leng numeric,
  shape_area numeric,
  geom geometry(MultiPolygonZM,4326)
);

create index if not exists ccbc_applications_coverages_geom_idx
  on ccbc_public.ccbc_applications_coverages using gist (geom);

commit;
