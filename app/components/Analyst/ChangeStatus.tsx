import { useEffect, useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import statusStyles from 'data/statusStyles';
import { useCreateApplicationStatusMutation } from 'schema/mutations/assessment/createApplicationStatus';
import useModal from 'lib/helpers/useModal';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import useApplicationMerge from 'lib/helpers/useApplicationMerge';
import reportClientError from 'lib/helpers/reportClientError';
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
  height: 32px;
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

const StyledMergeProjectRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
`;

const StyledLabel = styled.label`
  white-space: nowrap;
  font-weight: 700;

  strong {
    font-weight: 400;
  }
`;

const StyledMergeAutocomplete = styled(Autocomplete)`
  width: 260px;
`;

const getStatus = (statusName, statusList) => {
  return statusList.find((statusType) => statusType.name === statusName);
};

const ModalDescription = ({
  currentStatus,
  draftStatus,
  mergeParentSelect,
}) => {
  return (
    <>
      <p>
        You are about to change the status from {currentStatus?.description} to{' '}
        {draftStatus?.description}.
      </p>
      {mergeParentSelect}
    </>
  );
};

type ParentApplicationOption = {
  id: number;
  projectNumber: string;
  type: 'CBC' | 'CCBC';
};

interface Props {
  application: any;
  disabledStatusList?: any;
  isExternalStatus?: boolean;
  hiddenStatusTypes?: any;
  status: string;
  statusList: any;
  parentList?: ParentApplicationOption[];
}

const ChangeStatus: React.FC<Props> = ({
  application,
  disabledStatusList,
  hiddenStatusTypes = [],
  isExternalStatus,
  status,
  statusList,
  parentList = [],
}) => {
  const queryFragment = useFragment(
    graphql`
      fragment ChangeStatus_query on Application {
        id
        analystStatus
        rowId
        ccbcNumber
        internalDescription
        applicationProjectTypesByApplicationId(
          orderBy: CREATED_AT_DESC
          first: 1
        ) {
          nodes {
            projectType
          }
        }
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
        applicationMergesByChildApplicationId(
          filter: { archivedAt: { isNull: true } }
          orderBy: CREATED_AT_DESC
          first: 1
        )
          @connection(
            key: "ChangeStatus_applicationMergesByChildApplicationId"
          ) {
          __id
          edges {
            node {
              id
              parentApplicationId
              parentCbcId
              childApplicationId
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
    internalDescription,
    applicationProjectTypesByApplicationId,
    applicationMergesByChildApplicationId,
  } = queryFragment;
  const mergeConnectionIds = applicationMergesByChildApplicationId?.__id
    ? [applicationMergesByChildApplicationId.__id]
    : [];
  const { updateParent } = useApplicationMerge();
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
  const existingParentNode =
    applicationMergesByChildApplicationId?.edges?.[0]?.node;
  const existingParentId =
    existingParentNode?.parentApplicationId ?? existingParentNode?.parentCbcId;
  const [mergeParent, setMergeParent] =
    useState<ParentApplicationOption | null>(null);

  const conditionalApprovalData = conditionalApproval?.jsonData;

  const projectType =
    applicationProjectTypesByApplicationId?.nodes?.[0]?.projectType;

  // Check conditional approval requirements are met for external status change
  const isAllowedConditionalApproval =
    isExternalStatus &&
    analystStatus === 'conditionally_approved' &&
    (conditionalApprovalData?.decision?.ministerDecision === 'Approved' ||
      conditionalApprovalData?.isedDecisionObj?.isedDecision === 'Approved') &&
    conditionalApprovalData?.response?.applicantResponse === 'Accepted';

  const disabledStatuses =
    disabledStatusList && disabledStatusList[currentStatus?.name];

  const requiresMergeParentSelection = draftStatus?.name === 'merged';

  useEffect(() => {
    // update status when there is a relay store update
    setCurrentStatus(getStatus(status, statusTypes));
    setDraftStatus(getStatus(status, statusTypes));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    setMergeParent(
      existingParentId
        ? {
            id: existingParentId,
            projectNumber: existingParentId,
            type: existingParentNode?.parentApplicationId ? 'CCBC' : 'CBC',
          }
        : null
    );
  }, [existingParentId, existingParentNode]);

  const sendEmailNotification = async (
    url: string,
    params: any,
    errorMessage: string
  ) => {
    fetch(`/api/email/${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationId: rowId,
        host: window.location.origin,
        ccbcNumber,
        params,
      }),
    }).then((response) => {
      if (!response.ok) {
        reportClientError(response, {
          source: 'change-status-email',
          metadata: { errorMessage },
        });
      }
      return response.json();
    });
  };

  const handleSave = async (value) => {
    const newStatus = value || draftStatus?.name;
    const withdrawn = isExternalStatus ? 'withdrawn' : 'analyst_withdrawn';
    const externalStatus =
      newStatus === 'withdrawn' ? withdrawn : `applicant_${newStatus}`;
    const internalStatus = newStatus === 'withdrawn' ? withdrawn : newStatus;
    const statusInputName = isExternalStatus ? externalStatus : internalStatus;

    const isLeavingMergedStatus =
      existingParentId &&
      currentStatus?.name === 'merged' &&
      newStatus !== 'merged';
    const isMergedStatus = newStatus === 'merged';
    const shouldUpdateMergeParent =
      requiresMergeParentSelection || isLeavingMergedStatus;
    const updatedParent = isMergedStatus
      ? { ...mergeParent, rowId: mergeParent?.id }
      : null;

    // update the parent relationship
    if (shouldUpdateMergeParent) {
      updateParent(
        existingParentId,
        updatedParent,
        rowId,
        changeReason,
        mergeConnectionIds,
        () => {
          if (!updatedParent?.rowId) setMergeParent(null);
        },
        (error: any) => {
          reportClientError(error, { source: 'change-status-update' });
        }
      );
    }

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
        // Send email notification for status changes
        if (newStatus === 'approved' && !isExternalStatus) {
          sendEmailNotification(
            'notifyAgreementSigned',
            {},
            'Email sending Agreement Signed Analyst failed'
          );
          sendEmailNotification(
            'notifyAgreementSignedDataTeam',
            {},
            'Email sending Agreement Signed Data Team failed'
          );
        }
        if (newStatus === 'conditionally_approved' && !isExternalStatus) {
          const requiredFields = ['Project Description', 'Project Type'].filter(
            (field) => {
              if (field === 'Project Description') return !internalDescription;
              if (field === 'Project Type') return !projectType;
              return false;
            }
          );
          if (requiredFields.length > 0)
            sendEmailNotification(
              'notifyConditionalApproval',
              {
                requiredFields,
              },
              'Email sending Conditionally Approved Analyst failed'
            );
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

  const mergeParentSelect = requiresMergeParentSelection ? (
    <div>
      <div>
        Please select the parent project and provide a reason for this change.
      </div>

      <StyledMergeProjectRow>
        <StyledLabel
          id={`merge-parent-select-label-${rowId}`}
          htmlFor="merge-parent-select"
        >
          Parent Project (optional) :
        </StyledLabel>

        <StyledMergeAutocomplete
          size="small"
          key="merge-parent-autocomplete"
          data-testid="merge-parent-autocomplete"
          options={parentList}
          getOptionLabel={(option: ParentApplicationOption) =>
            option.projectNumber?.toString()
          }
          onChange={(_event, newValue: ParentApplicationOption | null) => {
            setMergeParent(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search by ID"
              size="small"
              inputProps={{
                ...params.inputProps,
                'aria-labelledby': `merge-parent-select-label-${rowId}`,
              }}
            />
          )}
          value={parentList.find((p) => p.id === mergeParent?.id) ?? null}
        />
      </StyledMergeProjectRow>
    </div>
  ) : null;

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
            mergeParentSelect={mergeParentSelect}
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
