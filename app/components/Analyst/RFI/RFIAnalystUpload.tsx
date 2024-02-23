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
  } = applicationByRowId;

  const { rfiNumber } = rfiDataByRowId;

  const [createNewFormData] = useCreateNewFormDataMutation();
  const [updateRfi] = useUpdateWithTrackingRfiMutation();
  const [rfiFormData, setRfiFormData] = useState(rfiDataByRowId?.jsonData);
  const [newFormData, setNewFormData] = useState(jsonData);
  const [templateData, setTemplateData] = useState(null);
  const [excelImportFields, setExcelImportFields] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (templateData?.templateNumber === 1) {
      setExcelImportFields([...excelImportFields, 'Template 1']);
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
      setExcelImportFields([...excelImportFields, 'Template 2']);
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

  const handleSubmit = () => {
    const updatedExcelFields = excelImportFields.join(', ');
    const reasonForChange = `Auto updated from upload of ${updatedExcelFields} for RFI: ${rfiNumber}`;
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
              router.push(
                `/analyst/application/${router.query.applicationId}/rfi`
              );
            },
          });
        } else {
          router.push(`/analyst/application/${router.query.applicationId}/rfi`);
        }
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
