-- Deploy ccbc:tables/application_status_type_001_add_status_received to pg

begin;

do
$grant$
begin

insert into ccbc_public.application_status_type (name, description) values
('received', 'Received');

end
$grant$;

commit;
