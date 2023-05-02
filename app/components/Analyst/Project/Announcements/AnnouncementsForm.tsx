import { useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import { ProjectForm } from 'components/Analyst/Project';
import ViewAnnouncements from 'components/Analyst/Project/Announcements/ViewAnnouncements';
import announcementsSchema from 'formSchema/analyst/announcements';
import announcementsUiSchema from 'formSchema/uiSchema/analyst/announcementsUiSchema';
import { useCreateAnnouncementMutation } from 'schema/mutations/project/createAnnouncement';
import ProjectTheme from '../ProjectTheme';

const AnnouncementsForm = ({ query }) => {
  const queryFragment = useFragment(
    graphql`
      fragment AnnouncementsForm_query on Query {
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

  const [createAnnouncement] = useCreateAnnouncementMutation();

  const concatCCBCNumbers = (currentCcbcNumber, ccbcNumberList) => {
    if (ccbcNumberList.length === 0) return currentCcbcNumber;
    let projectNumbers = '';
    ccbcNumberList.forEach((application) => {
      projectNumbers += `${application.ccbcNumber},`;
    });
    return `${currentCcbcNumber},${projectNumbers}`;
  };

  const handleSubmit = (e) => {
    const ccbcList = newFormData?.otherProjectsInAnnouncement;

    const projectNumbers = concatCCBCNumbers(ccbcNumber, ccbcList);

    e.preventDefault();
    createAnnouncement({
      variables: {
        input: {
          jsonData: newFormData,
          projectNumbers,
        },
      },
    });
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
      handleChange={(e) => {
        setNewFormData({ ...e.formData });
      }}
      isFormEditMode={isFormEditMode}
      title="Announcements"
      schema={isFormEditMode ? announcementsSchema : {}}
      uiSchema={isFormEditMode ? announcementsUiSchema : {}}
      theme={ProjectTheme}
      resetFormData={handleResetFormData}
      onSubmit={handleSubmit}
      setIsFormEditMode={(boolean) => setIsFormEditMode(boolean)}
    >
      <ViewAnnouncements />
    </ProjectForm>
  );
};

export default AnnouncementsForm;
