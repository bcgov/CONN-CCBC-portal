-- Deploy ccbc:tables/application_rd to pg

BEGIN;

create table ccbc_public.application_rd(
  application_id integer,
  ccbc_number varchar(255),
  rd varchar(255)
);

-- Grant ccbc_admin permissions
perform ccbc_private.grant_permissions('select', 'application_rd', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'application_rd', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'application_rd', 'ccbc_admin');

-- Grant ccbc_analyst permissions
perform ccbc_private.grant_permissions('select', 'application_rd', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'application_rd', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'application_rd', 'ccbc_analyst');

COMMIT;
