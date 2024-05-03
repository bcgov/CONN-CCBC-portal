import { graphql, useFragment } from 'react-relay';
import { useCreatePendingChangeRequestMutation } from 'schema/mutations/application/createPendingChangeRequest';
import styled from 'styled-components';
import { useState } from 'react';
import useModal from 'lib/helpers/useModal';
import PendingChangeRequestModal from './PendingChangeRequestModal';

const StyledCheckbox = styled.input`
  transform: scale(1.5);
  transform-origin: left;
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
  const { applicationPendingChangeRequestsByApplicationId, rowId } =
    queryFragment;

  const [comment, setComment] = useState(
    applicationPendingChangeRequestsByApplicationId?.nodes?.[0]?.comment || ''
  );

  const [isPending, setIsPending] = useState(
    applicationPendingChangeRequestsByApplicationId?.nodes?.[0]?.isPending ||
      false
  );

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
        onChange={() => pendingChangeRequestModal.open()}
      />
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
    </>
  );
};

export default PendingChangeRequest;
