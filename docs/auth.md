# Authentication and Authorization

## Authentication

### Mocking Authentication

To facilitate automated testing, the application supports bypassing the authentication when the `ENABLE_MOCK_AUTH` environment variable is set to `true`.
In this mode, the users's role can be defined via a cookie (the cookie's name is defined by the `MOCK_ROLE_COOKIE_NAME` environment variable, which defaults to `'mocks.auth_role'`).
This enables requests made with tools such as `cypress` or `k6` to bypass the login flow and authenticate as:

- an applicant by setting the cookie to `ccbc_auth_user`
- an analyst by setting the cookie to `ccbc_analyst`
- an admin by setting the cookie to `ccbc_admin`

For convenience, a cypress command was created: in cypress tests, you can use `cy.mockLogin(<mock_role_name>)` to log in for the rest of the test.

The session sub will be defined as `mockUser@<mock_role_name>`, meaning that for a mock applicant to see applications, the application's owner must be `mockUser@ccbc_auth_user`..

## Authorization

### Overview of analyst permissions

Analysts will log in through the `/analyst` route and will use IDIR for authentication. To prevent anyone who has an IDIR from accessing the analyst dashboard an `analyst` or `admin` role will have to be tied to the IDIR through the [SSO app](https://bcgov.github.io/sso-requests). If they don't have a role assigned to their IDIR they will be redirected to `/analyst/request-access`.

#### Assigning roles to an IDIR

Roles can be assigned to an IDIR in the SSO app. Login to the app and select the project and the section showed below will be at the bottom of the page.

In the 'Assign Users to Roles' tab you can search the IDIR you want to assign then assign it in the 'Assign user to role' section on the right side.

![alt text](images/sso_assign_role.png)

Allowed roles at the time of writing are:

- Admin
- Analyst

#### Protected pages

Pages that any user can visit:

- `/`
- `/analyst`
- `/applicantportal`
- `/analyst/request-access`

Users with an `analyst` or `admin` role can access all subpages of the `/analyst/*` route. They can not access the applicant portal `/applicantportal/*` subpages.

#### Redirection behaviour when attempting to access an unauthorized route

###### IDIR user with no assigned role:

Role given: `ccbc_guest`
Landing route: `/analyst/request-access`

###### IDIR user with assigned role 'admin':

Role given: `ccbc_admin`
Landing route: `/analyst/dashboard`

###### IDIR user with assigned role 'analyst':

Role given: `ccbc_analyst`
Landing route: `/analyst/dashboard`

###### Applicant portal BCeID user:

Role given: `ccbc_auth_user`
Landing route: `/applicantportal/dashboard`

#### Client side routing

Client side routing will not go through the page redirection login so keep that in mind when using `next/link` as it could cause bugs. In many cases it will be preferrable to trigger a page reload.

### Role Based Access

Access control is based on row-level security, where the user is held in the session. Each request is given that level of permissions for each of their queries. These apply to our functions that access these tables as well.

#### Role based access per user

#### Analyst User

The analyst user general has full access control onto each of the applications, assuming that they have been submitted and their respective intakes have closed.

#### Admin User

Generally the admin and analyst roles have the same level of access, save for these specific tasks: creating and updating intakes, editing analyst lists, and downloading applications.

#### Applicant User

This is one of the least permissions available, this is the client-facing role that is provided to anyone that signs up for fill in an application. These users can only create and fill in applications, along with any RFIs.

#### Guest User

This is a user that has yet to sign in, they are given the least access to the database, only given exactly what is needed to render the landing page.

#### Job Executor User

This is a user that has permissions to do specific tasks. It has access to application and statuses, and is used to trigger an update on application status once the intake has closed. This is an internal only role.

#### CCBC Archiver Role

This is the user that is in charge of setting a row as archived. This is an internal only role.
