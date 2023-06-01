import styled from 'styled-components';
import { DateTime } from 'luxon';
import statusStyles from 'data/statusStyles';
import { useFeature } from '@growthbook/growthbook-react';
import applicationDiffSchema from 'formSchema/uiSchema/history/application';
import applicationGisDataSchema from 'formSchema/uiSchema/history/applicationGisData';
import StatusPill from '../../StatusPill';
import HistoryDetails from './HistoryDetails';
import HistoryAttachment from './HistoryAttachment';

const StyledContent = styled.span`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 8px;

  & span {
    margin: 0 4px;
  }

  & span:first-child {
    margin-left: 0;
  }
`;

const StyledChange = styled.div`
  padding: 8px 16px;
`;

const ChangeReason = ({ reason }) => {
  return (
    <StyledChange>
      <b>Reason for change:</b> {reason}
    </StyledChange>
  );
};

const HistoryContent = ({ historyItem, prevHistoryItem }) => {
  const {
    givenName,
    familyName,
    tableName,
    createdAt,
    item,
    record,
    sessionSub,
    externalAnalyst,
  } = historyItem;

  const showHistoryDetails = useFeature('show_history_details').value;
  const isAnalyst = sessionSub.includes('idir') || externalAnalyst;
  const fullName = `${givenName} ${familyName}`;
  const displayName = isAnalyst ? fullName : 'The applicant';
  const reasonForChange = record.reason_for_change || record.change_reason;
  const createdAtFormatted = DateTime.fromJSDate(
    new Date(createdAt)
  ).toLocaleString(DateTime.DATETIME_MED);

  if (tableName === 'rfi_data') {
    const rfiNumber = record.rfi_number;

    return (
      <StyledContent data-testid="history-content-rfi">
        <span>{displayName} saved</span> <b>RFI-{rfiNumber}</b>
        <span> on {createdAtFormatted}</span>
      </StyledContent>
    );
  }

  if (tableName === 'attachment') {
    return (
      <StyledContent data-testid="history-content-attachment">
        <HistoryAttachment
          displayName={displayName}
          record={record}
          createdAtFormatted={createdAtFormatted}
        />
      </StyledContent>
    );
  }

  if (tableName === 'application_announcement') {
    const operation = historyItem.record?.history_operation;

    return (
      <StyledContent data-testid="history-content-attachment">
        <span>
          {displayName} {operation} an announcement on {createdAtFormatted}
        </span>
      </StyledContent>
    );
  }

  if (tableName === 'application_analyst_lead') {
    // check to see if the lead has been unassigned (results in empty string)
    const leadName = item === '' ? 'Unassigned' : item;
    return (
      <StyledContent data-testid="history-content-analyst-lead">
        <span>
          {displayName} assigned <b>Lead</b> to {leadName} on{' '}
          {createdAtFormatted}
        </span>
      </StyledContent>
    );
  }

  if (tableName === 'application') {
    return (
      <StyledContent data-testid="history-content-application">
        <span>
          The applicant created the <b>Application</b>
        </span>{' '}
        on {createdAtFormatted}
      </StyledContent>
    );
  }

  if (tableName === 'form_data') {
    return (
      <div>
        <StyledContent data-testid="history-content-form-data">
          <span>
            {displayName} edited the <b>Application </b>
          </span>
          on {createdAtFormatted}
        </StyledContent>
        {showHistoryDetails && prevHistoryItem?.record && (
          <HistoryDetails
            json={record.json_data}
            prevJson={prevHistoryItem?.record?.json_data || {}}
            excludedKeys={[
              'id',
              'createdAt',
              'updatedAt',
              'applicationId',
              'acknowledgements',
              'supportingDocuments',
              'coverage',
              'templateUploads',
            ]}
            diffSchema={applicationDiffSchema}
          />
        )}
        {reasonForChange && <ChangeReason reason={reasonForChange} />}
      </div>
    );
  }

  if (tableName === 'application_status') {
    const isReceived = item === 'received';
    return (
      <div>
        <StyledContent data-testid="history-content-status">
          {isReceived ? (
            <span>The application was</span>
          ) : (
            <span>
              {displayName} changed the <b>status</b> to
            </span>
          )}{' '}
          <StatusPill status={item} styles={statusStyles} />{' '}
          <span>on {createdAtFormatted}</span>
        </StyledContent>
        {reasonForChange && <ChangeReason reason={reasonForChange} />}
      </div>
    );
  }

  if (tableName === 'application_package') {
    return (
      <StyledContent data-testid="history-content-package">
        <span>
          {displayName} added the application to a <b>Package</b> on{' '}
          {createdAtFormatted}
        </span>
      </StyledContent>
    );
  }

  if (tableName === 'assessment_data') {
    const assessmentType = historyItem.item;

    const formatAssessment = (assessmentName) => {
      if (assessmentType === 'projectManagement') return 'Project Management';
      if (assessmentType === 'gis') return 'GIS';
      if (assessmentType === 'financialRisk') return 'Financial Risk';
      return assessmentName;
    };

    return (
      <StyledContent data-testid="history-content-assessment">
        <span>{displayName} saved the </span>
        <b>{formatAssessment(assessmentType)} Assessment</b>
        <span> on {createdAtFormatted}</span>
      </StyledContent>
    );
  }

  if (tableName === 'conditional_approval_data') {
    return (
      <StyledContent data-testid="history-content-conditional-approval">
        <span>{displayName} updated the </span>
        <b>Conditional approval</b>
        <span> on {createdAtFormatted}</span>
      </StyledContent>
    );
  }

  if (tableName === 'application_gis_data') {
    return (
      <div>
        <StyledContent data-testid="history-content-form-data">
          <span>
            {displayName}{' '}
            {prevHistoryItem?.record?.json_data ? 'updated' : 'uploaded'} the{' '}
            <b>GIS Analysis </b>
          </span>
          on {createdAtFormatted}
        </StyledContent>
        {showHistoryDetails && (
          <HistoryDetails
            json={record.json_data}
            prevJson={prevHistoryItem?.record?.json_data || {}}
            excludedKeys={['ccbc_number']}
            diffSchema={applicationGisDataSchema}
            overrideParent="gis"
          />
        )}
        {reasonForChange && <ChangeReason reason={reasonForChange} />}
      </div>
    );
  }

  return null;
};
export default HistoryContent;
