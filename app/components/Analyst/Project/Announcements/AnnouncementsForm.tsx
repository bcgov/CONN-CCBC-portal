import React, { useMemo, useRef, useState, ReactNode } from 'react';
import { ConnectionHandler, graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import { AddButton, ProjectForm } from 'components/Analyst/Project';
import validator from 'validator';
import ViewAnnouncements from 'components/Analyst/Project/Announcements/ViewAnnouncements';
import announcementsSchema from 'formSchema/analyst/announcements';
import announcementsUiSchema from 'formSchema/uiSchema/analyst/announcementsUiSchema';
import { useCreateAnnouncementMutation } from 'schema/mutations/project/createAnnouncement';
import { useUpdateAnnouncementMutation } from 'schema/mutations/project/updateAnnouncement';
import Link from 'next/link';
import Toast from 'components/Toast';
import { Tooltip } from 'components';
import Ajv8Validator from '@rjsf/validator-ajv8';
import { useCreateApplicationAnnouncedMutation } from 'schema/mutations/application/createApplicationAnnounced';
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

const StyledCheckbox = styled.input`
  transform: scale(1.5);
  transform-origin: left;
  cursor: pointer;
  margin-right: ${(props) => props.theme.spacing.medium};
  margin-bottom: ${(props) => props.theme.spacing.large};
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

interface Props {
  query: any;
  isExpanded?: boolean;
}

const AnnouncementsForm: React.FC<Props> = ({ query, isExpanded }) => {
  const queryFragment = useFragment(
    graphql`
      fragment AnnouncementsForm_query on Query {
        applicationByRowId(rowId: $rowId) {
          id
          rowId
          ccbcNumber
          announced
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
    applicationByRowId: { id, announcements, ccbcNumber, rowId, announced },
  } = queryFragment;

  const [createApplicationAnnouncedRecord] =
    useCreateApplicationAnnouncedMutation();

  const announcementsList = announcements.edges.map((announcement) => {
    return announcement.node;
  });

  const [formData, setFormData] = useState({} as any);
  const [isFormEditMode, setIsFormEditMode] = useState(false);
  const [announcementData, setAnnouncementData] = useState({} as any);
  const [updatedCcbcItems, setUpdatedCcbcItems] = useState<null | ReactNode>(
    null
  );
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);

  const [createAnnouncement] = useCreateAnnouncementMutation();
  const [updateAnnouncement] = useUpdateAnnouncementMutation();
  const hiddenSubmitRef = useRef<HTMLButtonElement>(null);

  const isErrors = useMemo(() => {
    const formErrors = Ajv8Validator.validateFormData(
      formData,
      announcementsSchema
    )?.errors;
    const filteredErrors = formErrors?.filter((error) => {
      return error.message !== 'must be string';
    });
    const isFormValid = filteredErrors.length <= 0;
    const url = formData?.announcementUrl;
    const isUrlValid = url && validator.isURL(url);
    return !isUrlValid || !isFormValid;
  }, [formData]);

  const handleResetFormData = () => {
    setIsFormEditMode(false);
    setFormData({});
    setIsSubmitAttempted(false);
    setAnnouncementData(null);
  };

  const removeSelfReference = (ccbcList: Array<any>) => {
    return ccbcList?.filter((ccbcId) => ccbcId.ccbcNumber !== ccbcNumber);
  };

  const handleSubmit = () => {
    setIsSubmitAttempted(true);
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

  const handleAnnouncedByChange = (event) => {
    const value = event.target.checked;
    createApplicationAnnouncedRecord({
      variables: {
        input: {
          _applicationId: rowId,
          isAnnounced: value,
        },
      },
      updater: (store) => {
        const applicationRecord = store.get(id);
        applicationRecord.setValue(value, 'announced');
      },
    });
  };

  // Filter out this application CCBC ID
  const ccbcIdList = queryFragment.allApplications.nodes;

  return (
    <StyledProjectForm
      key={rowId}
      before={
        <>
          <StyledCheckbox
            type="checkbox"
            checked={announced}
            data-testid="announced-checkbox"
            onChange={handleAnnouncedByChange}
          />
          Announced by BC/ISED
          <AddButton
            isFormEditMode={isFormEditMode}
            onClick={() => {
              setIsFormEditMode(true);
              setIsSubmitAttempted(false);
            }}
            title="Add announcement"
          />
        </>
      }
      additionalContext={{ ccbcIdList, ccbcNumber, rowId }}
      formData={formData}
      handleChange={(e) => {
        setFormData({ ...e.formData });
      }}
      hiddenSubmitRef={hiddenSubmitRef}
      formAnimationHeight={400}
      isExpanded={isExpanded}
      isFormAnimated
      isFormEditMode={isFormEditMode}
      liveValidate={isSubmitAttempted && isFormEditMode}
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
