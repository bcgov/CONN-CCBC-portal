import { useEffect, useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import { Button } from '@button-inc/bcgov-theme';
import { ISubmitEvent } from '@rjsf/core';
import { FormDiv } from 'components';
import { RfiTheme } from 'components/Analyst/RFI';
import { RfiFormStatus, FormBase } from 'components/Form';
import { rfiSchema } from 'formSchema/analyst';
import { rfiAnalystUiSchema } from 'formSchema/uiSchema/analyst/rfiUiSchema';
import { useRouter } from 'next/router';
import { useUpdateWithTrackingRfiMutation } from 'schema/mutations/application/updateWithTrackingRfiMutation';
import styled from 'styled-components';

const Flex = styled('header')`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const RfiAnalystUpload = ({ query }) => {
  const queryFragment = useFragment(
    graphql`
      fragment RFIAnalystUpload_query on Query {
        applicationByRowId(rowId: $rowId) {
          id
          rowId
          formData {
            jsonData
          }
          ...RfiFormStatus_application
        }
        rfiDataByRowId(rowId: $rfiId) {
          jsonData
          rowId
          id
          ...RfiForm_RfiData
        }
      }
    `,
    query
  );

  const { rfiDataByRowId, applicationByRowId } = queryFragment;
  const {
    formData: { jsonData },
  } = applicationByRowId;
  const [updateRfi] = useUpdateWithTrackingRfiMutation();
  const [newFormData, setNewFormData] = useState(jsonData);
  const [templateData, setTemplateData] = useState(null);
  const [isFormDataUpdated, setIsFormDataUpdated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (templateData?.templateNumber === 1) {
      setIsFormDataUpdated(true);
      const newFormDataWithTemplateOne = {
        ...newFormData,
        benefits: {
          ...newFormData.benefits,
          householdsImpactedIndigenous:
            templateData.data.result.totalNumberHouseholdsImpacted,
          numberOfHouseholds: templateData.data.result.finalEligibleHouseholds,
        },
      };
      setNewFormData(newFormDataWithTemplateOne);
    } else if (templateData?.templateNumber === 2) {
      setIsFormDataUpdated(true);
      const newFormDataWithTemplateTwo = {
        ...newFormData,
        budgetDetails: {
          ...newFormData.budgetDetails,
          totalEligibleCosts: templateData.data.result.totalEligibleCosts,
          totalProjectCost: templateData.data.result.totalProjectCosts,
        },
      };
      setNewFormData(newFormDataWithTemplateTwo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateData]);

  const handleSubmit = (e: ISubmitEvent<any>) => {
    updateRfi({
      variables: {
        input: {
          jsonData: e.formData,
          rfiRowId: rfiDataByRowId.rowId,
        },
      },
      onCompleted: () => {
        if (isFormDataUpdated) {
          // update form data here
        }
        router.push(`/analyst/application/${router.query.applicationId}/rfi`);
      },
      onError: (err) => {
        // eslint-disable-next-line no-console
        console.log('Error updating RFI', err);
      },
    });
  };

  return (
    <div>
      <Flex>
        <div>
          <h2>Upload new files</h2>
          {rfiDataByRowId?.jsonData.rfiDueBy && (
            <p>
              Please upload the following files by{' '}
              {rfiDataByRowId?.jsonData.rfiDueBy}
            </p>
          )}
        </div>
        <RfiFormStatus application={applicationByRowId} isSaving={false} />
      </Flex>
      <FormDiv>
        <FormBase
          formContext={{ setTemplateData }}
          theme={RfiTheme}
          schema={rfiSchema}
          uiSchema={rfiAnalystUiSchema}
          omitExtraData={false}
          formData={rfiDataByRowId?.jsonData}
          onSubmit={handleSubmit}
          noValidate
        >
          <Button>Save</Button>
        </FormBase>
      </FormDiv>
    </div>
  );
};

export default RfiAnalystUpload;
