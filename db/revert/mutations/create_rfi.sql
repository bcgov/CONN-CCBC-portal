-- Revert ccbc:mutations/create_rfi from pg

begin;

    drop function ccbc_public.create_rfi;

commit;
