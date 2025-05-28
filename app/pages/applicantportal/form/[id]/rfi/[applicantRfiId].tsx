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
import { useState } from 'react';
import useEmailNotification from 'lib/helpers/useEmailNotification';
import useRfiCoverageMapKmzUploadedEmail from 'lib/helpers/useRfiCoverageMapKmzUploadedEmail';
import { useUpdateRfiAndCreateTemplateNineDataMutation } from 'schema/mutations/application/updateRfiAndCreateTemplateNineDataMutation';
import { useUpdateRfiAndFormDataMutation } from 'schema/mutations/application/updateRfiAndFormDataMutation';
import { useUpdateFormRfiAndCreateTemplateNineDataMutation } from 'schema/mutations/application/updateFormRfiAndCreateTemplateNineDataMutation';
import useTemplateUpload from 'lib/helpers/useTemplateUpload';
import { useToast } from 'components/AppProvider';

const Flex = styled('header')`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const SuccessMessage = styled.div`
  background-color: #388e3c;
  color: #fff;
  padding: 16px;
  border-radius: 4px;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DashboardLink = styled.a`
  color: #fff;
  text-decoration: underline;
  margin-left: 8px;
  font-weight: 600;
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
      applicationFormTemplate9DataByApplicationId(
        filter: { archivedAt: { isNull: true } }
      ) {
        nodes {
          rowId
        }
      }
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
  const [rfiRowId, setRfiRowId] = useState(rfiDataByRowId.rowId);
  const [updateRfi] = useUpdateWithTrackingRfiMutation();
  const [updateRfiAndCreateTemplateNineData] =
    useUpdateRfiAndCreateTemplateNineDataMutation();
  const [updateFormRfiAndCreateTemplateNineData] =
    useUpdateFormRfiAndCreateTemplateNineDataMutation();
  const [updateRfiAndFormData] = useUpdateRfiAndFormDataMutation();
  const router = useRouter();
  const { showToast, hideToast } = useToast();
  const formJsonData = applicationByRowId?.formData?.jsonData;
  const applicationId = router.query.id as string;
  const formSchemaId = applicationByRowId?.formData?.formSchemaId;
  const ccbcNumber = applicationByRowId?.ccbcNumber;
  const applicationFormTemplate9DataId =
    applicationByRowId?.applicationFormTemplate9DataByApplicationId?.nodes?.[0]
      ?.rowId;
  const [formData, setFormData] = useState(rfiDataByRowId.jsonData);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);
  const { notifyHHCountUpdate } = useEmailNotification();
  const { notifyRfiCoverageMapKmzUploaded } =
    useRfiCoverageMapKmzUploadedEmail();

  const {
    newFormData,
    templatesUpdated,
    hasApplicationFormDataUpdated,
    templateNineData,
    setTemplateData,
    clearTemplateUpload,
  } = useTemplateUpload({
    formData,
    formJsonData,
    applicationId,
    sendFailedReadWarning: true,
  });

  const showErrorToast = () => {
    showToast(
      <>
        Save unsuccessful, please{' '}
        <DashboardLink href="/applicantportal/dashboard">
          return to dashboard
        </DashboardLink>{' '}
        and try again.
      </>,
      'error',
      10000
    );
  };

  const handleSubmit = (e: IChangeEvent<any>) => {
    hideToast();
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
      if (templatesUpdated?.[1]) {
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

    // Helper to set success state after mutation
    const setSuccessState = (r: any) => {
      setRfiRowId(r.updateRfi.rfiData.rowId);
      setIsDirty(false);
      setIsSaveSuccess(true);
    };

    const hasTemplateNineUpdated = templatesUpdated?.[9];
    if (!hasApplicationFormDataUpdated && !hasTemplateNineUpdated) {
      // form data not updated and template nine not updated
      // only update rfi
      updateRfi({
        variables: {
          input: {
            jsonData: e.formData,
            rfiRowId,
          },
        },
        onCompleted: (r) => {
          setTemplateData(null);
          checkAndNotifyRfiCoverage().then(() => {
            // wait until email is sent before redirecting
            setSuccessState(r);
          });
        },
        onError: (err) => {
          // eslint-disable-next-line no-console
          console.log('Error updating RFI', err);
          showErrorToast();
        },
      });
    } else if (!hasApplicationFormDataUpdated && hasTemplateNineUpdated) {
      // form data not updated but template nine updated, update rfi and create template nine record
      updateRfiAndCreateTemplateNineData({
        variables: {
          rfiInput: {
            jsonData: e.formData,
            rfiRowId,
          },
          templateNineInput: {
            _applicationId: Number(applicationId),
            _jsonData: templateNineData.data,
            _previousTemplate9Id: applicationFormTemplate9DataId,
            _source: {
              source: 'RFI',
              uuid: getTemplateNineUUID(),
            },
            _errors: templateNineData.data?.errors ?? [],
          },
        },
        onError: (err) => {
          // eslint-disable-next-line no-console
          console.log(
            'Error updating RFI and creating template nine data',
            err
          );
          showErrorToast();
        },
        onCompleted: (r) => {
          setTemplateData(null);
          checkAndNotifyRfiCoverage().then(() => {
            // wait until email(s) is sent before redirecting
            setSuccessState(r);
          });
        },
      });
    } else if (hasApplicationFormDataUpdated && !hasTemplateNineUpdated) {
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
            rfiRowId,
          },
        },
        onError: (err) => {
          // eslint-disable-next-line no-console
          console.log('Error creating new form data', err);
          showErrorToast();
        },
        onCompleted: (r) => {
          setTemplateData(null);
          checkAndNotifyRfiCoverage().then(() => {
            checkAndNotifyHHCount().then(() => {
              // wait until email is sent before redirecting
              setSuccessState(r);
            });
          });
        },
      });
    } else if (hasApplicationFormDataUpdated && hasTemplateNineUpdated) {
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
            rfiRowId,
          },
          templateNineInput: {
            _applicationId: Number(applicationId),
            _jsonData: templateNineData.data,
            _source: {
              source: 'RFI',
              uuid: getTemplateNineUUID(),
            },
            _previousTemplate9Id: applicationFormTemplate9DataId,
            _errors: templateNineData.data?.errors ?? [],
          },
        },
        onError: (err) => {
          // eslint-disable-next-line no-console
          console.log(
            'Error updating RFI, form data, and template nine data',
            err
          );
          showErrorToast();
        },
        onCompleted: (r) => {
          setTemplateData(null);
          checkAndNotifyHHCount().then(() => {
            checkAndNotifyRfiCoverage().then(() => {
              // wait until email(s) is sent before redirecting
              setSuccessState(r);
            });
          });
        },
      });
    }
  };

  const handleChange = (e: IChangeEvent<any>) => {
    setIsDirty(true);
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
              clearTemplateUpload,
            }}
          >
            <Button disabled={!isDirty}>{isDirty ? 'Save' : 'Saved'}</Button>
          </FormBase>
          {/* Note: leaving this below save to leave space for future cancel */}
          {isSaveSuccess && (
            <SuccessMessage role="status" aria-live="polite">
              <span>Uploads successfully saved. </span>
              <DashboardLink href="/applicantportal/dashboard">
                Return to dashboard
              </DashboardLink>
            </SuccessMessage>
          )}
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
