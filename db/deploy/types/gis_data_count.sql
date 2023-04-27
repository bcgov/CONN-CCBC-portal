-- Deploy ccbc:types/gis_data_count to pg
-- requires: schemas/public

begin;

create type ccbc_public.gis_data_count as (
  total integer,
  count_type text,
  ccbc_numbers text
);

comment on column ccbc_public.gis_data_count.total is
  'number of records that fit specofoc criteria';
comment on column ccbc_public.gis_data_count.count_type is
  'type of the counter (one of "new", "updated","total")';
comment on column ccbc_public.gis_data_count.ccbc_numbers is
  'list of ccbc_number of the applications included in counter';

commit;
