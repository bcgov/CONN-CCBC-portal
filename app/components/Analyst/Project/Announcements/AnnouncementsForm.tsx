import { useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import { ProjectForm } from 'components/Analyst/Project';
import announcementsSchema from 'formSchema/analyst/announcements';
import announcementsUiSchema from 'formSchema/uiSchema/analyst/announcementsUiSchema';
import AnnouncementsArrayFieldTemplate from './AnnouncementsArrayFieldTemplate';
import ProjectTheme from '../ProjectTheme';

const AnnouncementsForm = ({ query }) => {
  const queryFragment = useFragment(
    graphql`
      fragment AnnouncementsForm_query on Query {
        announcement(id: "1") {
          jsonData
        }
      }
    `,
    query
  );

  const { announcement } = queryFragment;

  const jsonData = announcement?.jsonData;
  const [newFormData, setNewFormData] = useState({});
  const [oldFormData] = useState(jsonData);
  const [isFormEditMode, setIsFormEditMode] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleResetFormData = () => {
    setNewFormData(oldFormData);
  };

  return (
    <ProjectForm
      formData={newFormData}
      handleChange={() => {}}
      isFormEditMode={isFormEditMode}
      title="Announcements"
      schema={announcementsSchema}
      uiSchema={announcementsUiSchema}
      theme={{
        ...ProjectTheme,
        ArrayFieldTemplate: AnnouncementsArrayFieldTemplate,
      }}
      resetFormData={handleResetFormData}
      onSubmit={handleSubmit}
      setIsFormEditMode={(boolean) => setIsFormEditMode(boolean)}
    />
  );
};

export default AnnouncementsForm;
