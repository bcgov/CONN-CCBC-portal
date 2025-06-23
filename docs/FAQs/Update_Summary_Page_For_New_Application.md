# Update_Summary_Page_For_New_Application

## Circumstances

When a new application is added to the CCBC Portal, the summary page needs to be updated.

# Solutions

## Solution 1

The modern way is to call the robust API endpoint:

```
GET /api/template-nine/all
```

## Solution 2

This approach works as well but requires some manual steps to find the necessary IDs.

1. Go to Metabase
   1. In the left panel, click on "Databases" and select the production database.
   2. Click on "Application" and find your application by its "Ccbc Number".
   3. You need the "ID" value for this record – it's **APPLICATION_ID**.
2. Go back and click on "Attachment".
    1. Filter by the "Application ID" by using the "ID" value you found in the previous step.
    2. Find the **Template 9** file by its "File Name".
   3. You need the "File" value for this record – it's **TEMPLATE_9_UUID**.
3. Perform an API call (just paste the URL in your browser):
   ```
   https://<PORTAL_URL>/api/template-nine/<APPLICATION_ID>/<TEMPLATE_9_UUID>/application
   ```
   For Production, it will be:
   ``` 
   https://connectingcommunitiesbc.ca/api/template-nine/<APPLICATION_ID>/<TEMPLATE_9_UUID>/application 
   ```
   Replace `<APPLICATION_ID>` and `<TEMPLATE_9_UUID>` with the values you found in the previous steps.
4. If succeeded, you'll see this message:

   `{"result": "success"}`
5. Check results:
   1. Go to Portal Analyst Dashboard
   2. Select the application you just updated
   3. Check the **Summary** page: "Counts" section should have values in:
      - Total number of communities benefitting
      - Number of Indigenous Communities benefitting
      - Number of Non-Indigenous Communities benefitting
