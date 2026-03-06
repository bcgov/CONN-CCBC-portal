-- Deploy ccbc:tables/regional_districts to pg

begin;

create table if not exists ccbc_public.regional_districts(
  gid serial primary key,
  aa_id double precision,
  aa_name varchar(200),
  abrvn varchar(40),
  bdy_type varchar(20),
  aa_parent varchar(200),
  chng_org varchar(30),
  upt_type varchar(50),
  upt_date varchar(25),
  map_status varchar(12),
  oc_m_nmbr varchar(7),
  oc_m_yr varchar(4),
  oc_m_type varchar(20),
  wbst_rl varchar(254),
  image_url varchar(254),
  afctd_area varchar(120),
  area_sqm numeric,
  length_m numeric,
  shape numeric,
  obejctid numeric,
  geom geometry(MultiPolygon,4326)
);

create index if not exists regional_districts_geom_idx on ccbc_public.regional_districts using gist (geom);

commit;
