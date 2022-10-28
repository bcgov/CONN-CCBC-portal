begin;

insert into ccbc_public.application
(id, ccbc_number,owner,intake_id,created_by, created_at,updated_by, updated_at)
overriding system value
values
(1,'', 'mockUser@ccbc_auth_user',1,1,'2022-10-17 10:16:45.319172-07',1,'2022-10-17 10:16:45.319172-07');

insert into ccbc_public.application_status
(id, application_id, status,created_by, created_at)
overriding system value
values
(1,1,'draft',1,'2022-10-17 10:16:45.319172-07');

insert into ccbc_public.form_data
(id, json_data, last_edited_page, form_data_status_type_id, created_by, created_at, updated_by, updated_at)
overriding system value
values
(1,'{"submission": {"submissionDate": "2022-10-17"}, "projectInformation": {"projectTitle": "Test application"}}',
    'projectArea', 'pending',1,'2022-10-17 16:28:11.006719-07',1,'2022-10-17 16:28:26.105206-07');

insert into ccbc_public.application_form_data
(form_data_id, application_id)
values (1,1);

commit;
