-- Deploy ccbc:tables/analyst to pg

begin;

create table if not exists ccbc_public.analyst(
  id integer primary key generated always as identity,
  given_name varchar(1000),
  family_name varchar(1000)
);

select ccbc_private.upsert_timestamp_columns('ccbc_public', 'analyst');

do
$grant$
begin

-- Grant permissions
perform ccbc_private.grant_permissions('select', 'analyst', 'ccbc_analyst');
perform ccbc_private.grant_permissions('select', 'analyst', 'ccbc_admin');

end
$grant$;

comment on table ccbc_public.analyst is 'Table containing list of analysts';
comment on column ccbc_public.analyst.id is 'Unique ID for the analyst';
comment on column ccbc_public.analyst.given_name is 'Analyst''s first name';
comment on column ccbc_public.analyst.family_name is 'Analyst''s last name';

insert into ccbc_public.analyst (given_name, family_name) values
('Rachel', 'Greenspan'),
('Harpreet', 'Bains'),
('Leslie', 'Chiu'),
('Daniel', 'Stanyer'),
('Lia', 'Wilson'),
('Carreen', 'Unguran'),
('Justin', 'Bauer'),
('Cyril', 'Moersch'),
('Afshin', 'Shaabany'),
('Ali', 'Fathalian'),
('Maria', 'Fuccenecco'),
('Hélène', 'Payette'),
('Karl', 'Lu'),
('Meherzad', 'Romer');

commit;
