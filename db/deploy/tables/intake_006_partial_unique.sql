-- Deploy ccbc:tables/intake_006_partial_unique to pg

begin;

alter table ccbc_public.intake drop constraint intake_ccbc_intake_number_key;

create unique index intake_ccbc_intake_number_key on ccbc_public.intake (ccbc_intake_number) where archived_at is null;

commit;
