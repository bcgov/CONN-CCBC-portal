-- deploy ccbc:tables/gapless_counter to pg

begin;

create table ccbc_public.gapless_counter(
  id integer primary key generated always as identity,
  counter integer not null default 0
);

do
$grant$
begin

perform ccbc_private.grant_permissions('select', 'gapless_counter', 'ccbc_analyst');
perform ccbc_private.grant_permissions('select', 'gapless_counter', 'ccbc_auth_user');
perform ccbc_private.grant_permissions('select', 'gapless_counter', 'ccbc_admin');
perform ccbc_private.grant_permissions('insert', 'gapless_counter', 'ccbc_admin');
perform ccbc_private.grant_permissions('update', 'gapless_counter', 'ccbc_analyst');
perform ccbc_private.grant_permissions('update', 'gapless_counter', 'ccbc_auth_user');
perform ccbc_private.grant_permissions('update', 'gapless_counter', 'ccbc_admin');

end
$grant$;



commit;

comment on table ccbc_public.gapless_counter is 'Table to hold counter for creating gapless sequences';
comment on column ccbc_public.gapless_counter.id is 'Primary key for the gapless counter';
comment on column ccbc_public.gapless_counter.counter is 'Primary key for the gapless counter';
