import { useRouter } from 'next/router';
import { useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import statusStyles from 'data/statusStyles';
import { useCreateApplicationStatusMutation } from 'schema/mutations/assessment/createApplicationStatus';
import ChangeModal from './ChangeModal';

interface DropdownProps {
  statusStyles: {
    primary: string;
    backgroundColor: string;
    pillWidth: string;
  };
}

const StyledWithdrawn = styled.div`
  border: none;
  border-radius: 16px;
  appearance: none;
  padding: 6px 12px;
  height: 30px;
  margin-bottom: 16px;
  color: #414141;
  background-color: #e8e8e8;
  cursor: default;
`;

const StyledDropdown = styled.select<DropdownProps>`
  color: ${(props) => props.statusStyles?.primary};
  border: none;
  border-radius: 16px;
  appearance: none;
  padding: 6px 12px;
  height: 30px;
  width: ${(props) => props.statusStyles?.pillWidth};
  background: ${(props) => props.statusStyles?.backgroundColor}
    url("data:image/svg+xml;utf8,<svg viewBox='0 0 140 140' width='24' height='24' xmlns='http://www.w3.org/2000/svg'>
    <g><path d='m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z' fill='${(
      props
    ) => props.statusStyles?.primary.replace('#', '%23')}'/></g></svg>")
    no-repeat;
  background-position: right 5px top 5px;

  :focus {
    outline: none;
  }
`;

const StyledOption = styled.option`
  color: ${(props) => props.theme.color.text};
  background-color: ${(props) => props.theme.color.white};
`;

const getStatus = (statusName, statusList) => {
  return statusList.find((statusType) => statusType.name === statusName);
};

const ModalDescription = ({ currentStatus, draftStatus }) => {
  return (
    <>
      <p>
        You are about to change the status from {currentStatus?.description} to{' '}
        {draftStatus?.description}.
      </p>
      <div>Please provide a reason for changing the status. (optional)</div>
    </>
  );
};

const ChangeStatus = ({ query }) => {
  const queryFragment = useFragment(
    graphql`
      fragment ChangeStatus_query on Query {
        applicationByRowId(rowId: $rowId) {
          id
          status
        }
        allApplicationStatusTypes(orderBy: STATUS_ORDER_ASC) {
          nodes {
            name
            description
            id
          }
        }
      }
    `,
    query
  );

  const { allApplicationStatusTypes, applicationByRowId } = queryFragment;
  const { status } = applicationByRowId;
  const router = useRouter();
  const applicationId = Number(router.query.applicationId);
  const [createStatus] = useCreateApplicationStatusMutation();

  const hiddenStatusTypes = ['draft', 'submitted', 'withdrawn'];

  // Filter unwanted status types
  const statusTypes = allApplicationStatusTypes.nodes.filter(
    (statusType) => !hiddenStatusTypes.includes(statusType.name)
  );

  const [changeReason, setChangeReason] = useState('');

  const [currentStatus, setcurrentStatus] = useState(
    getStatus(status, statusTypes)
  );
  const [draftStatus, setDraftStatus] = useState(
    getStatus(status, statusTypes)
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDraftStatus(getStatus(e.target.value, statusTypes));

    // Open modal using anchor tag
    window.location.hash = '#change-status-modal';
  };

  if (status === 'withdrawn') {
    return <StyledWithdrawn>Withdrawn</StyledWithdrawn>;
  }

  const handleSave = async () => {
    createStatus({
      variables: {
        input: {
          applicationStatus: {
            applicationId,
            changeReason,
            status: draftStatus.name,
          },
        },
      },
      onCompleted: () => {
        setChangeReason('');
        setcurrentStatus(draftStatus);
      },
    });
  };

  return (
    <>
      <ChangeModal
        id="change-status-modal"
        saveLabel="Save change"
        cancelLabel="Cancel change"
        onSave={handleSave}
        value={changeReason}
        onCancel={() => setDraftStatus(currentStatus)}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setChangeReason(e.target.value)
        }
        description={
          <ModalDescription
            currentStatus={currentStatus}
            draftStatus={draftStatus}
          />
        }
      />
      <StyledDropdown
        data-testid="change-status"
        onChange={handleChange}
        // Use draft status for colour so it changes as user selects it
        statusStyles={statusStyles[draftStatus?.name]}
        value={draftStatus?.name}
        id="change-status"
      >
        {statusTypes &&
          statusTypes.map((statusType) => {
            const { description, name, id } = statusType;
            return (
              <StyledOption value={name} key={id}>
                {description}
              </StyledOption>
            );
          })}
      </StyledDropdown>
    </>
  );
};

export default ChangeStatus;
