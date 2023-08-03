import { useCallback, useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import communityProgressReport from 'formSchema/analyst/communityProgressReport';
import communityProgressReportUiSchema from 'formSchema/uiSchema/analyst/communityProgressReportUiSchema';
import { useCreateCommunityProgressReportMutation } from 'schema/mutations/project/createCommunityProgressReport';
import excelValidateGenerator from 'lib/helpers/excelValidate';
import ProjectTheme from '../ProjectTheme';
import ProjectForm from '../ProjectForm';
import AddButton from '../AddButton';

interface FormData {
  progressReportFile?: any;
  dueDate?: string;
  dateReceived?: string;
}

const CommunityProgressReportForm = ({ application }) => {
  const queryFragment = useFragment(
    graphql`
      fragment CommunityProgressReportForm_application on Application {
        id
        rowId
        applicationCommunityProgressReportDataByApplicationId(
          filter: { archivedAt: { isNull: true } }
          first: 1000
        )
          @connection(
            key: "CommunityProgressReportForm_applicationCommunityProgressReportDataByApplicationId"
          ) {
          __id
          edges {
            node {
              id
              jsonData
            }
          }
        }
        ccbcNumber
      }
    `,
    application
  );
  const { rowId } = queryFragment;
  const [formData, setFormData] = useState({} as FormData);
  const [isFormEditMode, setIsFormEditMode] = useState(false);
  const [createCommunityProgressReport] =
    useCreateCommunityProgressReportMutation();
  const [excelFile, setExcelFile] = useState(null);

  const apiPath = `/api/analyst/community-report/${rowId}`;

  // will need to pass in something like setValidationErrors as a third argument in the validation ticket
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const validateCommunityReport = useCallback(
    excelValidateGenerator(apiPath, setExcelFile),
    [setExcelFile]
  );

  const handleResetFormData = () => {
    setIsFormEditMode(false);
    setFormData({} as FormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    validateCommunityReport(excelFile, false).then(() => {
      /// save form data
      createCommunityProgressReport({
        variables: {
          input: {
            applicationCommunityProgressReportData: {
              jsonData: formData,
              applicationId: rowId,
            },
          },
        },
        onCompleted: () => {
          handleResetFormData();
        },
      });
    });
  };

  return (
    <ProjectForm
      additionalContext={{
        applicationId: rowId,
        validateExcel: validateCommunityReport,
      }}
      schema={communityProgressReport}
      uiSchema={communityProgressReportUiSchema}
      formData={formData}
      theme={ProjectTheme}
      onSubmit={handleSubmit}
      formAnimationHeight={400}
      isFormAnimated
      isFormEditMode={isFormEditMode}
      setIsFormEditMode={(boolean) => setIsFormEditMode(boolean)}
      saveBtnText={formData?.progressReportFile ? 'Save & Import' : 'Save'}
      title="Community progress report"
      handleChange={(e) => {
        setFormData({ ...e.formData });
      }}
      resetFormData={handleResetFormData}
      setFormData={setFormData}
      showEditBtn={false}
      before={
        <AddButton
          isFormEditMode={isFormEditMode}
          onClick={() => setIsFormEditMode(true)}
          title="Add community progress report"
        />
      }
      saveDataTestId="save-community-progress-report"
    />
  );
};

export default CommunityProgressReportForm;
