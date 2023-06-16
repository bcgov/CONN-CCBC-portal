import styled from 'styled-components';
import { DateTime } from 'luxon';
import statusStyles from 'data/statusStyles';
import { useFeature } from '@growthbook/growthbook-react';
import applicationDiffSchema from 'formSchema/uiSchema/history/application';
import applicationGisDataSchema from 'formSchema/uiSchema/history/applicationGisData';
import rfiDiffSchema from 'formSchema/uiSchema/history/rfi';
import projectInformationSchema from 'formSchema/uiSchema/history/projectInformation';
import StatusPill from '../../StatusPill';
import HistoryDetails from './HistoryDetails';
import HistoryAttachment from './HistoryAttachment';
import HistoryFile from './HistoryFile';

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

const filterArrays = (obj: Record<string, any>): Record<string, any> => {
  const filteredEntries = Object.entries(obj).filter(([, value]) =>
    Array.isArray(value)
  );
  return Object.fromEntries(filteredEntries);
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
    op,
  } = historyItem;

  const showHistoryDetails = useFeature('show_history_details').value;
  const isAnalyst = sessionSub.includes('idir') || externalAnalyst;
  const fullName = `${givenName} ${familyName}`;
  const displayName = isAnalyst ? fullName : 'The applicant';
  const reasonForChange = record.reason_for_change || record.change_reason;
  const createdAtFormatted =
    op === 'UPDATE'
      ? DateTime.fromJSDate(new Date(record.updated_at)).toLocaleString(
          DateTime.DATETIME_MED
        )
      : DateTime.fromJSDate(new Date(createdAt)).toLocaleString(
          DateTime.DATETIME_MED
        );

  if (tableName === 'rfi_data') {
    const rfiNumber = record.rfi_number;
    // remove any booleans from additional files, leave behind arrays
    const additionalFilesArray = filterArrays(
      record.json_data?.rfiAdditionalFiles || {}
    );
    // turn it into only arrays of files
    const additionalFiles = additionalFilesArray
      ? Object.values(additionalFilesArray).reduce(
          (acc: string[], curr: string[]) => acc.concat(curr),
          []
        )
      : [];
    return (
      <StyledContent data-testid="history-content-rfi">
        {op === 'INSERT' ? (
          <>
            <span>{displayName} saved</span> <b>RFI-{rfiNumber}</b>
            <span> on {createdAtFormatted}</span>
          </>
        ) : (
          <>
            <span>{displayName} updated the files on </span>{' '}
            <b>RFI-{rfiNumber}</b>
            <span> on {createdAtFormatted}</span>
          </>
        )}
        {displayName !== 'The applicant' && (
          <>
            <HistoryDetails
              json={record.json_data}
              prevJson={prevHistoryItem?.record?.json_data || {}}
              excludedKeys={[
                'id',
                'createdAt',
                'updatedAt',
                'applicationId',
                'name',
                'size',
                'type',
                'rfiEmailCorrespondance',
              ]}
              diffSchema={rfiDiffSchema}
              overrideParent="rfi"
            />

            <HistoryFile
              filesArray={record.json_data?.rfiEmailCorrespondance || []}
              title="Email files"
            />
          </>
        )}
        {displayName === 'The applicant' && (
          <HistoryFile
            filesArray={additionalFiles || []}
            title="Additional files"
          />
        )}
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

  if (tableName === 'project_information_data') {
    return (
      <StyledContent data-testid="history-content-conditional-approval">
        <span>{displayName} saved the </span>
        <b>Project information</b>
        <span> form on {createdAtFormatted}</span>
        {showHistoryDetails && (
          <>
            <HistoryDetails
              json={record.json_data}
              prevJson={prevHistoryItem?.record?.json_data || {}}
              excludedKeys={[
                'upload',
                'statementOfWorkUpload',
                'finalizedMapUpload',
                'fundingAgreementUpload',
              ]}
              diffSchema={projectInformationSchema}
              overrideParent="projectInformation"
            />
            <HistoryFile
              filesArray={
                record.json_data?.main?.upload?.statementOfWorkUpload || []
              }
              title="Statement of Work Excel"
            />
            <HistoryFile
              filesArray={
                record.json_data?.main?.upload?.fundingAgreementUpload || []
              }
              title="Funding agreement"
              tableTitle={false}
            />
            <HistoryFile
              filesArray={
                record.json_data?.main?.upload?.finalizedMapUpload || []
              }
              title="Finalized map"
              tableTitle={false}
            />
          </>
        )}
      </StyledContent>
    );
  }

  return null;
};
export default HistoryContent;
