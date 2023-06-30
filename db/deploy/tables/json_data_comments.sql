-- Deploy ccbc:tables/json_data_comments to pg

BEGIN;

comment on column ccbc_public.project_information_data.json_data is 'The json form data of the project information form. See [schema](https://json-schema.app/view/%23?url=https%3A%2F%2Fbcgov.github.io%2FCONN-CCBC-portal%2Fschemaspy%2Fdata%2Fproject_information_data.json)';
comment on column ccbc_public.assessment_data.json_data is 'The json form data of the assessment form. See [schema](https://json-schema.app/view/%23?url=https%3A%2F%2Fbcgov.github.io%2FCONN-CCBC-portal%2Fschemaspy%2Fdata%2Fassessment_data.json)';
comment on column ccbc_public.form_data.json_data is 'The json form data of the project information form. See [schema](https://json-schema.app/view/%23?url=https%3A%2F%2Fbcgov.github.io%2FCONN-CCBC-portal%2Fschemaspy%2Fdata%2Fform_data.json)';
comment on column ccbc_public.rfi_data.json_data is 'The json form data of the RFI information form. See [schema](https://json-schema.app/view/%23?url=https%3A%2F%2Fbcgov.github.io%2FCONN-CCBC-portal%2Fschemaspy%2Fdata%2Frfi_data.json)';
comment on column ccbc_public.gis_data.json_data is 'The data imported from the GIS data Excel file. See [schema](https://json-schema.app/view/%23?url=https%3A%2F%2Fbcgov.github.io%2FCONN-CCBC-portal%2Fschemaspy%2Fdata%2Fgis_data.json)';
comment on column ccbc_public.announcement.json_data is 'The json form data of the announcement form. See [schema](https://json-schema.app/view/%23?url=https%3A%2F%2Fbcgov.github.io%2FCONN-CCBC-portal%2Fschemaspy%2Fdata%2Fannouncement.json)';
comment on column ccbc_public.conditional_approval_data.json_data is 'The json form data of the conditional approval form. See [schema](https://json-schema.app/view/%23?url=https%3A%2F%2Fbcgov.github.io%2FCONN-CCBC-portal%2Fschemaspy%2Fdata%2Fconditional_approval_data.json)';
comment on column ccbc_public.application_gis_data.json_data is 'The data imported from the GIS data Excel file. See [schema](https://json-schema.app/view/%23?url=https%3A%2F%2Fbcgov.github.io%2FCONN-CCBC-portal%2Fschemaspy%2Fdata%2Fapplication_gis_data.json)';
comment on column ccbc_public.application_sow_data.json_data is 'The data imported from the Excel filled by the respondent. See [schema](https://json-schema.app/view/%23?url=https%3A%2F%2Fbcgov.github.io%2FCONN-CCBC-portal%2Fschemaspy%2Fdata%2Fapplication_sow_data.json)';
comment on column ccbc_public.sow_tab_1.json_data is 'The data imported from the Excel filled by the respondent. See [schema](https://json-schema.app/view/%23?url=https%3A%2F%2Fbcgov.github.io%2FCONN-CCBC-portal%2Fschemaspy%2Fdata%2Fsow_tab_1.json)';
comment on column ccbc_public.sow_tab_2.json_data is 'The data imported from the Excel filled by the respondent. See [schema](https://json-schema.app/view/%23?url=https%3A%2F%2Fbcgov.github.io%2FCONN-CCBC-portal%2Fschemaspy%2Fdata%2Fsow_tab_2.json)';
comment on column ccbc_public.sow_tab_7.json_data is 'The data imported from the Excel filled by the respondent. See [schema](https://json-schema.app/view/%23?url=https%3A%2F%2Fbcgov.github.io%2FCONN-CCBC-portal%2Fschemaspy%2Fdata%2Fsow_tab_7.json)';
comment on column ccbc_public.sow_tab_8.json_data is 'The data imported from the Excel filled by the respondent. See [schema](https://json-schema.app/view/%23?url=https%3A%2F%2Fbcgov.github.io%2FCONN-CCBC-portal%2Fschemaspy%2Fdata%2Fsow_tab_8.json)';

COMMIT;
