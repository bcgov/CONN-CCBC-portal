import React, { useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import { useCreatePendingChangeRequestMutation } from 'schema/mutations/application/createPendingChangeRequest';
import styled from 'styled-components';
import useModal from 'lib/helpers/useModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { useCreateCbcPendingChangeRequestMutation } from 'schema/mutations/application/createCbcPendingChangeRequest';
import { CreatePendingChangeRequestInput } from '__generated__/createPendingChangeRequestMutation.graphql';
import { CreateCbcPendingChangeRequestInput } from '__generated__/createCbcPendingChangeRequestMutation.graphql';
import reportClientError from 'lib/helpers/reportClientError';
import PendingChangeRequestModal from './PendingChangeRequestModal';
import ClosePendingRequestModal from './ClosePendingRequestModal';

const StyledCheckbox = styled.input`
  transform: scale(1.5);
  transform-origin: left;
  cursor: pointer;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  margin-left: 8px;
`;

const PendingChangeRequest = ({
  application,
  isCbc = false,
  isFormEditable = true,
}) => {
  const fragment = isCbc
    ? graphql`
        fragment PendingChangeRequest_query_cbc on Cbc {
          rowId
          cbcApplicationPendingChangeRequestsByCbcId(
            orderBy: CREATED_AT_DESC
            first: 1
          ) {
            __id
            nodes {
              comment
              isPending
            }
          }
        }
      `
    : graphql`
        fragment PendingChangeRequest_query_application on Application {
          rowId
          applicationPendingChangeRequestsByApplicationId(
            orderBy: CREATED_AT_DESC
            first: 1
          ) {
            __id
            nodes {
              comment
              isPending
            }
          }
        }
      `;

  const queryFragment = useFragment(fragment, application);

  const pendingChangeRequestModal = useModal();
  const closePendingRequestModal = useModal();
  const pendingRequests = isCbc
    ? queryFragment?.cbcApplicationPendingChangeRequestsByCbcId
    : queryFragment?.applicationPendingChangeRequestsByApplicationId;

  const [isPending, setIsPending] = useState(
    pendingRequests?.nodes?.[0]?.isPending || false
  );
  const connectionId = pendingRequests?.__id;
  const [comment, setComment] = useState(
    isPending ? pendingRequests?.nodes?.[0]?.comment : null
  );

  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      pendingChangeRequestModal.open();
    }
  };

  const [createPendingChangeRequest] = useCreatePendingChangeRequestMutation();
  const [createCbcPendingChangeRequest] =
    useCreateCbcPendingChangeRequestMutation();

  const handleChangePendingRequest = (isPendingRequest, reasonForChange) => {
    const createRequest = isCbc
      ? createCbcPendingChangeRequest
      : createPendingChangeRequest;

    const rowParam = isCbc
      ? { _cbcId: queryFragment.rowId }
      : { _applicationId: queryFragment.rowId };

    const input = {
      ...rowParam,
      _isPending: isPendingRequest,
      _comment: reasonForChange,
    };

    createRequest({
      variables: {
        input: input as CreateCbcPendingChangeRequestInput &
          CreatePendingChangeRequestInput,
      },
      updater: (store) => {
        const payload = store.getRootField(
          isCbc ? 'createCbcPendingChangeRequest' : 'createPendingChangeRequest'
        );
        const newEdge = payload.getLinkedRecord(
          isCbc
            ? 'cbcApplicationPendingChangeRequest'
            : 'applicationPendingChangeRequest'
        );
        const connection = store.get(connectionId);
        if (connection) connection.setLinkedRecords([newEdge], 'nodes');
      },
      onCompleted: () => {
        setIsPending(isPendingRequest);
        setComment(isPendingRequest ? reasonForChange : null);
      },
      onError: (err: any) => {
        reportClientError(err, {
          source: 'pending-change-request',
          metadata: { message: err.message },
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
        disabled={!isFormEditable}
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
          setIsUpdateMode(false);
          pendingChangeRequestModal.close();
        }}
        isHeaderEditable={isFormEditable}
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
