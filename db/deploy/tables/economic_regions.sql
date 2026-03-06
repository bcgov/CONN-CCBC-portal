-- Deploy ccbc:tables/economic_regions to pg

begin;

create table if not exists ccbc_public.economic_regions(
  gid serial primary key,
  cnssr double precision,
  cnmcrgnd varchar(4),
  cnmcrgnnm varchar(100),
  area_sqm numeric,
  feat_len numeric,
  objectid numeric,
  geom geometry(MultiPolygon,4326)
);

create index if not exists economic_regions_geom_idx on ccbc_public.economic_regions using gist (geom);

commit;
