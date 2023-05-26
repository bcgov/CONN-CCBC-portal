import { useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import ProjectForm from 'components/Analyst/Project/ProjectForm';
import projectInformationSchema from 'formSchema/analyst/projectInformation';
import projectInformationUiSchema from 'formSchema/uiSchema/analyst/projectInformationUiSchema';
import { useCreateProjectInformationMutation } from 'schema/mutations/project/createProjectInformation';
import ProjectTheme from 'components/Analyst/Project/ProjectTheme';

const ProjectInformationForm = ({ application }) => {
  const queryFragment = useFragment(
    graphql`
      fragment ProjectInformationForm_application on Application {
        id
        rowId
        projectInformation {
          id
          jsonData
        }
      }
    `,
    application
  );

  const { rowId, projectInformation } = queryFragment;

  const [createProjectInformation] = useCreateProjectInformationMutation();
  const [formData, setFormData] = useState(projectInformation?.jsonData);
  const [isFormEditMode, setIsFormEditMode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    createProjectInformation({
      variables: {
        input: { _applicationId: rowId, _jsonData: formData },
      },
      onCompleted: () => {
        setIsFormEditMode(false);
      },
    });
  };

  const handleResetFormData = () => {
    setFormData({});
  };

  return (
    <ProjectForm
      formData={formData}
      handleChange={(e) => {
        setFormData({ ...e.formData });
      }}
      isFormEditMode={isFormEditMode}
      title="Project information"
      schema={projectInformationSchema}
      theme={ProjectTheme}
      uiSchema={projectInformationUiSchema}
      resetFormData={handleResetFormData}
      onSubmit={handleSubmit}
      setIsFormEditMode={(boolean) => setIsFormEditMode(boolean)}
    />
  );
};

export default ProjectInformationForm;
