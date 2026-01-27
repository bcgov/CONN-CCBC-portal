import { ConnectionHandler, graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import cookie from 'js-cookie';
import { DateTime } from 'luxon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faPen } from '@fortawesome/free-solid-svg-icons';
import { useArchiveIntakeMutation } from 'schema/mutations/admin/archiveIntakeMutation';

interface ContainerProps {
  isCurrentIntake: boolean;
}

const StyledContainer = styled.div<ContainerProps>`
  border-bottom: 1px solid #c4c4c4;
  border-left: ${({ isCurrentIntake }) =>
    isCurrentIntake && '4px solid #3D9B50'};
  padding: 16px;
  margin-bottom: 16px;
`;

const StyledUpper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;

  & h3 {
    margin: 0;
  }

  & button {
    margin-left: 8px;
  }
`;

const StyledDelete = styled.button`
  color: #d8292f;
  cursor: pointer;
  display: flex;
  align-items: center;

  & svg {
    margin-left: 8px;
  }

  &:hover {
    opacity: 0.7;
  }
`;

const StyledEdit = styled.button`
    color: ${({ theme }) => theme.color.links};

    &:hover {
      opacity: 0.7;
    }
  }
`;

const StyledFlex = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;

  & div {
    margin-bottom: 16px;
  }

  & h4 {
    margin-bottom: 4px;
  }

  ${({ theme }) => theme.breakpoint.smallUp} {
    flex-direction: row;

    & :not(:last-child) {
      min-width: 200px;
      margin-right: 64px;
    }

    & div {
      margin-bottom: 0;
    }

    & h4 {
      margin-bottom: 16px;
    }
  }
`;

const StyledLinkFlex = styled.div`
  display: flex;
  flex-direction: column;

  & div {
    margin-bottom: 16px;
  }

  & h4 {
    margin-bottom: 4px;
  }
`;

interface IntakeProps {
  allIntakesConnectionId: string;
  currentIntakeNumber: number;
  intake: any;
  isFormEditMode: boolean;
  onEdit: (intake: any) => void;
  setIsFormEditMode: (isFormEditMode: boolean) => void;
}

const Intake: React.FC<IntakeProps> = ({
  allIntakesConnectionId,
  currentIntakeNumber,
  intake,
  isFormEditMode,
  onEdit,
}) => {
  const queryFragment = useFragment(
    graphql`
      fragment Intake_query on Intake {
        __id
        ccbcIntakeNumber
        description
        closeTimestamp
        openTimestamp
        hiddenCode
        rollingIntake
        zones
        rowId
      }
    `,
    intake
  );

  const {
    ccbcIntakeNumber,
    closeTimestamp,
    description,
    hiddenCode,
    openTimestamp,
    zones,
  } = queryFragment;

  const [archiveIntake] = useArchiveIntakeMutation();

  const formattedOpenDate = DateTime.fromISO(openTimestamp).toLocaleString(
    DateTime.DATETIME_FULL
  );

  const formattedCloseDate = DateTime.fromISO(closeTimestamp).toLocaleString(
    DateTime.DATETIME_FULL
  );
  const displayCloseDate = DateTime.fromISO(closeTimestamp)
    .minus({ minutes: 30 })
    .toLocaleString(DateTime.DATETIME_FULL);

  const mockedDateCookie = cookie.get('mocks.mocked_date');
  const currentDateTime = mockedDateCookie
    ? DateTime.fromJSDate(new Date(Date.parse(mockedDateCookie)))
    : DateTime.now();

  const startDateTime = DateTime.fromISO(openTimestamp);
  const endDateTime = DateTime.fromISO(closeTimestamp);
  const isAllowedDelete = currentDateTime <= startDateTime;
  const isAllowedEdit = currentDateTime <= endDateTime;
  const hiddenIntakeLink =
    origin && hiddenCode
      ? `${window.location.origin}/api/intake?code=${hiddenCode}`
      : null;

  const handleDelete = () => {
    archiveIntake({
      variables: {
        input: {
          intakeNumber: ccbcIntakeNumber,
        },
      },
      updater: (store) => {
        const connection = store.get(allIntakesConnectionId);
        const intakeConnectionId = queryFragment.__id;
        store.delete(intakeConnectionId);
        ConnectionHandler.deleteNode(connection, intakeConnectionId);
      },
    });
  };

  return (
    <StyledContainer
      data-testid="intake-container"
      isCurrentIntake={currentIntakeNumber === ccbcIntakeNumber}
    >
      <StyledUpper>
        <h3>
          Intake {ccbcIntakeNumber}
          {!isFormEditMode && isAllowedEdit && (
            <StyledEdit onClick={onEdit} data-testid="edit-intake">
              <FontAwesomeIcon icon={faPen} />
            </StyledEdit>
          )}
        </h3>

        {isAllowedDelete && (
          <StyledDelete onClick={handleDelete}>
            Delete
            <FontAwesomeIcon icon={faClose} />
          </StyledDelete>
        )}
      </StyledUpper>
      <StyledFlex>
        <div>
          <h4>Start date & time</h4>
          <span>{formattedOpenDate}</span>
        </div>
        <div>
          <h4>Actual end date and time</h4>
          <span>{formattedCloseDate}</span>
        </div>
        <div>
          <h4>Display end date and time</h4>
          <span>{displayCloseDate}</span>
        </div>
        {description && (
          <div>
            <h4>Description</h4>
            <span>{description}</span>
          </div>
        )}
        {zones && (
          <div>
            <h4>Zones</h4>
            <span>{zones.length ? zones.join(', ') : 'None'}</span>
          </div>
        )}
      </StyledFlex>
      {!isFormEditMode && hiddenIntakeLink && (
        <StyledLinkFlex>
          <div>
            <h4>Applicant access link</h4>
            <em>{hiddenIntakeLink}</em>
          </div>
        </StyledLinkFlex>
      )}
    </StyledContainer>
  );
};

export default Intake;
