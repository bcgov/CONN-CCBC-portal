import { graphql, useFragment } from 'react-relay';
import { useCreatePendingChangeRequestMutation } from 'schema/mutations/application/createPendingChangeRequest';
import styled from 'styled-components';
import { useState } from 'react';
import useModal from 'lib/helpers/useModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import PendingChangeRequestModal from './PendingChangeRequestModal';
import ClosePendingRequestModal from './ClosePendingRequestModal';

const StyledCheckbox = styled.input`
  transform: scale(1.5);
  transform-origin: left;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  margin-left: 8px; ;
`;

const PendingChangeRequest = ({ application }) => {
  const queryFragment = useFragment(
    graphql`
      fragment PendingChangeRequest_query on Application {
        rowId
        applicationPendingChangeRequestsByApplicationId(
          orderBy: CREATED_AT_DESC
          first: 1
        ) {
          nodes {
            comment
            isPending
          }
        }
      }
    `,
    application
  );

  const pendingChangeRequestModal = useModal();
  const closePendingRequestModal = useModal();
  const { applicationPendingChangeRequestsByApplicationId, rowId } =
    queryFragment;

  const [comment, setComment] = useState(
    applicationPendingChangeRequestsByApplicationId?.nodes?.[0]?.comment || ''
  );

  const [isPending, setIsPending] = useState(
    applicationPendingChangeRequestsByApplicationId?.nodes?.[0]?.isPending ||
      false
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      pendingChangeRequestModal.open();
    }
  };

  const [createPendingChangeRequest] = useCreatePendingChangeRequestMutation();

  const handleChangePendingRequest = () => {
    createPendingChangeRequest({
      variables: {
        input: {
          applicationPendingChangeRequest: {
            applicationId: rowId,
            comment,
            isPending: !isPending,
          },
        },
      },
      onCompleted: () => {
        setIsPending(!isPending);
        pendingChangeRequestModal.close();
      },
    });
  };

  return (
    <>
      <StyledCheckbox
        type="checkbox"
        checked={isPending}
        onChange={(e) => {
          if (e.target.checked) {
            pendingChangeRequestModal.open();
          } else {
            closePendingRequestModal.open();
          }
        }}
      />
      <div
        role="button"
        tabIndex={0}
        onClick={pendingChangeRequestModal.open}
        onKeyDown={handleKeyDown}
        aria-labelledby="Description of Statuses and Triggers"
        style={{ cursor: 'pointer' }}
        data-testid="status-information-icon"
      >
        <StyledFontAwesomeIcon
          icon={faCommentDots}
          fixedWidth
          size="lg"
          color="#345FA9"
        />
      </div>
      <PendingChangeRequestModal
        {...pendingChangeRequestModal}
        onSave={handleChangePendingRequest}
        value={comment}
        onCancel={() => {
          pendingChangeRequestModal.close();
        }}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setComment(e.target.value)
        }
      />
      <ClosePendingRequestModal
        {...closePendingRequestModal}
        onSave={handleChangePendingRequest}
        value={comment}
        onCancel={() => {
          closePendingRequestModal.close();
        }}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setComment(e.target.value)
        }
      />
    </>
  );
};

export default PendingChangeRequest;
