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
import useEmailNotification from 'lib/helpers/useEmailNotification';
import useRfiCoverageMapKmzUploadedEmail from 'lib/helpers/useRfiCoverageMapKmzUploadedEmail';
import { useUpdateRfiAndCreateTemplateNineDataMutation } from 'schema/mutations/application/updateRfiAndCreateTemplateNineDataMutation';
import { useUpdateRfiAndFormDataMutation } from 'schema/mutations/application/updateRfiAndFormDataMutation';
import { useUpdateFormRfiAndCreateTemplateNineDataMutation } from 'schema/mutations/application/updateFormRfiAndCreateTemplateNineDataMutation';

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
  const [updateRfiAndCreateTemplateNineData] =
    useUpdateRfiAndCreateTemplateNineDataMutation();
  const [updateFormRfiAndCreateTemplateNineData] =
    useUpdateFormRfiAndCreateTemplateNineDataMutation();
  const [updateRfiAndFormData] = useUpdateRfiAndFormDataMutation();
  const router = useRouter();
  const formJsonData = applicationByRowId?.formData?.jsonData;
  const applicationId = router.query.id as string;
  const formSchemaId = applicationByRowId?.formData?.formSchemaId;
  const ccbcNumber = applicationByRowId?.ccbcNumber;
  const [newFormData, setNewFormData] = useState(formJsonData);
  const [hasApplicationFormDataUpdated, setHasApplicationFormDataUpdated] =
    useState(false);
  const [templateNineData, setTemplateNineData] = useState(null);
  const [templateData, setTemplateData] = useState(null);
  const [templatesUpdated, setTemplatesUpdated] = useState({
    one: false,
    two: false,
    nine: false,
  });
  const [formData, setFormData] = useState(rfiDataByRowId.jsonData);
  const { notifyHHCountUpdate } = useEmailNotification();
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
      setTemplatesUpdated((prevTemplatesUpdated) => {
        return { ...prevTemplatesUpdated, one: true };
      });
      setHasApplicationFormDataUpdated(true);
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
      setTemplatesUpdated((prevTemplatesUpdated) => {
        return { ...prevTemplatesUpdated, two: true };
      });
      setHasApplicationFormDataUpdated(true);
    } else if (templateData?.templateNumber === 9 && !templateData.error) {
      setTemplatesUpdated((prevTemplatesUpdated) => {
        return { ...prevTemplatesUpdated, nine: true };
      });
      setTemplateNineData({ ...templateData });
    } else if (
      templateData?.error &&
      (templateData?.templateNumber === 1 ||
        templateData?.templateNumber === 2 ||
        templateData?.templateNumber === 9)
    ) {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateData]);

  const handleSubmit = (e: IChangeEvent<any>) => {
    const getTemplateNineUUID = () => {
      // can be wrong source if there are multiple uploads
      return e.formData?.rfiAdditionalFiles?.geographicNames?.[0]?.uuid;
    };

    const checkAndNotifyRfiCoverage = async () => {
      if (e.formData?.rfiAdditionalFiles?.geographicCoverageMap?.length > 0) {
        return notifyRfiCoverageMapKmzUploaded(
          rfiDataByRowId,
          e.formData,
          applicationId,
          ccbcNumber,
          rfiNumber,
          applicationByRowId.organizationName
        );
      }
      return Promise.resolve();
    };

    const checkAndNotifyHHCount = async () => {
      if (templatesUpdated?.one) {
        return notifyHHCountUpdate(
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
      return Promise.resolve();
    };

    if (!hasApplicationFormDataUpdated && !templatesUpdated.nine) {
      // form data not updated and template nine not updated
      // only update rfi
      updateRfi({
        variables: {
          input: {
            jsonData: e.formData,
            rfiRowId: rfiDataByRowId.rowId,
          },
        },
        onCompleted: () => {
          checkAndNotifyRfiCoverage().then(() => {
            // wait until email is sent before redirecting
            router.push(`/applicantportal/dashboard`);
          });
        },
        onError: (err) => {
          // eslint-disable-next-line no-console
          console.log('Error updating RFI', err);
        },
      });
    } else if (!hasApplicationFormDataUpdated && templatesUpdated.nine) {
      // form data not updated but template nine updated, update rfi and create template nine record
      updateRfiAndCreateTemplateNineData({
        variables: {
          rfiInput: {
            jsonData: e.formData,
            rfiRowId: rfiDataByRowId.rowId,
          },
          templateNineInput: {
            applicationFormTemplate9Data: {
              applicationId: Number(applicationId),
              jsonData: templateNineData.data,
              source: {
                source: 'RFI',
                uuid: getTemplateNineUUID(),
              },
            },
          },
        },
        onError: (err) => {
          // eslint-disable-next-line no-console
          console.log(
            'Error updating RFI and creating template nine data',
            err
          );
        },
        onCompleted: () => {
          checkAndNotifyRfiCoverage().then(() => {
            // wait until email(s) is sent before redirecting
            router.push(`/applicantportal/dashboard`);
          });
        },
      });
    } else if (hasApplicationFormDataUpdated && !templatesUpdated.nine) {
      // only update rfi and form data since no template nine data
      updateRfiAndFormData({
        variables: {
          formInput: {
            applicationRowId: Number(applicationId),
            jsonData: newFormData,
            reasonForChange: `Auto updated from upload for RFI: ${rfiNumber}`,
            formSchemaId,
          },
          rfiInput: {
            jsonData: e.formData,
            rfiRowId: rfiDataByRowId.rowId,
          },
        },
        onError: (err) => {
          // eslint-disable-next-line no-console
          console.log('Error creating new form data', err);
        },
        onCompleted: () => {
          setTemplateData(null);
          checkAndNotifyRfiCoverage().then(() => {
            checkAndNotifyHHCount().then(() => {
              // wait until email is sent before redirecting
              router.push(`/applicantportal/dashboard`);
            });
          });
        },
      });
    } else if (hasApplicationFormDataUpdated && templatesUpdated.nine) {
      // update rfi, form data, and template nine data (all three)
      updateFormRfiAndCreateTemplateNineData({
        variables: {
          formInput: {
            applicationRowId: Number(applicationId),
            jsonData: newFormData,
            reasonForChange: `Auto updated from upload for RFI: ${rfiNumber}`,
            formSchemaId,
          },
          rfiInput: {
            jsonData: e.formData,
            rfiRowId: rfiDataByRowId.rowId,
          },
          templateNineInput: {
            applicationFormTemplate9Data: {
              applicationId: Number(applicationId),
              jsonData: templateNineData.data,
              source: {
                source: 'RFI',
                uuid: getTemplateNineUUID(),
              },
            },
          },
        },
        onError: (err) => {
          // eslint-disable-next-line no-console
          console.log(
            'Error updating RFI, form data, and template nine data',
            err
          );
        },
        onCompleted: () => {
          checkAndNotifyHHCount().then(() => {
            checkAndNotifyRfiCoverage().then(() => {
              // wait until email(s) is sent before redirecting
              router.push(`/applicantportal/dashboard`);
            });
          });
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
            formContext={{
              setTemplateData,
              skipUnsavedWarning: true,
              rfiNumber,
            }}
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
