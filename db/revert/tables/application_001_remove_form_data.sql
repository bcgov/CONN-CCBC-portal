-- Revert ccbc:tables/application_001.sql from pg

begin;

alter table ccbc_public.application add column form_data varchar(1000) not null;

comment on column ccbc_public.application.form_data is 'The data entered into the form by the respondent';
comment on column ccbc_public.application.last_edited_page is 'Column saving the key of the last edited form page';

commit;
