import communityProgressReport from 'formSchema/analyst/communityProgressReport';
import communityProgressReportUiSchema from 'formSchema/uiSchema/analyst/communityProgressReportUiSchema';
import { useState } from 'react';
import { useCreateCommunityProgressReportMutation } from 'schema/mutations/project/createCommunityProgressReport';
import { graphql, useFragment } from 'react-relay';
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
      }
    `,
    application
  );
  const { rowId } = queryFragment;
  const [formData, setFormData] = useState({} as FormData);
  const [isFormEditMode, setIsFormEditMode] = useState(false);
  const [createCommunityProgressReport] =
    useCreateCommunityProgressReportMutation();

  const handleResetFormData = () => {
    setIsFormEditMode(false);
    setFormData({} as FormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
  };

  return (
    <ProjectForm
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
