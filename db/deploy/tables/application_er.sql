-- Deploy ccbc:tables/application_er to pg

BEGIN;

create table ccbc_public.application_er(
  application_id integer,
  ccbc_number varchar(255),
  er varchar(255)
);

-- Grant ccbc_admin permissions
perform ccbc_private.grant_permissions('select', 'application_er', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'application_er', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'application_er', 'ccbc_admin');

-- Grant ccbc_analyst permissions
perform ccbc_private.grant_permissions('select', 'application_er', 'ccbc_analyst');
perform ccbc_private.grant_permissions('insert', 'application_er', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'application_er', 'ccbc_analyst');

COMMIT;
