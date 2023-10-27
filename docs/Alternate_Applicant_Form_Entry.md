# Creating an Internal Intake

An internal intake is defined by setting the `hidden` column to `true`. Additionally, a UUID (Universally Unique Identifier) is generated and used as a code to match and direct applications to this specific internal intake.

---

# Creating an Internal Application

On the applicant dashboard, the unique UUID code is provided as part of the URL such as `connectingcommunitiesbc.ca/applicantportal/dashboard?code=<hidden_code>`. As long as the code in the URL matches an existing internal intake's UUID, the server will create an application and associate it with that internal intake. The dashboard will display the intake number indicating it's an internal intake.

**Note**: If a public intake is also currently open, the system will still prioritize and associate the application with the internal intake as long as the provided UUID matches.

---

# Submitting an Internal Application

Once an internal application is created and linked to its respective internal intake, the UUID from the dashboard URL is no longer necessary for edits or submissions. Every application tied to an internal intake will be formatted with a unique identifier pattern: `CCBC-99####` once submitted. This formatting clearly differentiates it from other applications.

If there's a scenario where another public intake is also open during the submission process, the system will ensure that the internal intake is prioritized for association, as long as the application was previously tied to the internal intake.

---

# Receiving an Internal Application

The task of receiving internal applications is assigned to a developer. They utilize the `receive_hidden_applications` function within the database for this purpose. While this function could potentially be automated and added to a cron job, it might be preferable to keep it as a manual process. This ensures that applications remain editable and prevents unintentional processing.

---

# Assigning an Application to an Applicant

The process of assigning an internal application to an applicant is manual. Using the `owner` field of a known application, a developer can reassign the application to another user without accessing or viewing any sensitive identifiable information about the applicant.

The following is an example of how one would transfer over ownership of one application to another with the following steps.

1. Identify owner ID that will be the new owner of the internal application (in the example, a known owner is found by identifying its ccbc_number)
2. Find the internal application that you will be changing ownership
3. Update the `owner` column using the value obtained in step 1 for the application from step 2

```sql
-- Here you should get the owner ID, double check that the CCBC number you've provided is correct (step 1)
select owner from ccbc_public.application where ccbc_number = 'CCBC-110001';
-- Get the id of the internal application you'd like to assign (step 2)
select id from ccbc_public.application where ccbc_number = 'CCBC-220001';
-- Update the owner for the new application
update ccbc_public.application set owner = '<owner_id_from_step_1>' where id = <step_2_id>;
```
