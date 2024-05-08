import { useEffect, useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import statusStyles from 'data/statusStyles';
import { useCreateApplicationStatusMutation } from 'schema/mutations/assessment/createApplicationStatus';
import useModal from 'lib/helpers/useModal';
import * as Sentry from '@sentry/nextjs';
import ChangeModal from './ChangeModal';
import ExternalChangeModal from './ExternalChangeModal';

interface DropdownProps {
  statusStyles: {
    primary: string;
    backgroundColor: string;
    pillWidth: string;
  };
}

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

interface Props {
  application: any;
  disabledStatusList?: any;
  isExternalStatus?: boolean;
  hiddenStatusTypes?: any;
  status: string;
  statusList: any;
}

const ChangeStatus: React.FC<Props> = ({
  application,
  disabledStatusList,
  hiddenStatusTypes = [],
  isExternalStatus,
  status,
  statusList,
}) => {
  const queryFragment = useFragment(
    graphql`
      fragment ChangeStatus_query on Application {
        id
        analystStatus
        rowId
        ccbcNumber
        conditionalApprovalDataByApplicationId(
          filter: { archivedAt: { isNull: true } }
          orderBy: CREATED_AT_DESC
          first: 1
        )
          @connection(
            key: "ConditionalApprovalForm_conditionalApprovalDataByApplicationId"
          ) {
          __id
          edges {
            node {
              id
              jsonData
            }
          }
        }
      }
    `,
    application
  );

  const {
    analystStatus,
    conditionalApprovalDataByApplicationId,
    id,
    rowId,
    ccbcNumber,
  } = queryFragment;
  const [createStatus] = useCreateApplicationStatusMutation();
  // Filter unwanted status types
  const statusTypes = statusList.filter(
    (statusType) => !hiddenStatusTypes.includes(statusType.name)
  );

  const conditionalApproval =
    conditionalApprovalDataByApplicationId?.edges[0]?.node;
  const [changeReason, setChangeReason] = useState('');

  const [currentStatus, setCurrentStatus] = useState(
    getStatus(status, statusTypes)
  );
  const [draftStatus, setDraftStatus] = useState(
    getStatus(status, statusTypes)
  );
  const internalChangeModal = useModal();
  const externalChangeModal = useModal();

  const conditionalApprovalData = conditionalApproval?.jsonData;

  // Check conditional approval requirements are met for external status change
  const isAllowedConditionalApproval =
    isExternalStatus &&
    analystStatus === 'conditionally_approved' &&
    conditionalApprovalData?.decision?.ministerDecision === 'Approved' &&
    conditionalApprovalData?.response?.applicantResponse === 'Accepted';

  const disabledStatuses =
    disabledStatusList && disabledStatusList[currentStatus?.name];

  useEffect(() => {
    // update status when there is a relay store update
    setCurrentStatus(getStatus(status, statusTypes));
    setDraftStatus(getStatus(status, statusTypes));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleSave = async (value) => {
    const newStatus = value || draftStatus?.name;
    const withdrawn = isExternalStatus ? 'withdrawn' : 'analyst_withdrawn';
    const externalStatus =
      newStatus === 'withdrawn' ? withdrawn : `applicant_${newStatus}`;
    const internalStatus = newStatus === 'withdrawn' ? withdrawn : newStatus;
    const statusInputName = isExternalStatus ? externalStatus : internalStatus;

    createStatus({
      variables: {
        input: {
          applicationStatus: {
            applicationId: rowId,
            changeReason,
            status: statusInputName,
          },
        },
      },
      onCompleted: () => {
        setChangeReason('');
        setCurrentStatus(draftStatus);
        internalChangeModal.close();
        // Send email notification
        if (newStatus === 'approved' && !isExternalStatus) {
          const commonEmailObject = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              applicationId: rowId,
              host: window.location.origin,
              ccbcNumber,
            }),
          };
          fetch('/api/email/notifyAgreementSigned', commonEmailObject).then(
            (response) => {
              if (!response.ok) {
                Sentry.captureException({
                  name: 'Email sending Agreement Signed Analyst failed',
                  message: response,
                });
              }
              return response.json();
            }
          );

          fetch(
            '/api/email/notifyAgreementSignedDataTeam',
            commonEmailObject
          ).then((responseDataTeam) => {
            if (!responseDataTeam.ok) {
              Sentry.captureException({
                name: 'Email sending Agreement Signed Data Team failed',
                message: responseDataTeam,
              });
            }
          });
        }
      },
      updater: (store) => {
        store
          .get(id)
          .setValue(
            statusInputName,
            isExternalStatus ? 'externalStatus' : 'analystStatus'
          );
      },
    });
  };

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDraftStatus(getStatus(e.target.value, statusTypes));
    const isAllowedExternalReceived =
      e.target.value === 'received' &&
      ['received', 'screening', 'assessment', 'recommendation'].includes(
        analystStatus
      );

    const isAllowedExternalWithdraw =
      e.target.value === 'withdrawn' && analystStatus === 'analyst_withdrawn';
    const isAllowedExternalChange =
      isExternalStatus &&
      (e.target.value === analystStatus ||
        isAllowedExternalReceived ||
        isAllowedExternalWithdraw);
    const isInvalidConditionalApproval =
      e.target.value === 'conditionally_approved' &&
      isAllowedExternalChange &&
      !isAllowedConditionalApproval;

    if (!isExternalStatus) {
      // open modal for internal status change
      internalChangeModal.open();
    } else if (
      // open modal for external status change
      !isAllowedExternalChange ||
      isInvalidConditionalApproval
    ) {
      externalChangeModal.open();
    } else {
      internalChangeModal.open();
    }
  };

  return (
    <>
      {isExternalStatus && (
        <ExternalChangeModal
          {...externalChangeModal}
          applicationId={rowId}
          id="external-change-status-modal"
          isNotAllowedConditionalApproval={
            draftStatus?.name === 'conditionally_approved' &&
            !isAllowedConditionalApproval
          }
          onCancel={() => {
            setDraftStatus(currentStatus);
            externalChangeModal.close();
          }}
        />
      )}
      <ChangeModal
        {...internalChangeModal}
        description={
          <ModalDescription
            currentStatus={currentStatus}
            draftStatus={draftStatus}
          />
        }
        id={
          isExternalStatus
            ? 'change-status-external-modal-reason'
            : 'change-status-modal'
        }
        saveLabel="Save change"
        cancelLabel="Cancel change"
        onSave={handleSave}
        value={changeReason}
        onCancel={() => {
          setDraftStatus(currentStatus);
          internalChangeModal.close();
        }}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setChangeReason(e.target.value)
        }
      />
      <StyledDropdown
        data-testid="change-status"
        onChange={(e) => {
          // eslint-disable-next-line no-void
          void (() => handleChange(e))();
        }} // Use draft status for colour so it changes as user selects it
        statusStyles={statusStyles[draftStatus?.name]}
        value={draftStatus?.name}
        id="change-status"
      >
        {statusTypes?.map((statusType) => {
          const { description, name, id: statusId } = statusType;

          return (
            <StyledOption
              value={name}
              key={statusId}
              disabled={disabledStatuses?.includes(name)}
            >
              {description}
            </StyledOption>
          );
        })}
      </StyledDropdown>
    </>
  );
};

export default ChangeStatus;
