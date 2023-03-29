-- Deploy ccbc:types/gis_data_item to pg
-- requires: schemas/public

begin;

create type ccbc_public.gis_data_item as (
  json_data jsonb
);

comment on column ccbc_public.gis_data.json_data is
  'content of the uploaded GIS data file';

commit;
