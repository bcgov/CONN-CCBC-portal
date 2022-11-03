begin;

insert into ccbc_public.application_status
(id, application_id, status,created_by, created_at)
overriding system value
values
(2,1,'received',1,'2022-10-18 10:16:45.319172-07');

commit;
