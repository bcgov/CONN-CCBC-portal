import communityProgressReport from 'formSchema/analyst/communityProgressReport';
import communityProgressReportUiSchema from 'formSchema/uiSchema/analyst/communityProgressReportUiSchema';
import { useState } from 'react';
import ProjectTheme from '../ProjectTheme';
import ProjectForm from '../ProjectForm';
import AddButton from '../AddButton';

interface FormData {
  progressReportFile?: any;
  dueDate?: string;
  dateReceived?: string;
}

const CommunityProgressReportForm = () => {
  const [formData, setFormData] = useState({} as FormData);
  const [isFormEditMode, setIsFormEditMode] = useState(false);

  const handleResetFormData = () => {
    setIsFormEditMode(false);
    setFormData({} as FormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleResetFormData();
    // TODO
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
    />
  );
};

export default CommunityProgressReportForm;
