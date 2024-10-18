In the application form, if there is a new intake with a new uiSchema the logic in lines 251-275 (Logic about intake number `if (ccbcIntakeNumber !== null && ccbcIntakeNumber <= 2) {`).

If a new jsonSchema (not UI schema) is to be used, don’t forget to import the jsonSchema to the DB by editing `importJsonSchemasToDb.ts`.

If future intakes have any special logic to submission (for example the rolling intake) then the dashboard.tsx page in the `applicantportal` folder is to be edited. Additionally, `index.tsx` in the `applicantportal` folder my need to be edited if the number of pages have changed (Lines 177-197 starting with `<h3>Application form overview</h3>`).

Most new intakes have a need to update the `ZoneMapWidget.tsx` file. This requires a new image usually submitted by the data team, and sometimes an update to the zone map URL. These URL constants can be found in `externalConstants.ts`.

Finally, new intakes must be included in the feature flag on growthbook. The feature flag “intake_zones_json” should be edited to include the new intake, along with a list of zones that are open for this intake.
