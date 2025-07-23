BEGIN;

-- Disable triggers to prevent interference during updates
ALTER TABLE ccbc_public.sow_tab_7 DISABLE TRIGGER ALL;

-- Create a specialized function for anonymizing sow_tab_7 numeric fields
CREATE OR REPLACE FUNCTION ccbc_public.anonymize_sow_tab_7_numeric_fields(
  input_jsonb jsonb,
  sow_tab_7_id integer,
  target_fields text[]
) RETURNS jsonb AS $$
DECLARE
  result_jsonb jsonb := input_jsonb;
  hash_value numeric;
  field_path text;
  array_path text[];
  field_name text;
  array_element jsonb;
  new_array jsonb;
  index int;
  field_value numeric;
  project_title text;
BEGIN
  -- Return input unchanged if NULL
  IF input_jsonb IS NULL THEN
    RAISE NOTICE 'Skipping row: input_jsonb is NULL';
    RETURN input_jsonb;
  END IF;

  -- Generate project title based on sow_tab_7 id
  project_title := 'SOW TAB 7 ID ' || sow_tab_7_id::text;

  -- Get hash value from generated project title
  hash_value := ccbc_public.hash_string(project_title);
  RAISE NOTICE 'Hash value for project title "%": %', project_title, hash_value;

  -- Skip processing if hash_value is NULL
  IF hash_value IS NULL THEN
    RAISE NOTICE 'Skipping row: hash_value is NULL';
    RETURN input_jsonb;
  END IF;

  -- Process each target field path
  FOREACH field_path IN ARRAY target_fields LOOP
    -- Split path into components
    array_path := string_to_array(field_path, ',');
    field_name := array_path[array_length(array_path, 1)];
    RAISE NOTICE 'Processing field path: %', field_path;

    -- Handle nested fields based on the JSON structure
    IF array_length(array_path, 1) = 1 THEN
      -- Direct field (e.g., 'fieldName')
      IF input_jsonb ? field_name AND jsonb_typeof(input_jsonb->field_name) = 'number' THEN
        BEGIN
          field_value := (input_jsonb->>field_name)::numeric;
          -- Skip numbers between 0 and 1 (exclusive)
          IF field_value > 0 AND field_value < 1 THEN
            RAISE NOTICE 'Skipping field % with value % (between 0 and 1)', field_name, field_value;
          ELSE
            result_jsonb := jsonb_set(
              result_jsonb,
              ARRAY[field_name],
              to_jsonb(field_value + hash_value),
              false
            );
            RAISE NOTICE 'Updated field %: % + % = %', field_name, field_value, hash_value, field_value + hash_value;
          END IF;
        EXCEPTION WHEN OTHERS THEN
          RAISE NOTICE 'Skipping field % due to error: %', field_name, SQLERRM;
        END;
      ELSE
        RAISE NOTICE 'Skipping field %: not present or not numeric', field_name;
      END IF;
    ELSIF array_length(array_path, 1) = 2 THEN
      -- Two-level nested field (e.g., 'parent,child')
      IF input_jsonb ? array_path[1] AND input_jsonb->array_path[1] ? field_name AND jsonb_typeof(input_jsonb->array_path[1]->field_name) = 'number' THEN
        BEGIN
          field_value := (input_jsonb->array_path[1]->>field_name)::numeric;
          -- Skip numbers between 0 and 1 (exclusive)
          IF field_value > 0 AND field_value < 1 THEN
            RAISE NOTICE 'Skipping field %.% with value % (between 0 and 1)', array_path[1], field_name, field_value;
          ELSE
            result_jsonb := jsonb_set(
              result_jsonb,
              ARRAY[array_path[1], field_name],
              to_jsonb(field_value + hash_value),
              false
            );
            RAISE NOTICE 'Updated field %.%: % + % = %', array_path[1], field_name, field_value, hash_value, field_value + hash_value;
          END IF;
        EXCEPTION WHEN OTHERS THEN
          RAISE NOTICE 'Skipping field %.% due to error: %', array_path[1], field_name, SQLERRM;
        END;
      ELSE
        RAISE NOTICE 'Skipping field %.%: not present or not numeric', array_path[1], field_name;
      END IF;
    ELSIF array_length(array_path, 1) = 3 THEN
      -- Three-level nested field (e.g., 'parent,child,grandchild')
      IF input_jsonb ? array_path[1] AND input_jsonb->array_path[1] ? array_path[2] THEN
        -- Handle arrays
        IF array_path[2] = 'otherFundingPartners' AND jsonb_typeof(input_jsonb->array_path[1]->array_path[2]) = 'array' THEN
          new_array := '[]'::jsonb;
          FOR index, array_element IN
            SELECT idx, elem
            FROM jsonb_array_elements(input_jsonb->array_path[1]->array_path[2]) WITH ORDINALITY AS t(elem, idx)
          LOOP
            IF array_element ? field_name AND jsonb_typeof(array_element->field_name) = 'number' THEN
              BEGIN
                field_value := (array_element->>field_name)::numeric;
                -- Skip numbers between 0 and 1 (exclusive)
                IF field_value > 0 AND field_value < 1 THEN
                  RAISE NOTICE 'Skipping array field % with value % (between 0 and 1)', field_name, field_value;
                  new_array := new_array || array_element;
                ELSE
                  new_array := new_array || jsonb_set(
                    array_element,
                    ARRAY[field_name],
                    to_jsonb(field_value + hash_value),
                    false
                  );
                  RAISE NOTICE 'Updated array field %: % + % = %', field_name, field_value, hash_value, field_value + hash_value;
                END IF;
              EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Skipping array field % due to error: %', field_name, SQLERRM;
                new_array := new_array || array_element;
              END;
            ELSE
              new_array := new_array || array_element;
              RAISE NOTICE 'Skipping array field %: not present or not numeric', field_name;
            END IF;
          END LOOP;
          result_jsonb := jsonb_set(
            result_jsonb,
            ARRAY[array_path[1], array_path[2]],
            new_array,
            false
          );
        -- Handle regular nested objects
        ELSIF input_jsonb->array_path[1]->array_path[2] ? field_name AND jsonb_typeof(input_jsonb->array_path[1]->array_path[2]->field_name) = 'number' THEN
          BEGIN
            field_value := (input_jsonb->array_path[1]->array_path[2]->>field_name)::numeric;
            -- Skip numbers between 0 and 1 (exclusive)
            IF field_value > 0 AND field_value < 1 THEN
              RAISE NOTICE 'Skipping field %.%.% with value % (between 0 and 1)', array_path[1], array_path[2], field_name, field_value;
            ELSE
              result_jsonb := jsonb_set(
                result_jsonb,
                ARRAY[array_path[1], array_path[2], field_name],
                to_jsonb(field_value + hash_value),
                false
              );
              RAISE NOTICE 'Updated field %.%.%: % + % = %', array_path[1], array_path[2], field_name, field_value, hash_value, field_value + hash_value;
            END IF;
          EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipping field %.%.% due to error: %', array_path[1], array_path[2], field_name, SQLERRM;
          END;
        ELSE
          RAISE NOTICE 'Skipping field %.%.%: not present or not numeric', array_path[1], array_path[2], field_name;
        END IF;
      ELSE
        RAISE NOTICE 'Skipping field %.%.%: parent path not present', array_path[1], array_path[2], field_name;
      END IF;
    ELSE
      RAISE NOTICE 'Skipping field %: unsupported nesting level', field_path;
    END IF;
  END LOOP;

  -- Ensure result is not NULL
  IF result_jsonb IS NULL THEN
    RAISE NOTICE 'result_jsonb is NULL, returning input_jsonb';
    RETURN input_jsonb;
  END IF;

  RETURN result_jsonb;
