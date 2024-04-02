-- Deploy ccbc:tables/analyst_add_email to pg

BEGIN;

alter table ccbc_public.analyst add column email varchar(100) null;
comment on column ccbc_public.analyst.email is 'Analyst''s email address';

UPDATE ccbc_public.analyst AS a
SET email = e.email
FROM (
    VALUES
		('Karl', 'Lu', 'karl.lu@ised-isde.gc.ca'),
		('Daniel', 'Winters', 'daniel.winters@ised-isde.gc.ca'),
		('Lia', 'Pittappillil','lia.wilsonpittappillil@gov.bc.ca'),
		('Hélène', 'Payette','helene.payette@ised-isde.gc.ca'),
		('Karina', 'Boarato', 'karina.boarato@gov.bc.ca'),
		('Sophie', 'Belisle', 'sophie.belisle@ised-isde.gc.ca'),
		('Nick', 'Black', 'nick.black@gov.bc.ca'),
		('Nikola', 'Zukanovic', 'nikola.zukanovic@gov.bc.ca'),
		('Carreen', 'Unguran', 'carreen.unguran@gov.bc.ca'),
		('Michael', 'Jeffery', 'michael.j.jeffery@gov.bc.ca'),
		('Kyle', 'Hohman', 'kyle.hohman@gov.bc.ca'),
		('Tom', 'Blackwood', 'tom.blackwood@gov.bc.ca'),
		('Archana', 'Shejwalkar', 'archana.shejwalkar@gov.bc.ca'),
		('Samea', 'Barcelos', 'samea.barcelos@gov.bc.ca'),
        ('Rachel', 'Greenspan', 'rachel.greenspan@gov.bc.ca'),
        ('Harpreet', 'Bains', 'harpreet.bains@gov.bc.ca'),
        ('Leslie', 'Chiu', 'leslie.chiu@gov.bc.ca'),
        ('Daniel', 'Stanyer', 'daniel.stanyer@gov.bc.ca'),
        ('Lia', 'Wilson', 'lia@example.com'),
        ('Careen', 'Unguran', 'carreen.unguran@gov.bc.ca'),
        ('Justin', 'Bauer', 'justin.bauer@gov.bc.ca'),
        ('Cyril', 'Moersch', 'cyril.moersch@gov.bc.ca'),
        ('Afshin', 'Shaabany', 'afshin.shaabany@gov.bc.ca'),
        ('Ali', 'Fathalian', 'ali.fathalian@gov.bc.ca'),
        ('Maria', 'Fuccenecco', 'maria.fuccenecco@gov.bc.ca'),
        ('Meherzad', 'Romer', 'meherzad.romer@gov.bc.ca')
) AS e(name, lastname, email)
WHERE a.given_name = e.name AND a.family_name = e.lastname;

COMMIT;
