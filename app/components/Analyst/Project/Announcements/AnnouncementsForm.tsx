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
        applicationByRowId(rowId: $rowId) {
          ccbcNumber
        }
        allApplications {
          nodes {
            ccbcNumber
            rowId
          }
        }
      }
    `,
    query
  );

  const {
    announcement,
    applicationByRowId: { ccbcNumber },
  } = queryFragment;

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

  // Filter out this application CCBC ID
  const ccbcIdList = queryFragment.allApplications.nodes.filter(
    (application) => {
      return application.ccbcNumber !== ccbcNumber;
    }
  );

  return (
    <ProjectForm
      additionalContext={{ ccbcIdList }}
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
