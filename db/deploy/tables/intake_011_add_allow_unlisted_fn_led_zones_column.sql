-- Deploy ccbc:tables/intake_011_add_allow_unlisted_fn_led_zones_column to pg

begin;

alter table ccbc_public.intake
  add column allow_unlisted_fn_led_zones boolean not null default true;

comment on column ccbc_public.intake.allow_unlisted_fn_led_zones is 'Allows applicants to select zones not in the intake list if First Nations based or led';

commit;
