### Rules:

- unauthenticated user can see list of intakes (start/end dates - select from intake table) and cannot see or perform CRUD operations on any other table;
- authenticated user can see and perform CRUD operations only on records created by the user (application and attachment tables);
- records in internal(technical) tables can be accessed/created/edited/deleted only by the code which uses account with superuser role.

Matrix:https://app.zenhub.com/files/476885245/983426e8-0aff-4685-988f-cfe846691555/download