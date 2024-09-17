-- Deploy ccbc:tables/cbc_data_002_enable_audit to pg

begin;

select audit.enable_tracking('ccbc_public.cbc_data'::regclass);

commit;
