begin;
select plan(4);


select has_role( 'ccbc_auth_user', 'role ccbc_auth_user exists' );
select isnt_superuser(
    'ccbc_auth_user',
    'ccbc_auth_user should not be a super user'
);

select has_role( 'ccbc_guest', 'role ccbc_guest exists' );
select isnt_superuser(
    'ccbc_guest',
    'ccbc_guest should not be a super user'
);

select has_role( 'ccbc_guest', 'role ccbc_job_executor exists' );
select isnt_superuser(
    'ccbc_job_executor',
    'ccbc_job_executor should not be a super user'
);

select finish();
rollback;
