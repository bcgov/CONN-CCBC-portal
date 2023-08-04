-- Revert ccbc:computed_columns/rfi_attachments from pg

begin;

drop function ccbc_public.rfi_data_attachments(ccbc_public.rfi_data);

commit;
