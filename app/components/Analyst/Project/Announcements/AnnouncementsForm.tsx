import React, { useMemo, useRef, useState, ReactNode } from 'react';
import { ConnectionHandler, graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import { AddButton, ProjectForm } from 'components/Analyst/Project';
// import validateFormData from '@rjsf/core/dist/cjs/validate';
import validator from 'validator';
import ViewAnnouncements from 'components/Analyst/Project/Announcements/ViewAnnouncements';
import announcementsSchema from 'formSchema/analyst/announcements';
import announcementsUiSchema from 'formSchema/uiSchema/analyst/announcementsUiSchema';
import { useCreateAnnouncementMutation } from 'schema/mutations/project/createAnnouncement';
import { useUpdateAnnouncementMutation } from 'schema/mutations/project/updateAnnouncement';
import Link from 'next/link';
import Toast from 'components/Toast';
import { Tooltip } from 'components';
import ProjectTheme from '../ProjectTheme';

interface EditProps {
  isFormEditMode: boolean;
  overflow?: string;
  onClick?: () => void;
}

const StyledProjectForm = styled(ProjectForm)<EditProps>`
  .pg-card-content {
    min-height: 0;
  }
`;

const StyledLink = styled(Link)`
  color: #ffffff;
`;

export const updateStoreAfterMutation = (
  store,
  relayConnectionId,
  announcementData
) => {
  const newAnnouncement = store
    .getRootField('updateAnnouncement')
    .getLinkedRecord('announcement');

  // Get the connection from the store
  const connection = store.get(relayConnectionId);

  // Remove the old announcement from the connection
  ConnectionHandler.deleteNode(connection, announcementData.id);

  // Insert the new announcement at the beginning of the connection
  const edge = ConnectionHandler.createEdge(
    store,
    connection,
    newAnnouncement,
    'AnnouncementEdge'
  );
  ConnectionHandler.insertEdgeBefore(connection, edge);
};

export const updateStoreAfterDelete = (
  store,
  relayConnectionId,
  announcementData
) => {
  // Get the connection from the store
  const connection = store.get(relayConnectionId);

  store.delete(announcementData.id);

  // Remove the old announcement from the connection
  ConnectionHandler.deleteNode(connection, announcementData.id);
};

export const toastContent = (ccbcIds: Array<any>) => {
  if (!ccbcIds || ccbcIds.length === 0) {
    return 'Announcement successfully added';
  }

  const firstThreeCcbcIds = ccbcIds.slice(0, 3);
  const addComma = (index: number, array: Array<any>) => {
    if (index < array.length - 1) {
      return ', ';
    }
    return '';
  };
  const linkBuilder = (ccbcId: any, index: number, array: Array<any>) => (
    <>
      <Tooltip message="Opens a new tab">
        <StyledLink
          key={ccbcId.ccbcNumber}
          href={`/analyst/application/${ccbcId.rowId}/project`}
          target="_blank"
        >
          {ccbcId.ccbcNumber}
        </StyledLink>
      </Tooltip>
      {addComma(index, array)}
    </>
  );

  if (ccbcIds.length < 3) {
    return <>Announcement successfully added to {ccbcIds.map(linkBuilder)} </>;
  }
  return (
    <>
      Announcement successfully added to {firstThreeCcbcIds.map(linkBuilder)}{' '}
      and more
    </>
  );
};

const AnnouncementsForm = ({ query }) => {
  const queryFragment = useFragment(
    graphql`
      fragment AnnouncementsForm_query on Query {
        applicationByRowId(rowId: $rowId) {
          rowId
          ccbcNumber
          announcements(first: 1000)
            @connection(key: "AnnouncementsForm_announcements") {
            __id
            edges {
              node {
                id
                rowId
                jsonData
                ccbcNumbers
              }
            }
          }
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
    applicationByRowId: { announcements, ccbcNumber, rowId },
  } = queryFragment;

  const announcementsList = announcements.edges.map((announcement) => {
    return announcement.node;
  });

  const [formData, setFormData] = useState({} as any);
  const [isFormEditMode, setIsFormEditMode] = useState(false);
  const [announcementData, setAnnouncementData] = useState({} as any);
  const [updatedCcbcItems, setUpdatedCcbcItems] = useState<null | ReactNode>(
    null
  );

  const [createAnnouncement] = useCreateAnnouncementMutation();
  const [updateAnnouncement] = useUpdateAnnouncementMutation();
  const hiddenSubmitRef = useRef<HTMLButtonElement>(null);

  const isErrors = useMemo(() => {
    // const formErrors = validateFormData(formData, announcementsSchema)?.errors;
    const formErrors = [];
    const filteredErrors = formErrors?.filter((error) => {
      return error.message !== 'should be string';
    });
    const isFormValid = filteredErrors.length <= 0;
    const url = formData?.announcementUrl;
    const isUrlValid = url && validator.isURL(url);
    return !isUrlValid || !isFormValid;
  }, [formData]);

  const handleResetFormData = () => {
    setIsFormEditMode(false);
    setFormData({});
    setAnnouncementData(null);
  };

  const removeSelfReference = (ccbcList: Array<any>) => {
    return ccbcList?.filter((ccbcId) => ccbcId.ccbcNumber !== ccbcNumber);
  };

  const handleSubmit = () => {
    setUpdatedCcbcItems(null);
    hiddenSubmitRef.current.click();
    const ccbcList = formData?.otherProjectsInAnnouncement;

    /*   const projectNumbers = concatCCBCNumbers(ccbcNumber, ccbcList); */
    const projectNumbers =
      ccbcList?.map((project) => project.ccbcNumber).join(',') || ccbcNumber;

    /* eslint-disable no-underscore-dangle */
    const relayConnectionId = announcements.__id;
    if (isErrors) return;
    if (!announcementData?.rowId) {
      createAnnouncement({
        variables: {
          connections: [relayConnectionId],
          input: {
            jsonData: formData,
            projectNumbers,
          },
        },
        onCompleted: (response) => {
          handleResetFormData();
          const ccbcItems =
            response.createAnnouncement.announcementEdge.node.jsonData
              .otherProjectsInAnnouncement;
          setUpdatedCcbcItems(toastContent(removeSelfReference(ccbcItems)));
        },
      });
    } else {
      updateAnnouncement({
        variables: {
          input: {
            jsonData: formData,
            projectNumbers,
            oldRowId: announcementData.rowId,
          },
        },
        onCompleted: (response) => {
          handleResetFormData();
          const ccbcItems =
            response.updateAnnouncement.announcement.jsonData
              .otherProjectsInAnnouncement;
          setUpdatedCcbcItems(toastContent(removeSelfReference(ccbcItems)));
        },
        updater: (store) => {
          updateStoreAfterMutation(store, relayConnectionId, announcementData);
        },
      });
    }
  };

  const handleReloadData = (store, deletedAnnouncementData) => {
    handleResetFormData();
    /* eslint-disable no-underscore-dangle */
    const relayConnectionId = announcements.__id;
    updateStoreAfterDelete(store, relayConnectionId, deletedAnnouncementData);
  };

  // Filter out this application CCBC ID
  const ccbcIdList = queryFragment.allApplications.nodes;

  return (
    <StyledProjectForm
      before={
        <AddButton
          isFormEditMode={isFormEditMode}
          onClick={() => setIsFormEditMode(true)}
          title="Add announcement"
        />
      }
      additionalContext={{ ccbcIdList, ccbcNumber, rowId }}
      formData={formData}
      handleChange={(e) => {
        setFormData({ ...e.formData });
      }}
      hiddenSubmitRef={hiddenSubmitRef}
      formAnimationHeight={400}
      isFormAnimated
      isFormEditMode={isFormEditMode}
      showEditBtn={false}
      title="Announcements"
      schema={announcementsSchema}
      uiSchema={announcementsUiSchema}
      theme={ProjectTheme}
      resetFormData={handleResetFormData}
      onSubmit={handleSubmit}
      setIsFormEditMode={(boolean) => setIsFormEditMode(boolean)}
      saveDataTestId="save-announcement"
    >
      <ViewAnnouncements
        resetFormData={handleReloadData}
        ccbcNumber={ccbcNumber}
        announcements={announcementsList}
        isFormEditMode={isFormEditMode}
        setAnnouncementData={setAnnouncementData}
        setFormData={setFormData}
        setIsFormEditMode={setIsFormEditMode}
        style={{
          zIndex: isFormEditMode ? -1 : 1,
        }}
      />
      {updatedCcbcItems && (
        <Toast timeout={100000000}>{updatedCcbcItems}</Toast>
      )}
    </StyledProjectForm>
  );
};

export default AnnouncementsForm;
