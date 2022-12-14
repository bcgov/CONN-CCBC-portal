-- Deploy ccbc:tables/application_status_type_002_add_types to pg

begin;

do
$grant$
begin

alter table ccbc_public.application_status_type add column visible_by_applicant boolean default true;

perform ccbc_private.grant_permissions('select', 'application_status_type', 'ccbc_admin');
perform ccbc_private.grant_permissions('select', 'application_status_type', 'ccbc_analyst');


insert into ccbc_public.application_status_type (name, description, visible_by_applicant) values
('screening', 'Screening', false),
('assessment', 'Assessment', false),
('recommendation', 'Recommendation', false),
('conditionally_approved', 'Conditionally approved', false),
('approved', 'Approved', false),
('complete', 'Complete', false),
('on_hold', 'On hold', false),
('cancelled', 'Cancelled', false),
('closed', 'Closed', false);

end
$grant$;

commit;
