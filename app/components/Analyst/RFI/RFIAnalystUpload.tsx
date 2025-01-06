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

import { useCreateNewFormDataMutation } from 'schema/mutations/application/createNewFormData';
import useEmailNotification from 'lib/helpers/useEmailNotification';
import useRfiCoverageMapKmzUploadedEmail from 'lib/helpers/useRfiCoverageMapKmzUploadedEmail';
import { useToast } from 'components/AppProvider';
import Link from 'next/link';
import joinWithAnd from 'utils/formatArray';

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
  } = applicationByRowId;
  const { showToast, hideToast } = useToast();

  const { rfiNumber } = rfiDataByRowId;

  const [createNewFormData] = useCreateNewFormDataMutation();
  const [updateRfi] = useUpdateWithTrackingRfiMutation();
  const [rfiFormData, setRfiFormData] = useState(rfiDataByRowId?.jsonData);
  const [newFormData, setNewFormData] = useState(jsonData);
  const [templateData, setTemplateData] = useState(null);
  const [excelImportFields, setExcelImportFields] = useState([]);
  const [excelImportFiles, setExcelImportFiles] = useState([]);
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
    } else if (templateData?.templateNumber === 9 && !templateData?.error) {
      setExcelImportFields([...excelImportFields, 'Template 9']);
      setExcelImportFiles([...excelImportFiles, templateData?.templateName]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateData]);

  const getToastMessage = () => {
    return (
      <>
        {' '}
        Template {templateData?.templateNumber} data changed successfully, new
        values for{' '}
        {templateData?.templateNumber === 1
          ? 'Total Households and Indigenous Households'
          : 'Total eligible costs and Total project costs'}{' '}
        data in the application now reflect template uploads. Please see{' '}
        <StyledLink
          href={`/analyst/application/${router.query.applicationId}/history`}
        >
          history page
        </StyledLink>{' '}
        for details.
      </>
    );
  };

  const handleSubmit = () => {
    const updatedExcelFields = excelImportFields.join(', ');
    const reasonForChange = `Auto updated from upload of ${updatedExcelFields} for RFI: ${rfiNumber}`;
    hideToast();
    updateRfi({
      variables: {
        input: {
          jsonData: rfiFormData,
          rfiRowId: rfiDataByRowId.rowId,
        },
      },
      onCompleted: () => {
        if (excelImportFields.length > 0) {
          createNewFormData({
            variables: {
              input: {
                applicationRowId: Number(applicationId),
                jsonData: newFormData,
                reasonForChange,
                formSchemaId,
              },
            },
            onCompleted: () => {
              if (templateData?.templateNumber === 1) {
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
              if (
                templateData?.templateNumber === 1 ||
                templateData?.templateNumber === 2
              ) {
                showToast(getToastMessage(), 'success', 100000000);
              }
              notifyDocumentUpload(applicationId, {
                ccbcNumber,
                documentType: joinWithAnd(excelImportFields),
                documentNames: excelImportFiles,
              });
            },
          });
        }
        if (
          rfiFormData?.rfiAdditionalFiles?.geographicCoverageMap?.length > 0
        ) {
          notifyRfiCoverageMapKmzUploaded(
            rfiDataByRowId,
            rfiFormData,
            applicationId,
            ccbcNumber,
            rfiNumber
          );
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
