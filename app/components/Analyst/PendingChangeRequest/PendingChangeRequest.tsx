import { graphql, useFragment } from 'react-relay';
import { useCreatePendingChangeRequestMutation } from 'schema/mutations/application/createPendingChangeRequest';
import styled from 'styled-components';
import { useState } from 'react';
import useModal from 'lib/helpers/useModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import * as Sentry from '@sentry/nextjs';
import PendingChangeRequestModal from './PendingChangeRequestModal';
import ClosePendingRequestModal from './ClosePendingRequestModal';

const StyledCheckbox = styled.input`
  transform: scale(1.5);
  transform-origin: left;
  cursor: pointer;
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

  const [isPending, setIsPending] = useState(
    applicationPendingChangeRequestsByApplicationId?.nodes?.[0]?.isPending ||
      false
  );

  const [comment, setComment] = useState(
    isPending
      ? applicationPendingChangeRequestsByApplicationId?.nodes?.[0]?.comment
      : null
  );

  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      pendingChangeRequestModal.open();
    }
  };

  const [createPendingChangeRequest] = useCreatePendingChangeRequestMutation();

  const handleChangePendingRequest = (
    isPendingRequest: boolean,
    reasonForChange: string
  ) => {
    createPendingChangeRequest({
      variables: {
        input: {
          applicationPendingChangeRequest: {
            applicationId: rowId,
            comment: reasonForChange,
            isPending: isPendingRequest,
          },
        },
      },
      onCompleted: () => {
        setIsPending(isPendingRequest);
        setComment(isPendingRequest ? reasonForChange : null);
      },
      onError: (err: any) => {
        Sentry.captureException({
          name: 'Create Pending Change Request Error',
          message: err.message,
        });
      },
    });
  };

  return (
    <>
      <StyledCheckbox
        type="checkbox"
        checked={isPending}
        data-testid="pending-change-request-checkbox"
        onChange={(e) => {
          if (e.target.checked) {
            pendingChangeRequestModal.open();
          } else {
            closePendingRequestModal.open();
          }
        }}
      />
      {isPending && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            setIsUpdateMode(true);
            pendingChangeRequestModal.open();
          }}
          onKeyDown={handleKeyDown}
          aria-labelledby="Comments on pending change request"
          style={{ cursor: 'pointer' }}
          data-testid="pending-change-request-comments"
        >
          <StyledFontAwesomeIcon
            icon={faCommentDots}
            fixedWidth
            size="lg"
            color="#345FA9"
          />
        </div>
      )}
      <PendingChangeRequestModal
        {...pendingChangeRequestModal}
        onSave={(reasonForChange: string) => {
          handleChangePendingRequest(
            !isUpdateMode ? true : isPending,
            reasonForChange
          );
          pendingChangeRequestModal.close();
        }}
        value={isPending ? comment : null}
        onCancel={() => {
          if (!isUpdateMode) handleChangePendingRequest(!isPending, comment);
          setIsUpdateMode(false);
          pendingChangeRequestModal.close();
        }}
      />
      <ClosePendingRequestModal
        {...closePendingRequestModal}
        onSave={(reasonForChange) => {
          handleChangePendingRequest(false, reasonForChange);
          closePendingRequestModal.close();
        }}
        onCancel={() => {
          closePendingRequestModal.close();
        }}
      />
    </>
  );
};

export default PendingChangeRequest;
