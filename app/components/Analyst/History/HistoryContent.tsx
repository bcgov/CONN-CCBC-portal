import styled from 'styled-components';
import { DateTime } from 'luxon';
import statusStyles from 'data/statusStyles';
import { useFeature } from '@growthbook/growthbook-react';
import rfiDiffSchema from 'formSchema/uiSchema/history/rfi';
import { diff } from 'json-diff';
import { processArrayDiff } from 'components/DiffTable';
import communities from 'formSchema/uiSchema/history/communities';
import { getTableConfig } from 'utils/historyTableConfig';
import { getFiscalQuarter, getFiscalYear } from 'utils/fiscalFormat';
import StatusPill from '../../StatusPill';
import HistoryDetails from './HistoryDetails';
import HistoryAttachment from './HistoryAttachment';
import HistoryFile from './HistoryFile';
import CommunitiesHistoryTable from './CommunitiesHistoryTable';
import HistoryRfiFile from './HistoryRfiFile';
import HistoryAnnouncementCard from './HistoryAnnouncementCard';

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

const StyledAnnouncementLabel = styled.div`
  font-weight: bold;
  font-size: 16px;
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

const processCommunity = (values) => {
  return values?.map((community) => ({
    economic_region: community.er,
    regional_district: community.rd,
  }));
};

const HistoryContent = ({
  historyItem,
  prevHistoryItem,
  originalOrganizationName,
  originalProjectTitle,
  recordWithOrgChange,
  recordWithTitleChange,
  announcements,
}) => {
  const {
    givenName,
    familyName,
    tableName,
    createdAt,
    createdBy,
    item,
    record,
    applicationId,
    sessionSub,
    externalAnalyst,
    op,
    mergeChildren,
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
    // do the same for previous history item
    const prevAdditionalFilesArray = filterArrays(
      prevHistoryItem?.record?.json_data?.rfiAdditionalFiles || {}
    );
    const prevAdditionalFiles = prevAdditionalFilesArray
      ? Object.values(prevAdditionalFilesArray).reduce(
          (acc: string[], curr: string[]) => acc.concat(curr),
          []
        )
      : [];
    // compute diff
    const emailFilesDiff = diff(
      record?.json_data?.rfiEmailCorrespondance || [],
      prevHistoryItem?.record?.json_data?.rfiEmailCorrespondance || []
    );
    const additionalFilesDiff = diff(additionalFiles, prevAdditionalFiles);
    // turn into truthy/falsy values
    const showEmailFiles = !!emailFilesDiff;
    const showAdditionalFiles = !!additionalFilesDiff;
    return (
      <>
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
        </StyledContent>
        {displayName !== 'The applicant' && (
          <>
            <HistoryDetails
              json={record?.json_data || {}}
              prevJson={prevHistoryItem?.record?.json_data || {}}
              excludedKeys={getTableConfig('rfi_data')?.excludedKeys || []}
              diffSchema={getTableConfig('rfi_data')?.schema}
              overrideParent={getTableConfig('rfi_data')?.overrideParent}
            />
            {/* Email files can be an update or insert, but will never occur at the same time as additional files */}
            {showEmailFiles && !showAdditionalFiles && (
              <HistoryFile
                filesArray={record.json_data?.rfiEmailCorrespondance || []}
                previousFileArray={
                  prevHistoryItem?.record?.json_data?.rfiEmailCorrespondance ||
                  []
                }
                title="Email files"
              />
            )}
            {showAdditionalFiles && (
              <HistoryRfiFile
                filesArray={additionalFilesArray || []}
                previousFileArray={prevAdditionalFilesArray || []}
                diffSchema={rfiDiffSchema}
              />
            )}
          </>
        )}
        {displayName === 'The applicant' && (
          <HistoryRfiFile
            filesArray={additionalFilesArray || []}
            previousFileArray={prevAdditionalFilesArray || []}
            diffSchema={rfiDiffSchema}
          />
        )}
      </>
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
    const announcementId = historyItem.record?.announcement_id;
    const previousAnnouncementId = prevHistoryItem?.record?.announcement_id;
    const announcement = announcements?.get?.(String(announcementId));
    const previousAnnouncement = announcements?.get?.(
      String(previousAnnouncementId)
    );
    const isDeleted = operation === 'deleted';
    const isUpdated = operation === 'updated';

    return (
      <StyledContent data-testid="history-content-announcement">
        <span>
          {displayName} {operation} an announcement on {createdAtFormatted}
        </span>
        {showHistoryDetails && (
          <div>
            {isUpdated && (
              <StyledAnnouncementLabel>New</StyledAnnouncementLabel>
            )}
            <HistoryAnnouncementCard
              announcement={announcement}
              applicationId={record.application_id}
              isStriked={isDeleted}
            />
            {isUpdated && (
              <>
                <StyledAnnouncementLabel>Old</StyledAnnouncementLabel>
                <HistoryAnnouncementCard
                  announcement={previousAnnouncement}
                  applicationId={record.application_id}
                  isStriked
                />
              </>
            )}
          </div>
        )}
      </StyledContent>
    );
  }

  if (tableName === 'application_announced') {
    return (
      <StyledContent data-testid="history-content-announced">
        <span>
          {displayName} updated <b>Announcement info</b> on {createdAtFormatted}
        </span>
        {showHistoryDetails && (
          <HistoryDetails
            json={record}
            prevJson={prevHistoryItem?.record || {}}
            excludedKeys={
              getTableConfig('application_announced')?.excludedKeys || []
            }
            diffSchema={getTableConfig('application_announced')?.schema}
            overrideParent={
              getTableConfig('application_announced')?.overrideParent
            }
          />
        )}
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

  if (tableName === 'application_project_type') {
    const projectType = record?.project_type || null;
    const previousProjectType = prevHistoryItem?.record?.project_type || null;
    let projectTypeTitle = 'Unassigned';
    if (projectType) {
      if (projectType === 'lastMile') {
        projectTypeTitle = 'Last Mile';
      } else if (projectType === 'transport') {
        projectTypeTitle = 'Transport';
      } else {
        projectTypeTitle = 'Last Mile & Transport';
      }
    }
    let previousProjectTypeTitle = 'Unassigned';
    if (previousProjectType) {
      if (previousProjectType === 'lastMile') {
        previousProjectTypeTitle = 'Last Mile';
      } else if (previousProjectType === 'transport') {
        previousProjectTypeTitle = 'Transport';
      } else {
        previousProjectTypeTitle = 'Last Mile & Transport';
      }
    }
    const change = previousProjectType === null ? 'set' : 'changed';
    return (
      <StyledContent data-testid="history-application_project_type">
        <span>
          {displayName} {change} <b>Project Type</b> to {projectTypeTitle}{' '}
          {previousProjectType && ` from ${previousProjectTypeTitle}`} on{' '}
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
    const prevJson = prevHistoryItem?.record?.json_data || {};
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
            prevJson={prevJson}
            excludedKeys={getTableConfig('form_data')?.excludedKeys || []}
            diffSchema={getTableConfig('form_data')?.schema}
          />
        )}
        {reasonForChange && <ChangeReason reason={reasonForChange} />}
      </div>
    );
  }

  if (tableName === 'application_status') {
    const isReceived = item === 'received';
    const isExternal = item.includes('applicant_') || item === 'withdrawn';
    return (
      <div>
        <StyledContent data-testid="history-content-status">
          {isReceived ? (
            <span>The application was</span>
          ) : (
            <span>
              {displayName} changed the{' '}
              <b>{isExternal ? 'External ' : 'Internal '}status</b> to
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
    const newPackage = record?.package ?? 'Unassigned';
    const previousPackage = prevHistoryItem?.record?.package ?? null;

    let change = 'updated';
    if (newPackage === 'Unassigned') {
      change = 'removed';
    } else if (previousPackage === null) {
      change = 'assigned';
    }

    return (
      <StyledContent data-testid="history-content-package">
        <span>
          {displayName} {change} the application{' '}
          {change === 'assigned' ? 'to' : 'from'}{' '}
          <b>Package {previousPackage}</b> {change !== 'assigned' && 'to'}{' '}
          <b>{newPackage}</b> on {createdAtFormatted}
        </span>
      </StyledContent>
    );
  }

  if (tableName === 'application_merge') {
    const user =
      createdBy === 1 && op === 'INSERT' ? 'The system' : displayName;
    const parentId =
      historyItem?.record?.parent_application_id ??
      historyItem?.record?.parent_cbc_id;

    const childCcbcNumber = historyItem?.record?.child_ccbc_number;
    const isParentHistory = applicationId === parentId;

    const mergeTableConfig = getTableConfig('application_merge');
    const mergeChildrenConfig = getTableConfig('application_merge_children');

    const mergeRecord = {
      ...historyItem?.record,
      parent_application:
        historyItem?.record?.parent_ccbc_number ??
        historyItem?.record?.parent_cbc_project_number ??
        null,
    };

    const mergePrevRecord = {
      ...(prevHistoryItem?.record ?? {}),
      parent_application:
        prevHistoryItem?.record?.parent_ccbc_number ??
        prevHistoryItem?.record?.parent_cbc_project_number ??
        null,
    };

    const excludedKeys = isParentHistory
      ? [
          ...mergeTableConfig.excludedKeys,
          'parent_ccbc_number',
          'parent_application',
          'parent_cbc_number',
          'parent_cbc_project_number',
        ]
      : [
          ...mergeTableConfig.excludedKeys,
          'child_ccbc_numbers',
          'child_ccbc_number',
          'parent_ccbc_number',
          'parent_cbc_project_number',
        ];

    const isDeletedChild = isParentHistory && record.archived_at;
    const oldChildren = mergeChildren?.before ?? [];
    const newChildren = mergeChildren?.after ?? [];

    return (
      <>
        {isParentHistory ? (
          <StyledContent data-testid="history-content-parent-merge">
            <span>
              {user} {isDeletedChild ? 'deleted' : 'added'} a child application
              <b> {childCcbcNumber}</b> on {createdAtFormatted}
            </span>
          </StyledContent>
        ) : (
          <StyledContent data-testid="history-content-child-merge">
            <span>
              {user} updated the <b>Parent Application</b> on{' '}
              {createdAtFormatted}
            </span>
          </StyledContent>
        )}
        {isParentHistory && mergeChildren && (
          <HistoryDetails
            json={{ children: newChildren.join(', ') || 'N/A' }}
            prevJson={{ children: oldChildren.join(', ') || 'N/A' }}
            excludedKeys={mergeChildrenConfig?.excludedKeys ?? []}
            diffSchema={mergeChildrenConfig?.schema}
            overrideParent={mergeChildrenConfig?.overrideParent}
          />
        )}
        {!isParentHistory && (
          <HistoryDetails
            json={mergeRecord}
            prevJson={mergePrevRecord}
            excludedKeys={excludedKeys}
            diffSchema={mergeTableConfig?.schema}
            overrideParent={mergeTableConfig?.overrideParent}
          />
        )}
        {reasonForChange && <ChangeReason reason={reasonForChange} />}
      </>
    );
  }

  if (tableName === 'application_dependencies') {
    const user =
      createdBy === 1 && op === 'INSERT' ? 'The system' : displayName;
    return (
      <>
        <StyledContent data-testid="history-content-dependencies">
          <span>
            {user} updated the <b>Technical Assessment</b> on{' '}
            {createdAtFormatted}
          </span>
        </StyledContent>
        <HistoryDetails
          json={record.json_data}
          prevJson={prevHistoryItem?.record?.json_data || {}}
          excludedKeys={
            getTableConfig('application_dependencies')?.excludedKeys || []
          }
          diffSchema={getTableConfig('application_dependencies')?.schema}
          overrideParent={
            getTableConfig('application_dependencies')?.overrideParent
          }
        />
        {reasonForChange && <ChangeReason reason={reasonForChange} />}
      </>
    );
  }

  if (tableName === 'application_internal_notes') {
    const changeReason = record?.change_reason;
    return (
      <div>
        <StyledContent data-testid="history-content-internal-notes">
          <span>
            {displayName} updated <b>Internal Notes</b> on {createdAtFormatted}
          </span>
        </StyledContent>
        {showHistoryDetails && (
          <HistoryDetails
            json={record}
            prevJson={prevHistoryItem?.record || {}}
            excludedKeys={
              getTableConfig('application_internal_notes')?.excludedKeys || []
            }
            diffSchema={getTableConfig('application_internal_notes')?.schema}
            overrideParent={
              getTableConfig('application_internal_notes')?.overrideParent
            }
          />
        )}
        {changeReason && <ChangeReason reason={changeReason} />}
      </div>
    );
  }

  if (tableName === 'assessment_data') {
    const assessmentType = historyItem.item;
    const user =
      createdBy === 1 && op === 'INSERT' ? 'The system' : displayName;
    const formatAssessment = (assessmentName) => {
      if (assessmentType === 'projectManagement') return 'Project Management';
      if (assessmentType === 'gis') return 'GIS';
      if (assessmentType === 'financialRisk') return 'Financial Risk';
      if (assessmentType === 'screening') return 'Screening';
      return assessmentName;
    };

    const otherFilesDiff = diff(
      record?.json_data?.otherFiles || [],
      prevHistoryItem?.record?.json_data?.otherFiles || []
    );

    const getAsessmentSpecificFilesArray = (assessmentName) => {
      if (assessmentName === 'screening') {
        return [
          record.json_data?.assessmentTemplate || [],
          prevHistoryItem?.record?.json_data?.assessmentTemplate || [],
          'Assessment Template',
        ];
      }
      if (
        ['technical', 'projectManagement', 'financialRisk'].includes(
          assessmentName
        )
      ) {
        return [
          record.json_data?.completedAssessment || [],
          prevHistoryItem?.record?.json_data?.completedAssessment || [],
          'Completed assessment',
        ];
      }
      return [[], []];
    };

    const [assessmentFilesArray, prevAssessmentFilesArray, arrayTitle] =
      getAsessmentSpecificFilesArray(assessmentType);

    const showOtherFilesDiff = !!otherFilesDiff;
    const showAssessmentFilesDiff = !!diff(
      assessmentFilesArray,
      prevAssessmentFilesArray
    );

    const assessmentConfig = getTableConfig(`assessment_data`, assessmentType);

    return (
      <div>
        <StyledContent data-testid="history-content-assessment">
          <span>{user} updated the </span>
          <b>{formatAssessment(assessmentType)} Assessment</b>
          <span> on {createdAtFormatted}</span>
        </StyledContent>
        {showHistoryDetails && (
          <HistoryDetails
            json={record.json_data}
            prevJson={prevHistoryItem?.record?.json_data || {}}
            diffSchema={assessmentConfig?.schema}
            excludedKeys={assessmentConfig?.excludedKeys || []}
            overrideParent={assessmentConfig?.overrideParent}
          />
        )}
        {showAssessmentFilesDiff && (
          <HistoryFile
            filesArray={assessmentFilesArray}
            previousFileArray={prevAssessmentFilesArray}
            title={arrayTitle}
          />
        )}
        {showOtherFilesDiff && (
          <HistoryFile
            filesArray={record.json_data?.otherFiles || []}
            previousFileArray={
              prevHistoryItem?.record?.json_data?.otherFiles || []
            }
            title={`${formatAssessment(assessmentType)} Other Files`}
            tableTitle={!showAssessmentFilesDiff}
          />
        )}
      </div>
    );
  }

  if (tableName === 'conditional_approval_data') {
    return (
      <>
        <StyledContent data-testid="history-content-conditional-approval">
          <span>{displayName} saved the </span>
          <b>Conditional approval</b>
          <span> on {createdAtFormatted}</span>
        </StyledContent>
        <HistoryDetails
          json={record.json_data}
          prevJson={prevHistoryItem?.record?.json_data || {}}
          excludedKeys={
            getTableConfig('conditional_approval_data')?.excludedKeys || []
          }
          diffSchema={getTableConfig('conditional_approval_data')?.schema}
          overrideParent={
            getTableConfig('conditional_approval_data')?.overrideParent
          }
        />
        <HistoryFile
          filesArray={
            record.json_data?.letterOfApproval?.letterOfApprovalUpload || []
          }
          previousFileArray={
            prevHistoryItem?.record?.json_data?.letterOfApproval
              ?.letterOfApprovalUpload || []
          }
          title="Letter of approval"
        />
      </>
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
            excludedKeys={
              getTableConfig('application_gis_data')?.excludedKeys || []
            }
            diffSchema={getTableConfig('application_gis_data')?.schema}
            overrideParent={
              getTableConfig('application_gis_data')?.overrideParent
            }
          />
        )}
        {reasonForChange && <ChangeReason reason={reasonForChange} />}
      </div>
    );
  }

  if (tableName === 'application_gis_assessment_hh') {
    return (
      <div>
        <StyledContent data-testid="history-content-gis-assessment-hh">
          <span>
            {displayName}
            {' updated the '}
            <b>GIS Assessment Household Count </b>
          </span>
          on {createdAtFormatted}
        </StyledContent>
        {showHistoryDetails && (
          <HistoryDetails
            json={record}
            prevJson={prevHistoryItem?.record || {}}
            excludedKeys={
              getTableConfig(`application_gis_assessment_hh`)?.excludedKeys ||
              []
            }
            diffSchema={getTableConfig(`application_gis_assessment_hh`)?.schema}
            overrideParent={
              getTableConfig(`application_gis_assessment_hh`)?.overrideParent
            }
          />
        )}
        {reasonForChange && <ChangeReason reason={reasonForChange} />}
      </div>
    );
  }

  if (tableName === 'project_information_data') {
    // Generate a diff for all the file arrays
    // will return undefined if no changes
    const sowFileDiff = diff(
      record.json_data?.statementOfWorkUpload || [],
      prevHistoryItem?.record?.json_data?.statementOfWorkUpload || []
    );
    const sowWirelessFileDiff = diff(
      record.json_data?.sowWirelessUpload || [],
      prevHistoryItem?.record?.json_data?.sowWirelessUpload || []
    );
    const fundingAgreementFileDiff = diff(
      record.json_data?.fundingAgreementUpload || [],
      prevHistoryItem?.record?.json_data?.fundingAgreementUpload || []
    );
    const finalizedMapFileDiff = diff(
      record.json_data?.finalizedMapUpload || [],
      prevHistoryItem?.record?.json_data?.finalizedMapUpload || []
    );
    const otherFilesDiff = diff(
      record.json_data?.otherFiles || [],
      prevHistoryItem?.record?.json_data?.otherFiles || []
    );
    // turn into truthy/falsy values
    const showSow = !!sowFileDiff;
    const showSowWireless = !!sowWirelessFileDiff;
    const showFundingAgreement = !!fundingAgreementFileDiff;
    const showFinalizedMap = !!finalizedMapFileDiff;
    const showOtherFiles = !!otherFilesDiff;
    return (
      <>
        <StyledContent data-testid="history-content-conditional-approval">
          <span>{displayName} saved the </span>
          <b>Project information</b>
          <span> form on {createdAtFormatted}</span>
        </StyledContent>
        {showHistoryDetails && (
          <>
            <HistoryDetails
              json={record.json_data}
              prevJson={prevHistoryItem?.record?.json_data || {}}
              excludedKeys={
                getTableConfig('project_information_data')?.excludedKeys || []
              }
              diffSchema={getTableConfig('project_information_data')?.schema}
              overrideParent="projectInformation"
            />
            {/* Only show if changes, set show hide title depending on previous one showing */}
            {!!sowFileDiff && (
              <HistoryFile
                filesArray={record.json_data?.statementOfWorkUpload || []}
                previousFileArray={
                  prevHistoryItem?.record?.json_data?.statementOfWorkUpload
                }
                title="Statement of Work Excel"
              />
            )}
            {showSowWireless && (
              <HistoryFile
                filesArray={record.json_data?.sowWirelessUpload || []}
                previousFileArray={
                  prevHistoryItem?.record?.json_data?.sowWirelessUpload || []
                }
                title="SOW Wireless Table"
                tableTitle={!showSow}
              />
            )}
            {showFundingAgreement && (
              <HistoryFile
                filesArray={record.json_data?.fundingAgreementUpload || []}
                previousFileArray={
                  prevHistoryItem?.record?.json_data?.fundingAgreementUpload ||
                  []
                }
                title="Funding agreement"
                tableTitle={!showSowWireless}
              />
            )}
            {showFinalizedMap && (
              <HistoryFile
                filesArray={record.json_data?.finalizedMapUpload || []}
                previousFileArray={
                  prevHistoryItem?.record?.json_data?.finalizedMapUpload || []
                }
                title="Finalized spatial data"
                tableTitle={!showFundingAgreement}
              />
            )}
            {showOtherFiles && (
              <HistoryFile
                filesArray={record.json_data?.otherFiles || []}
                previousFileArray={
                  prevHistoryItem?.record?.json_data?.otherFiles || []
                }
                title="Other files"
                tableTitle={!showFinalizedMap}
              />
            )}
          </>
        )}
      </>
    );
  }

  if (tableName === 'application_sow_data') {
    const formattedApplicationData = {
      projectTitle: prevHistoryItem?.record?.json_data?.projectTitle,
      organizationName: prevHistoryItem?.record?.json_data?.organizationName,
    };

    if (recordWithOrgChange === historyItem.recordId) {
      formattedApplicationData.organizationName = originalOrganizationName;
    }
    if (recordWithTitleChange === historyItem.recordId) {
      formattedApplicationData.projectTitle = originalProjectTitle;
    }

    const verb = record.json_data?.isReimport ? 're-imported' : 'uploaded';

    return (
      <>
        <StyledContent data-testid="history-content-sow-data">
          <span>{displayName} {verb} the </span>
          <b>Sow</b>
          <span> file on {createdAtFormatted}</span>
        </StyledContent>
        <HistoryDetails
          json={record.json_data}
          prevJson={formattedApplicationData || {}}
          overrideParent="application_sow_data"
          excludedKeys={
            getTableConfig('application_sow_data')?.excludedKeys || []
          }
          diffSchema={getTableConfig('application_sow_data')?.schema}
        />
      </>
    );
  }

  if (tableName === 'change_request_data') {
    const amendmentNumber = record.json_data?.amendmentNumber;
    // check if key history_operation exists in json_data
    const historyOperationKeyExists =
      record &&
      Object.prototype.hasOwnProperty.call(record, 'history_operation');
    // if it has history_operation use that as operation, otherwise use op
    const action = historyOperationKeyExists
      ? record.history_operation
      : historyItem.record?.history_operation || op;
    let operation = 'updated';
    if (action === 'DELETE') {
      operation = 'deleted';
    } else if (action === 'INSERT') {
      operation = 'created';
    }
    return (
      <>
        <StyledContent data-testid="history-content-change-request">
          <span>
            {displayName} {operation} a{' '}
          </span>
          <b>Change Request</b>&nbsp;with amendment #{amendmentNumber}
          <span> on {createdAtFormatted}</span>
        </StyledContent>
        <HistoryFile
          filesArray={record.json_data?.statementOfWorkUpload || []}
          title="Updated Statement of Work Excel"
        />
      </>
    );
  }

  if (tableName === 'application_community_progress_report_data') {
    const historyOperation = record?.history_operation;
    const hasPrevRecord = !!prevHistoryItem?.record;
    let operation = 'updated';
    if (historyOperation === 'deleted') {
      operation = 'deleted';
    } else if (historyOperation === 'created' && !hasPrevRecord) {
      operation = 'created';
    }
    const isDeleted = operation === 'deleted';

    const currFileArray = isDeleted
      ? []
      : record.json_data?.progressReportFile || [];
    const previousFileArray =
      prevHistoryItem?.record?.json_data?.progressReportFile || [];

    const showFilesDiff = !!diff(currFileArray, previousFileArray);
    const dueDate =
      record?.json_data?.dueDate || prevHistoryItem?.record?.json_data?.dueDate;
    const fiscalPeriod = `${getFiscalQuarter(dueDate)} ${getFiscalYear(dueDate)}`;

    return (
      <>
        <StyledContent data-testid="history-content-community-progress-report">
          <span>
            {displayName} {operation} the{' '}
          </span>
          {fiscalPeriod && <span>{fiscalPeriod} </span>}
          <b>Community progress report</b>
          <span> on {createdAtFormatted}</span>
        </StyledContent>
        <HistoryDetails
          json={isDeleted ? {} : record.json_data || {}}
          prevJson={prevHistoryItem?.record?.json_data || {}}
          excludedKeys={
            getTableConfig('application_community_progress_report_data')
              ?.excludedKeys || []
          }
          diffSchema={
            getTableConfig('application_community_progress_report_data')?.schema
          }
          overrideParent={
            getTableConfig('application_community_progress_report_data')
              ?.overrideParent
          }
        />
        {showFilesDiff && (
          <HistoryFile
            filesArray={currFileArray}
            previousFileArray={previousFileArray}
            title="Community Progress Report Excel"
          />
        )}
      </>
    );
  }

  if (tableName === 'application_claims_data') {
    const operation = historyItem.record?.history_operation;
    const isDelete = operation === 'deleted';

    const currFiles = isDelete ? [] : record.json_data?.claimsFile || [];
    const prevHistoryOperation = prevHistoryItem?.record?.history_operation;
    const prevFiles =
      prevHistoryOperation === 'deleted'
        ? []
        : prevHistoryItem?.record?.json_data?.claimsFile || [];

    const filesDiff = !!diff(currFiles, prevFiles);

    return (
      <>
        <StyledContent data-testid="history-content-claims">
          <span>
            {displayName} {operation} a <b>Claim & Progress Report</b> on{' '}
            {createdAtFormatted}
          </span>
        </StyledContent>
        {showHistoryDetails && filesDiff && (
          <HistoryFile
            filesArray={currFiles}
            previousFileArray={prevFiles}
            title="Claims & Progress Report Excel"
            testId="history-content-claims-file"
          />
        )}
      </>
    );
  }
  if (tableName === 'application_milestone_data') {
    const fiscalQuarter = getFiscalQuarter(record.json_data?.dueDate);
    const fiscalYear = getFiscalYear(record.json_data?.dueDate);
    const updateRec = op === 'INSERT' && prevHistoryItem;
    const newMilestoneFile = record.json_data?.milestoneFile;
    const oldMilestoneFile = prevHistoryItem?.record?.json_data?.milestoneFile;
    const changedMilestoneFile =
      updateRec &&
      ((oldMilestoneFile && !newMilestoneFile) ||
        (newMilestoneFile && !oldMilestoneFile) ||
        (newMilestoneFile &&
          oldMilestoneFile &&
          newMilestoneFile[0].uuid !== oldMilestoneFile[0].uuid));
    const newEvidenceFile = record.json_data?.evidenceOfCompletionFile;
    const oldEvidenceFile =
      prevHistoryItem?.record?.json_data?.evidenceOfCompletionFile;
    const changedEvidenceFile =
      updateRec &&
      ((oldEvidenceFile && !newEvidenceFile) ||
        (newEvidenceFile && !oldEvidenceFile) ||
        (newEvidenceFile &&
          oldEvidenceFile &&
          newEvidenceFile[0].uuid !== oldEvidenceFile[0].uuid));

    return (
      <>
        <StyledContent data-testid="history-content-milestone_data">
          {op === 'INSERT' && record.history_operation === 'created' && (
            <span>{displayName} created a </span>
          )}
          {op === 'INSERT' && record.history_operation === 'updated' && (
            <span>{displayName} updated a </span>
          )}
          {op === 'UPDATE' && record.history_operation === 'deleted' && (
            <span>{displayName} deleted a </span>
          )}
          <b>
            {' '}
            {fiscalQuarter} {fiscalYear} Milestone Report
          </b>
          <span> on {createdAtFormatted}</span>
        </StyledContent>
        {op === 'INSERT' && showHistoryDetails && (
          <HistoryDetails
            json={record.json_data}
            prevJson={prevHistoryItem?.record?.json_data || {}}
            excludedKeys={
              getTableConfig('application_milestone_data')?.excludedKeys || []
            }
            diffSchema={getTableConfig('application_milestone_data')?.schema}
            overrideParent={
              getTableConfig('application_milestone_data')?.overrideParent
            }
          />
        )}
        {op === 'UPDATE' &&
          record?.history_operation === 'deleted' &&
          showHistoryDetails && (
            <HistoryDetails
              json={{}}
              prevJson={record.json_data}
              excludedKeys={
                getTableConfig('application_milestone_data')?.excludedKeys || []
              }
              diffSchema={getTableConfig('application_milestone_data')?.schema}
              overrideParent={
                getTableConfig('application_milestone_data')?.overrideParent
              }
            />
          )}
        {op === 'INSERT' && changedMilestoneFile && (
          <HistoryFile
            filesArray={record.json_data.milestoneFile || []}
            previousFileArray={oldMilestoneFile || []}
            title="Milestone Report Excel"
            testId="history-content-milestone-file"
          />
        )}
        {op === 'INSERT' && changedEvidenceFile && (
          <HistoryFile
            filesArray={record.json_data.evidenceOfCompletionFile || []}
            previousFileArray={oldEvidenceFile || []}
            title="Milestone Completion Evidence"
            tableTitle={!changedMilestoneFile}
            testId="history-content-milestone-evidence-file"
          />
        )}
        {op === 'UPDATE' && record?.history_operation === 'deleted' && (
          <HistoryFile
            filesArray={[]}
            previousFileArray={record.json_data.milestoneFile || []}
            title="Milestone Report Excel"
            tableTitle={false}
            testId="history-content-milestone-file"
          />
        )}
        {op === 'UPDATE' && record?.history_operation === 'deleted' && (
          <HistoryFile
            filesArray={[]}
            previousFileArray={record.json_data.evidenceOfCompletionFile || []}
            title="Milestone Completion Evidence"
            tableTitle={false}
            testId="history-content-milestone-evidence-file"
          />
        )}
      </>
    );
  }

  if (tableName === 'application_pending_change_request') {
    let action = 'edited';
    let { comment } = record;
    let message = 'the';
    let messageBolded = 'pending change request';
    const pendingChangeRequestSchema = {
      pendingChangeRequest: {
        properties: {
          comment: {
            title: 'Comments:',
            type: 'string',
          },
        },
      },
    };
    if (record.is_pending === true && !prevHistoryItem?.record?.is_pending) {
      action = 'indicated';
      message = 'that a';
      messageBolded = 'change request is pending';
    }
    if (
      record.comment === 'Yes, change request cancelled' ||
      record.comment === 'Yes, change request completed'
    ) {
      action = 'indicated';
      pendingChangeRequestSchema.pendingChangeRequest.properties.comment.title =
        'Reason:';
      comment = record.comment?.replace(/^Yes, /, '');
      message = 'that the';
      messageBolded = 'change request is no longer pending';
    }

    const excludedKeys = [
      'id',
      'application_id',
      'created_at',
      'updated_at',
      'created_by',
      'updated_by',
      'archived_at',
      'archived_by',
      'is_pending',
    ];
    if (record.comment === null) {
      excludedKeys.push('comment');
    }
    return (
      <>
        <StyledContent data-testid="history-content-pending-change-request">
          <span>
            {displayName} {action} {message}{' '}
          </span>
          <b>{messageBolded}</b>
          <span> on {createdAtFormatted}</span>
        </StyledContent>
        <HistoryDetails
          json={{ ...record, comment }}
          prevJson={prevHistoryItem?.record || {}}
          excludedKeys={excludedKeys}
          diffSchema={pendingChangeRequestSchema}
          overrideParent="pendingChangeRequest"
        />
      </>
    );
  }

  if (tableName === 'application_communities') {
    const user =
      createdBy === 1 && op === 'INSERT' ? 'The system' : displayName;
    const changes = diff(prevHistoryItem?.record || {}, record);
    const [newArray, oldArray] = processArrayDiff(
      changes,
      communities.applicationCommunities
    );

    return (
      <>
        <StyledContent data-testid="history-content-communities">
          <span>
            {user} updated the coverage area for the project which resulted in a
            change to <b>Community Location Data</b> on {createdAtFormatted}
          </span>
        </StyledContent>
        {newArray.length > 0 && (
          <CommunitiesHistoryTable
            action="Added"
            communities={processCommunity(newArray)}
            isCbc={false}
          />
        )}
        {oldArray.length > 0 && (
          <CommunitiesHistoryTable
            action="Deleted"
            communities={processCommunity(oldArray)}
            isCbc={false}
          />
        )}
      </>
    );
  }

  if (tableName === 'application_fnha_contribution') {
    return (
      <StyledContent data-testid="history-fnha-contribution">
        <span>
          {displayName} updated <b>FNHA Contribution</b> on {createdAtFormatted}
        </span>
        {showHistoryDetails && (
          <HistoryDetails
            json={record}
            prevJson={prevHistoryItem?.record || {}}
            excludedKeys={
              getTableConfig('application_fnha_contribution')?.excludedKeys ||
              []
            }
            diffSchema={getTableConfig('application_fnha_contribution')?.schema}
            overrideParent={
              getTableConfig('application_fnha_contribution')?.overrideParent
            }
          />
        )}
        {reasonForChange && <ChangeReason reason={reasonForChange} />}
      </StyledContent>
    );
  }

  return null;
};

export default HistoryContent;