END;
$$ LANGUAGE plpgsql;

-- Main update query for sow_tab_7
UPDATE ccbc_public.sow_tab_7
SET json_data = ccbc_public.anonymize_sow_tab_7_numeric_fields(json_data, id, ARRAY[
  'summaryTable,totalProjectCost',
  'summaryTable,totalEligibleCosts',
  'summaryTable,totalIneligibleCosts',
  'summaryTable,totalFundingRequestedCCBC',
  'summaryTable,fundingFromAllOtherSources',
  'summaryTable,totalApplicantContribution',
  'summaryTable,amountRequestedFromProvince',
  'summaryTable,totalInfrastructureBankFunding',
  'summaryTable,amountRequestedFromFederalGovernment',
  'detailedBudget,federalSharingRatio',
  'detailedBudget,provincialSharingRatio',
  'summaryOfEstimatedProjectCosts,projectCosts,totalProjectCost,2324',
  'summaryOfEstimatedProjectCosts,projectCosts,totalProjectCost,2425',
  'summaryOfEstimatedProjectCosts,projectCosts,totalProjectCost,2526',
  'summaryOfEstimatedProjectCosts,projectCosts,totalProjectCost,2627',
  'summaryOfEstimatedProjectCosts,projectCosts,totalProjectCost,total',
  'summaryOfEstimatedProjectCosts,projectCosts,totalEligibleCosts,2324',
  'summaryOfEstimatedProjectCosts,projectCosts,totalEligibleCosts,2425',
  'summaryOfEstimatedProjectCosts,projectCosts,totalEligibleCosts,2526',
  'summaryOfEstimatedProjectCosts,projectCosts,totalEligibleCosts,2627',
  'summaryOfEstimatedProjectCosts,projectCosts,totalEligibleCosts,total',
  'summaryOfEstimatedProjectCosts,projectCosts,totalIneligibleCosts,2324',
  'summaryOfEstimatedProjectCosts,projectCosts,totalIneligibleCosts,2425',
  'summaryOfEstimatedProjectCosts,projectCosts,totalIneligibleCosts,2526',
  'summaryOfEstimatedProjectCosts,projectCosts,totalIneligibleCosts,2627',
  'summaryOfEstimatedProjectCosts,projectCosts,totalIneligibleCosts,total',
  'summaryOfEstimatedProjectCosts,estimatedProjectCosts,eligibleMobile',
  'summaryOfEstimatedProjectCosts,estimatedProjectCosts,totalProjectCost',
  'summaryOfEstimatedProjectCosts,estimatedProjectCosts,totalEligibleCosts',
  'summaryOfEstimatedProjectCosts,estimatedProjectCosts,totalIneligibleCosts',
  'summaryOfEstimatedProjectCosts,estimatedProjectCosts,eligibleRuralBroadband',
  'summaryOfEstimatedProjectCosts,estimatedProjectCosts,eligibleVeryRemoteSatelliteIndigenousBroadband',
  'summaryOfEstimatedProjectCosts,totalCostsPerCostCategory,directOther,cost',
  'summaryOfEstimatedProjectCosts,totalCostsPerCostCategory,directOther,percentOfTotalEligibleCosts',
  'summaryOfEstimatedProjectCosts,totalCostsPerCostCategory,directLabour,cost',
  'summaryOfEstimatedProjectCosts,totalCostsPerCostCategory,directLabour,percentOfTotalEligibleCosts',
  'summaryOfEstimatedProjectCosts,totalCostsPerCostCategory,directTravel,cost',
  'summaryOfEstimatedProjectCosts,totalCostsPerCostCategory,directTravel,percentOfTotalEligibleCosts',
  'summaryOfEstimatedProjectCosts,totalCostsPerCostCategory,totalEligible,cost',
  'summaryOfEstimatedProjectCosts,totalCostsPerCostCategory,totalEligible,percentOfTotalEligibleCosts',
  'summaryOfEstimatedProjectCosts,totalCostsPerCostCategory,directEquipment,cost',
  'summaryOfEstimatedProjectCosts,totalCostsPerCostCategory,directEquipment,percentOfTotalEligibleCosts',
  'summaryOfEstimatedProjectCosts,totalCostsPerCostCategory,directMaterials,cost',
  'summaryOfEstimatedProjectCosts,totalCostsPerCostCategory,directMaterials,percentOfTotalEligibleCosts',
  'summaryOfEstimatedProjectCosts,totalCostsPerCostCategory,directSatellite,cost',
  'summaryOfEstimatedProjectCosts,totalCostsPerCostCategory,directSatellite,percentOfTotalEligibleCosts',
  'summaryOfEstimatedProjectCosts,thirtyPercentOfTotalEligibleCosts',
  'summaryOfEstimatedProjectFunding,federalContribution,2324',
  'summaryOfEstimatedProjectFunding,federalContribution,2425',
  'summaryOfEstimatedProjectFunding,federalContribution,2526',
  'summaryOfEstimatedProjectFunding,federalContribution,2627',
  'summaryOfEstimatedProjectFunding,federalContribution,total',
  'summaryOfEstimatedProjectFunding,otherFundingPartners,2324',
  'summaryOfEstimatedProjectFunding,otherFundingPartners,2425',
  'summaryOfEstimatedProjectFunding,otherFundingPartners,2526',
  'summaryOfEstimatedProjectFunding,otherFundingPartners,2627',
  'summaryOfEstimatedProjectFunding,otherFundingPartners,total',
  'summaryOfEstimatedProjectFunding,provincialContribution,2324',
  'summaryOfEstimatedProjectFunding,provincialContribution,2425',
  'summaryOfEstimatedProjectFunding,provincialContribution,2526',
  'summaryOfEstimatedProjectFunding,provincialContribution,2627',
  'summaryOfEstimatedProjectFunding,provincialContribution,total',
  'summaryOfEstimatedProjectFunding,applicationContribution,2324',
  'summaryOfEstimatedProjectFunding,applicationContribution,2425',
  'summaryOfEstimatedProjectFunding,applicationContribution,2526',
  'summaryOfEstimatedProjectFunding,applicationContribution,2627',
  'summaryOfEstimatedProjectFunding,applicationContribution,total',
  'summaryOfEstimatedProjectFunding,infrastructureBankFunding,2324',
  'summaryOfEstimatedProjectFunding,infrastructureBankFunding,2425',
  'summaryOfEstimatedProjectFunding,infrastructureBankFunding,2526',
  'summaryOfEstimatedProjectFunding,infrastructureBankFunding,2627',
  'summaryOfEstimatedProjectFunding,infrastructureBankFunding,total',
  'summaryOfEstimatedProjectFunding,totalFinancialContribution,2324',
  'summaryOfEstimatedProjectFunding,totalFinancialContribution,2425',
  'summaryOfEstimatedProjectFunding,totalFinancialContribution,2526',
  'summaryOfEstimatedProjectFunding,totalFinancialContribution,2627',
  'summaryOfEstimatedProjectFunding,totalFinancialContribution,total',
  'currentFiscalProvincialContributionForecastByQuarter,aprilToJune,2324',
  'currentFiscalProvincialContributionForecastByQuarter,aprilToJune,2425',
  'currentFiscalProvincialContributionForecastByQuarter,aprilToJune,2526',
  'currentFiscalProvincialContributionForecastByQuarter,aprilToJune,2627',
  'currentFiscalProvincialContributionForecastByQuarter,aprilToJune,total',
  'currentFiscalProvincialContributionForecastByQuarter,januaryToMarch,2324',
  'currentFiscalProvincialContributionForecastByQuarter,januaryToMarch,2425',
  'currentFiscalProvincialContributionForecastByQuarter,januaryToMarch,2526',
  'currentFiscalProvincialContributionForecastByQuarter,januaryToMarch,2627',
  'currentFiscalProvincialContributionForecastByQuarter,januaryToMarch,total',
  'currentFiscalProvincialContributionForecastByQuarter,fiscalYearTotal,2324',
  'currentFiscalProvincialContributionForecastByQuarter,fiscalYearTotal,2425',
  'currentFiscalProvincialContributionForecastByQuarter,fiscalYearTotal,2526',
  'currentFiscalProvincialContributionForecastByQuarter,fiscalYearTotal,2627',
  'currentFiscalProvincialContributionForecastByQuarter,fiscalYearTotal,total',
  'currentFiscalProvincialContributionForecastByQuarter,julyToSeptember,2324',
  'currentFiscalProvincialContributionForecastByQuarter,julyToSeptember,2425',
  'currentFiscalProvincialContributionForecastByQuarter,julyToSeptember,2526',
  'currentFiscalProvincialContributionForecastByQuarter,julyToSeptember,2627',
  'currentFiscalProvincialContributionForecastByQuarter,julyToSeptember,total',
  'currentFiscalProvincialContributionForecastByQuarter,octoberToDecember,2324',
  'currentFiscalProvincialContributionForecastByQuarter,octoberToDecember,2425',
  'currentFiscalProvincialContributionForecastByQuarter,octoberToDecember,2526',
  'currentFiscalProvincialContributionForecastByQuarter,octoberToDecember,2627',
  'currentFiscalProvincialContributionForecastByQuarter,octoberToDecember,total'
]::text[])
WHERE json_data IS NOT NULL;

-- Drop the temporary function
DROP FUNCTION IF EXISTS ccbc_public.anonymize_sow_tab_7_numeric_fields(jsonb, integer, text[]);

-- Re-enable triggers
ALTER TABLE ccbc_public.sow_tab_7 ENABLE TRIGGER ALL;

COMMIT;
