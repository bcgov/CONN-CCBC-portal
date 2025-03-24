import { useEffect, useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import { Button } from '@button-inc/bcgov-theme';
import { FormDiv } from 'components';
import { RfiTheme } from 'components/Analyst/RFI';
import { RfiFormStatus, FormBase } from 'components/Form';
import { rfiSchema } from 'formSchema/analyst';
import { rfiAnalystUiSchema } from 'formSchema/uiSchema/analyst/rfiUiSchema';
import { useRouter } from 'next/router';
import { useUpdateWithTrackingRfiMutation } from 'schema/mutations/application/updateWithTrackingRfiMutation';
import styled from 'styled-components';
import { DateTime } from 'luxon';

import useEmailNotification from 'lib/helpers/useEmailNotification';
import useRfiCoverageMapKmzUploadedEmail from 'lib/helpers/useRfiCoverageMapKmzUploadedEmail';
import { useToast } from 'components/AppProvider';
import Link from 'next/link';
import joinWithAnd from 'utils/formatArray';
import { useUpdateRfiAndCreateTemplateNineDataMutation } from 'schema/mutations/application/updateRfiAndCreateTemplateNineDataMutation';
import { useUpdateFormRfiAndCreateTemplateNineDataMutation } from 'schema/mutations/application/updateFormRfiAndCreateTemplateNineDataMutation';
import { useUpdateRfiAndFormDataMutation } from 'schema/mutations/application/updateRfiAndFormDataMutation';

const Flex = styled('header')`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.color.white};
`;

const RfiAnalystUpload = ({ query }) => {
  const queryFragment = useFragment(
    graphql`
      fragment RFIAnalystUpload_query on Query {
        applicationByRowId(rowId: $rowId) {
          id
          rowId
          ccbcNumber
          formData {
            formSchemaId
            jsonData
          }
          applicationFormTemplate9DataByApplicationId(
            filter: { archivedAt: { isNull: true } }
          ) {
            nodes {
              rowId
            }
          }
          ...RfiFormStatus_application
        }
        rfiDataByRowId(rowId: $rfiId) {
          id
          rowId
          jsonData
          rfiNumber
          ...RfiForm_RfiData
        }
      }
    `,
    query
  );

  const { rfiDataByRowId, applicationByRowId } = queryFragment;
  const {
    formData: { formSchemaId, jsonData },
    rowId: applicationId,
    ccbcNumber,
    applicationFormTemplate9DataByApplicationId,
  } = applicationByRowId;
  const { showToast, hideToast } = useToast();

  const { rfiNumber } = rfiDataByRowId;
  const applicationFormTemplate9DataId =
    applicationFormTemplate9DataByApplicationId?.nodes?.[0]?.rowId;

  const [updateRfi] = useUpdateWithTrackingRfiMutation();
  const [updateRfiAndCreateTemplateNineData] =
    useUpdateRfiAndCreateTemplateNineDataMutation();
  const [updateFormRfiAndCreateTemplateNineData] =
    useUpdateFormRfiAndCreateTemplateNineDataMutation();
  const [updateRfiAndFormData] = useUpdateRfiAndFormDataMutation();
  const [rfiFormData, setRfiFormData] = useState(rfiDataByRowId?.jsonData);
  const [newFormData, setNewFormData] = useState(jsonData);
  const [templateData, setTemplateData] = useState(null);
  const [templateNineData, setTemplateNineData] = useState(null);
  const [excelImportFields, setExcelImportFields] = useState([]);
  const [excelImportFiles, setExcelImportFiles] = useState([]);
  const [hasApplicationFormDataUpdated, setHasApplicationFormDataUpdated] =
    useState(false);
  const [templatesUpdated, setTemplatesUpdated] = useState({
    one: false,
    two: false,
    nine: false,
  });
  const router = useRouter();
  const { notifyHHCountUpdate, notifyDocumentUpload } = useEmailNotification();
  const { notifyRfiCoverageMapKmzUploaded } =
    useRfiCoverageMapKmzUploadedEmail();

  useEffect(() => {
    if (templateData?.templateNumber === 1 && !templateData?.error) {
      setExcelImportFields([...excelImportFields, 'Template 1']);
      setExcelImportFiles([...excelImportFiles, templateData?.templateName]);
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
      setTemplateData(null);
      setHasApplicationFormDataUpdated(true);
    } else if (templateData?.templateNumber === 2 && !templateData?.error) {
      setExcelImportFields([...excelImportFields, 'Template 2']);
      setExcelImportFiles([...excelImportFiles, templateData?.templateName]);
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
      setTemplateData(null);
      setHasApplicationFormDataUpdated(true);
    } else if (templateData?.templateNumber === 9 && !templateData?.error) {
      setExcelImportFields([...excelImportFields, 'Template 9']);
      setExcelImportFiles([...excelImportFiles, templateData?.templateName]);
      setTemplateNineData(templateData);
      setTemplatesUpdated((prevTemplatesUpdated) => {
        return { ...prevTemplatesUpdated, nine: true };
      });
      setTemplateData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateData]);

  const getToastMessage = (templateNumber) => (
    <>
      Template {templateNumber} data changed successfully, new values for{' '}
      {templateNumber === 1
        ? 'Total Households and Indigenous Households'
        : 'Total eligible costs and Total project costs'}{' '}
      data in the application now reflect template uploads. Please see{' '}
      <StyledLink
        href={`/analyst/application/${router.query.applicationId}/history`}
      >
        history page
      </StyledLink>{' '}
      for details.
      <br />
    </>
  );

  const processUpload = async (mutation, payload) => {
    const successCallback = () => {
      setTemplateData(null);
      // show toast messages for uploaded/updated data
      if (
        templatesUpdated?.one ||
        templatesUpdated?.two ||
        templatesUpdated?.nine
      ) {
        const message = (
          <>
            {templatesUpdated.nine && (
              <>
                Template 9 processing successful, geographic names have been
                updated for this application.
                <br />
              </>
            )}
            {templatesUpdated.one && getToastMessage(1)}
            {templatesUpdated.two && getToastMessage(2)}
          </>
        );
        showToast(message, 'success', 100000000);
      }
      notifyDocumentUpload(applicationId, {
        ccbcNumber,
        documentType: joinWithAnd(excelImportFields),
        documentNames: excelImportFiles,
      });
      if (rfiFormData?.rfiAdditionalFiles?.geographicCoverageMap?.length > 0) {
        notifyRfiCoverageMapKmzUploaded(
          rfiDataByRowId,
          rfiFormData,
          applicationId,
          ccbcNumber,
          rfiNumber
        );
      }
      if (templatesUpdated?.one) {
        notifyHHCountUpdate(
          newFormData.benefits,
          jsonData.benefits,
          applicationId,
          {
            ccbcNumber,
            timestamp: new Date().toLocaleString(),
            manualUpdate: false,
            rfiNumber,
          }
        );
      }
      router.push(`/analyst/application/${router.query.applicationId}/rfi`);
    };

    const errorCallback = (err) => {
      // eslint-disable-next-line no-console
      console.log('Error updating RFI', err);
    };

    // call mutation based on documents updated
    mutation({
      variables: payload,
      onCompleted: successCallback,
      onError: errorCallback,
    });
  };

  const handleSubmit = async () => {
    hideToast();
    const updatedExcelFields = excelImportFields.join(', ');
    const reasonForChange = `Auto updated from upload of ${updatedExcelFields} for RFI: ${rfiNumber}`;
    const payloadRfi = {
      jsonData: rfiFormData,
      rfiRowId: rfiDataByRowId.rowId,
    };
    const payloadFormData = {
      applicationRowId: Number(applicationId),
      jsonData: newFormData,
      reasonForChange,
      formSchemaId,
    };
    const payloadTemplateNine = {
      _applicationId: Number(applicationId),
      _jsonData: templateNineData?.data,
      _previousTemplate9Id: applicationFormTemplate9DataId,
      _source: {
        source: 'rfi',
        rfiNumber: rfiNumber || null,
        fileName: templateNineData?.data?.originalFilename,
        date: DateTime.now().toISO(),
      },
      _errors: templateNineData?.data?.errors || {},
    };

    if (!hasApplicationFormDataUpdated && !templatesUpdated.nine) {
      // only update rfi
      processUpload(updateRfi, { input: payloadRfi });
    } else if (!hasApplicationFormDataUpdated && templatesUpdated.nine) {
      // form data not updated but template nine updated, update rfi and create template nine record
      processUpload(updateRfiAndCreateTemplateNineData, {
        rfiInput: payloadRfi,
        templateNineInput: payloadTemplateNine,
      });
    } else if (hasApplicationFormDataUpdated && !templatesUpdated.nine) {
      // only update rfi and form data since no template nine data
      processUpload(updateRfiAndFormData, {
        formInput: payloadFormData,
        rfiInput: payloadRfi,
      });
    } else if (hasApplicationFormDataUpdated && templatesUpdated.nine) {
      // update rfi, form data, and template nine data (all three)
      processUpload(updateFormRfiAndCreateTemplateNineData, {
        formInput: payloadFormData,
        rfiInput: payloadRfi,
        templateNineInput: payloadTemplateNine,
      });
    }
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
          formContext={{ setTemplateData, rfiNumber }}
          theme={RfiTheme}
          schema={rfiSchema}
          uiSchema={rfiAnalystUiSchema}
          omitExtraData={false}
          onChange={(e) => {
            setRfiFormData({ ...e.formData });
          }}
          formData={rfiFormData}
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
