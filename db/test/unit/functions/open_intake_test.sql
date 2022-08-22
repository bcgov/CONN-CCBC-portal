BEGIN;

SELECT plan(4);

SELECT has_function('ccbc_public', 'open_intake',
 'function ccbc_public.open_intake exists');

-- setup intake table, since there is no guarantee that an intake will be available when running the test

DELETE FROM ccbc_public.intake;

INSERT INTO ccbc_public.intake 
    (open_timestamp, close_timestamp, ccbc_intake_number) 
    VALUES (now(), now() + interval '10 days', 10);

-- ccbc_auth_user
SET ROLE ccbc_auth_user;
SELECT concat('current user is: ', (SELECT current_user));

SELECT results_eq(
    $$
        SELECT ccbc_intake_number FROM ccbc_public.open_intake();
    $$
    , ARRAY[10::int], 
    'Current intake number is displayed for ccbc_auth_user'
    );

-- ccbc_guest
SET ROLE ccbc_guest;
SELECT concat('current user is: ', (SELECT current_user));

SELECT results_eq(
    $$
        SELECT ccbc_intake_number FROM ccbc_public.open_intake();
    $$
    , ARRAY[10::int], 
    'Current intake number is displayed for guest'
    );

-- no open intakes should return null
-- set role with enough permissions to delete from intake table
SET ROLE postgres;
DELETE FROM ccbc_public.intake;

INSERT INTO ccbc_public.intake 
    (open_timestamp, close_timestamp, ccbc_intake_number) 
    VALUES (now() - interval '11 days', now() - interval '2 days', 10);

-- set role back to guest user
SET ROLE ccbc_guest;

SELECT is(
    (SELECT ccbc_intake_number FROM ccbc_public.open_intake())
    ,
    null
    ,
    'Open intake should return null when no intakes are available'
);


SELECT finish();
ROLLBACK;