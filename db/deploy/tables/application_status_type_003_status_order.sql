-- deploy ccbc:tables/application_status_type_003_status_order to pg

begin;

alter table ccbc_public.application_status_type add column status_order int not null default 0;

update ccbc_public.application_status_type set status_order = 3 where name = 'screening';

update ccbc_public.application_status_type set status_order = 7 where name = 'assessment';

update ccbc_public.application_status_type set status_order = 11 where name = 'recommendation';

update ccbc_public.application_status_type set status_order = 15 where name = 'conditionally_approved';

update ccbc_public.application_status_type set status_order = 19 where name = 'approved';

update ccbc_public.application_status_type set status_order = 23 where name = 'complete';

update ccbc_public.application_status_type set status_order = 27 where name = 'on_hold';

update ccbc_public.application_status_type set status_order = 31 where name = 'withdrawn';

update ccbc_public.application_status_type set status_order = 35 where name = 'cancelled';

update ccbc_public.application_status_type set status_order = 39 where name = 'closed';

update ccbc_public.application_status_type set status_order = 60 where name = 'submitted';

update ccbc_public.application_status_type set status_order = 80 where name = 'draft';

alter table ccbc_public.application_status_type alter column status_order drop default;

-- two-fold, we don't want status of the same order value (to prevent two statuses being randomly swapped)
-- and since this is a column we'll be ordering by it's valuable to have it indexed
alter table ccbc_public.application_status_type add constraint application_status_type_order_is_unique UNIQUE(status_order);

commit;
