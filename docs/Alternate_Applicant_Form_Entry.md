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
