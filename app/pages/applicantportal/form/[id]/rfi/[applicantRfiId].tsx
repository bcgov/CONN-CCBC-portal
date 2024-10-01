import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import { ApplicantRfiIdQuery } from '__generated__/ApplicantRfiIdQuery.graphql';
import { FormBase, RfiFormStatus } from 'components/Form';
import { RfiTheme } from 'components/Analyst/RFI';
import rfiSchema from 'formSchema/analyst/rfiSchema';
import { rfiApplicantUiSchema } from 'formSchema/uiSchema/analyst/rfiUiSchema';
import { Button } from '@button-inc/bcgov-theme';
import { useUpdateWithTrackingRfiMutation } from 'schema/mutations/application/updateWithTrackingRfiMutation';
import { IChangeEvent } from '@rjsf/core';
import { useRouter } from 'next/router';
import FormDiv from 'components/FormDiv';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useCreateNewFormDataMutation } from 'schema/mutations/application/createNewFormData';
import useHHCountUpdateEmail from 'lib/helpers/useHHCountUpdateEmail';
import useRfiCoverageMapKmzUploadedEmail from 'lib/helpers/useRfiCoverageMapKmzUploadedEmail';

const Flex = styled('header')`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const getApplicantRfiIdQuery = graphql`
  query ApplicantRfiIdQuery($applicationId: Int!, $rfiId: Int!) {
    rfiDataByRowId(rowId: $rfiId) {
      ...RfiForm_RfiData
      jsonData
      rfiNumber
      rowId
      id
    }
    session {
      sub
    }
    applicationByRowId(rowId: $applicationId) {
      ...RfiFormStatus_application
      id
      ccbcNumber
      organizationName
      formData {
        id
        formSchemaId
        jsonData
        lastEditedPage
        rowId
        updatedAt
        formByFormSchemaId {
          jsonSchema
        }
      }
    }
  }
`;

const ApplicantRfiPage = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, ApplicantRfiIdQuery>) => {
  const query = usePreloadedQuery(getApplicantRfiIdQuery, preloadedQuery);
  const { session, rfiDataByRowId, applicationByRowId } = query;
  const { rfiNumber } = rfiDataByRowId;
  const [updateRfi] = useUpdateWithTrackingRfiMutation();
  const router = useRouter();
  const formJsonData = applicationByRowId?.formData?.jsonData;
  const applicationId = router.query.id as string;
  const formSchemaId = applicationByRowId?.formData?.formSchemaId;
  const ccbcNumber = applicationByRowId?.ccbcNumber;
  const [newFormData, setNewFormData] = useState(formJsonData);
  const [createNewFormData] = useCreateNewFormDataMutation();
  const [templateData, setTemplateData] = useState(null);
  const [formData, setFormData] = useState(rfiDataByRowId.jsonData);
  const { notifyHHCountUpdate } = useHHCountUpdateEmail();
  const { notifyRfiCoverageMapKmzUploaded } =
    useRfiCoverageMapKmzUploadedEmail();

  useEffect(() => {
    if (templateData?.templateNumber === 1 && !templateData.error) {
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
    } else if (templateData?.templateNumber === 2 && !templateData.error) {
      const newFormDataWithTemplateTwo = {
        ...newFormData,
        budgetDetails: {
          ...newFormData.budgetDetails,
          totalEligibleCosts: templateData.data.result.totalEligibleCosts,
          totalProjectCost: templateData.data.result.totalProjectCosts,
        },
      };
      setNewFormData(newFormDataWithTemplateTwo);
    } else if (templateData?.error && templateData?.templateNumber === 1) {
      const fileArrayLength =
        newFormData.templateUploads?.eligibilityAndImpactsCalculator?.length;
      fetch(`/api/email/notifyFailedReadOfTemplateData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          host: window.location.origin,
          params: {
            templateNumber: templateData.templateNumber,
            uuid: newFormData.templateUploads
              ?.eligibilityAndImpactsCalculator?.[fileArrayLength - 1]?.uuid,
            uploadedAt:
              newFormData.templateUploads?.eligibilityAndImpactsCalculator?.[
                fileArrayLength - 1
              ]?.uploadedAt,
          },
        }),
      });
    } else if (templateData?.error && templateData?.templateNumber === 2) {
      const fileArrayLength =
        newFormData.templateUploads?.detailedBudget?.length;
      fetch(`/api/email/notifyFailedReadOfTemplateData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          host: window.location.origin,
          params: {
            templateNumber: templateData.templateNumber,
            uuid: newFormData.templateUploads?.detailedBudget?.[
              fileArrayLength - 1
            ]?.uuid,
            uploadedAt:
              newFormData.templateUploads?.detailedBudget?.[fileArrayLength - 1]
                ?.uploadedAt,
          },
        }),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateData]);

  const handleSubmit = (e: IChangeEvent<any>) => {
    updateRfi({
      variables: {
        input: {
          jsonData: e.formData,
          rfiRowId: rfiDataByRowId.rowId,
        },
      },
      onCompleted: () => {
        if (e.formData?.rfiAdditionalFiles?.geographicCoverageMap?.length > 0) {
          notifyRfiCoverageMapKmzUploaded(
            rfiDataByRowId,
            e.formData,
            applicationId,
            ccbcNumber,
            rfiNumber,
            applicationByRowId.organizationName
          );
        }
        if (!templateData) {
          router.push(`/applicantportal/dashboard`);
        }
      },
      onError: (err) => {
        // eslint-disable-next-line no-console
        console.log('Error updating RFI', err);
      },
    });
    if (templateData) {
      createNewFormData({
        variables: {
          input: {
            applicationRowId: Number(applicationId),
            jsonData: newFormData,
            reasonForChange: `Auto updated from upload for RFI: ${rfiNumber}`,
            formSchemaId,
          },
        },
        onError: (err) => {
          // eslint-disable-next-line no-console
          console.log('Error creating new form data', err);
        },
        onCompleted: () => {
          if (templateData?.templateNumber === 1) {
            notifyHHCountUpdate(
              newFormData.benefits,
              formJsonData.benefits,
              applicationId,
              {
                ccbcNumber,
                timestamp: new Date().toLocaleString(),
                manualUpdate: false,
                rfiNumber,
                organizationName: applicationByRowId.organizationName,
              }
            );
          }
          setTemplateData(null);
          router.push(`/applicantportal/dashboard`);
        },
      });
    }
  };

  const handleChange = (e: IChangeEvent<any>) => {
    setFormData(e.formData);
  };

  return (
    <Layout session={session} title="Connecting Communities BC">
      <div>
        <Flex>
          <div>
            <h2>Upload new files</h2>
            {rfiDataByRowId.jsonData.rfiDueBy && (
              <p>
                Please upload the following files by{' '}
                {rfiDataByRowId.jsonData.rfiDueBy}
              </p>
            )}
          </div>
          <RfiFormStatus application={applicationByRowId} isSaving={false} />
        </Flex>
        <FormDiv>
          <FormBase
            theme={RfiTheme}
            schema={rfiSchema}
            uiSchema={rfiApplicantUiSchema}
            omitExtraData={false}
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            noValidate
            formContext={{ setTemplateData }}
          >
            <Button>Save</Button>
          </FormBase>
        </FormDiv>
      </div>
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,

  variablesFromContext: (ctx) => {
    return {
      applicationId: parseInt(ctx.query.id.toString(), 10),
      rfiId: parseInt(ctx.query.applicantRfiId.toString(), 10),
    };
  },
};

export default withRelay(
  ApplicantRfiPage,
  getApplicantRfiIdQuery,
  withRelayOptions
);
