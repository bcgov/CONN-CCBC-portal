import styled from 'styled-components';
import { DateTime } from 'luxon';
import statusStyles from 'data/statusStyles';
import { useFeature } from '@growthbook/growthbook-react';
import applicationDiffSchema from 'formSchema/uiSchema/history/application';
import applicationGisDataSchema from 'formSchema/uiSchema/history/applicationGisData';
import rfiDiffSchema from 'formSchema/uiSchema/history/rfi';
import projectInformationSchema from 'formSchema/uiSchema/history/projectInformation';
import { diff } from 'json-diff';
import conditionalApprovalSchema from 'formSchema/uiSchema/history/conditionalApproval';
import screeningSchema from 'formSchema/uiSchema/history/screening';
import gis from 'formSchema/uiSchema/history/gis';
import gisAssessmentHhSchema from 'formSchema/uiSchema/history/gisAssessmentHh';
import applicationSowDataSchema from 'formSchema/uiSchema/history/applicationSowData';
import applicationAnnounced from 'formSchema/uiSchema/history/applicationAnnounced';
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

const communityReportSchema = {
  communityReport: {
    properties: {
      dueDate: {
        title: 'Due date',
        type: 'string',
      },
      dateReceived: {
        title: 'Date received',
        type: 'string',
      },
    },
  },
};

const filterArrays = (obj: Record<string, any>): Record<string, any> => {
  const filteredEntries = Object.entries(obj).filter(([, value]) =>
    Array.isArray(value)
  );
  return Object.fromEntries(filteredEntries);
};

const HistoryContent = ({
  historyItem,
  prevHistoryItem,
  originalOrganizationName,
  originalProjectTitle,
  recordWithOrgChange,
  recordWithTitleChange,
}) => {
  const {
    givenName,
    familyName,
    tableName,
    createdAt,
    createdBy,
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
              excludedKeys={[
                'id',
                'createdAt',
                'updatedAt',
                'applicationId',
                'name',
                'size',
                'type',
                'rfiEmailCorrespondance',
                'fileDate',
                'uploadedAt',
                'eligibilityAndImpactsCalculator',
                'detailedBudget',
                'financialForecast',
                'lastMileIspOffering',
                'popWholesalePricing',
                'communityRuralDevelopmentBenefitsTemplate',
                'wirelessAddendum',
                'supportingConnectivityEvidence',
                'geographicNames',
                'equipmentDetails',
                'copiesOfRegistration',
                'preparedFinancialStatements',
                'logicalNetworkDiagram',
                'projectSchedule',
                'communityRuralDevelopmentBenefits',
                'otherSupportingMaterials',
                'geographicCoverageMap',
                'coverageAssessmentStatistics',
                'currentNetworkInfastructure',
                'upgradedNetworkInfrastructure',
                'uuid',
              ]}
              diffSchema={rfiDiffSchema}
              overrideParent="rfi"
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
              <HistoryFile
                filesArray={additionalFiles || []}
                previousFileArray={prevAdditionalFiles || []}
                title="Additional files"
              />
            )}
          </>
        )}
        {displayName === 'The applicant' && (
          <HistoryFile
            filesArray={additionalFiles || []}
            previousFileArray={prevAdditionalFiles || []}
            title="Additional files"
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

    return (
      <StyledContent data-testid="history-content-attachment">
        <span>
          {displayName} {operation} an announcement on {createdAtFormatted}
        </span>
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
            excludedKeys={[
              'id',
              'updated_at',
              'created_at',
              'created_by',
              'updated_by',
              'archived_at',
              'archived_by',
            ]}
            diffSchema={applicationAnnounced}
            overrideParent="applicationAnnounced"
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
      } else {
        projectTypeTitle = 'Last Mile & Transport';
      }
    }
    let previousProjectTypeTitle = 'Unassigned';
    if (previousProjectType) {
      if (previousProjectType === 'lastMile') {
        previousProjectTypeTitle = 'Last Mile';
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
    return (
      <StyledContent data-testid="history-content-package">
        <span>
          {displayName} added the application to a <b>Package</b> on{' '}
          {createdAtFormatted}
        </span>
      </StyledContent>
    );
  }

  if (tableName === 'application_dependencies') {
    const user =
      createdBy === 1 && op === 'INSERT' ? 'The system' : displayName;
    return (
      <>
        <StyledContent data-testid="history-content-dependencies">
          <span>
            {user} updated the <b>Technical Assessment :</b> on{' '}
            {createdAtFormatted}
          </span>
        </StyledContent>
        <HistoryDetails
          json={record.json_data}
          prevJson={prevHistoryItem?.record?.json_data || {}}
          excludedKeys={['id', 'createdAt', 'updatedAt', 'applicationId']}
          diffSchema={{
            applicationDependencies: {
              properties: {
                crtcProjectDependent: { title: 'CRTC Project Dependent' },
                connectedCoastNetworkDependent: {
                  title: 'Connected Coast Network Dependent',
                },
              },
            },
          }}
          overrideParent="applicationDependencies"
        />
        {reasonForChange && <ChangeReason reason={reasonForChange} />}
      </>
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
      return [[], []];
    };

    const [assessmentFilesArray, prevAssessmentFilesArray, arrayTitle] =
      getAsessmentSpecificFilesArray(assessmentType);

    const assessmentSchema = (assessmentName) => {
      if (assessmentName === 'screening') return screeningSchema;
      if (assessmentName === 'gis') return gis;
      return {};
    };

    const showOtherFilesDiff = !!otherFilesDiff;
    const showAssessmentFilesDiff = !!diff(
      assessmentFilesArray,
      prevAssessmentFilesArray
    );

    const isDetailedAssessment =
      assessmentType === 'gis' || assessmentType === 'screening';

    return (
      <div>
        <StyledContent data-testid="history-content-assessment">
          <span>{user} updated the </span>
          <b>{formatAssessment(assessmentType)} Assessment</b>
          <span> on {createdAtFormatted}</span>
        </StyledContent>
        {showHistoryDetails && isDetailedAssessment && (
          <HistoryDetails
            json={record.json_data}
            prevJson={prevHistoryItem?.record?.json_data || {}}
            diffSchema={assessmentSchema(assessmentType)}
            excludedKeys={[
              'id',
              'name',
              'size',
              'type',
              'uuid',
              'uploadedAt',
              'otherFiles',
              'assessmentTemplate',
            ]}
            overrideParent={assessmentType}
          />
        )}
        {showOtherFilesDiff && isDetailedAssessment && (
          <HistoryFile
            filesArray={record.json_data?.otherFiles || []}
            previousFileArray={
              prevHistoryItem?.record?.json_data?.otherFiles || []
            }
            title={`${formatAssessment(assessmentType)} Other Files`}
          />
        )}
        {showAssessmentFilesDiff && isDetailedAssessment && (
          <HistoryFile
            filesArray={assessmentFilesArray}
            previousFileArray={prevAssessmentFilesArray}
            title={arrayTitle}
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
          excludedKeys={[
            'id',
            'createdAt',
            'updatedAt',
            'uploadedAt',
            'size',
            'name',
            'uuid',
            'type',
          ]}
          diffSchema={conditionalApprovalSchema}
          overrideParent="conditionalApproval"
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
            excludedKeys={['ccbc_number']}
            diffSchema={applicationGisDataSchema}
            overrideParent="gis"
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
            excludedKeys={[
              'id',
              'updated_at',
              'created_at',
              'created_by',
              'updated_by',
              'archived_at',
              'archived_by',
            ]}
            diffSchema={gisAssessmentHhSchema}
            overrideParent="gis"
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
              excludedKeys={[
                'upload',
                'sowWirelessUpload',
                'statementOfWorkUpload',
                'finalizedMapUpload',
                'fundingAgreementUpload',
                'otherFiles',
              ]}
              diffSchema={projectInformationSchema}
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

    return (
      <>
        <StyledContent data-testid="history-content-sow-data">
          <span>{displayName} Uploaded the </span>
          <b>Sow</b>
          <span> file on {createdAtFormatted}</span>
        </StyledContent>
        <HistoryDetails
          json={record.json_data}
          prevJson={formattedApplicationData || {}}
          overrideParent="application_sow_data"
          excludedKeys={[
            'province',
            'ccbc_number',
            'effectiveStartDate',
            'projectStartDate',
            'projectCompletionDate',
            'backboneFibre',
            'backboneMicrowave',
            'backboneSatellite',
            'lastMileFibre',
            'lastMileCable',
            'lastMileDSL',
            'lastMileMobileWireless',
            'lastMileFixedWireless',
            'lastMileSatellite',
          ]}
          diffSchema={applicationSowDataSchema}
        />
      </>
    );
  }

  if (tableName === 'change_request_data') {
    return (
      <>
        <StyledContent data-testid="history-content-change-request">
          <span>
            {displayName} {op === 'INSERT' ? 'created' : 'updated'} a{' '}
          </span>
          <b>Change Request</b>
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
    const updateRec = op === 'INSERT' && prevHistoryItem;
    const newFile = record.json_data?.progressReportFile;
    const oldFile = prevHistoryItem?.record?.json_data?.progressReportFile;
    const changedFile =
      updateRec &&
      ((oldFile && !newFile) ||
        (newFile && !oldFile) ||
        (newFile && oldFile && newFile[0].uuid !== oldFile[0].uuid));

    return (
      <>
        <StyledContent data-testid="history-content-community-progress-report">
          {op === 'INSERT' && prevHistoryItem?.record && (
            <span>{displayName} updated a </span>
          )}
          {op === 'INSERT' && prevHistoryItem?.record === undefined && (
            <span>{displayName} created a </span>
          )}
          {op === 'UPDATE' && record.history_operation === 'deleted' && (
            <span>{displayName} deleted a </span>
          )}
          <b>Community Progress Report</b>
          <span> on {createdAtFormatted}</span>
        </StyledContent>
        {op === 'INSERT' && changedFile && (
          <HistoryFile
            filesArray={record.json_data.progressReportFile || []}
            title="Uploaded Community Progress Report Excel"
          />
        )}
        {op === 'INSERT' && showHistoryDetails && (
          <HistoryDetails
            json={record.json_data}
            prevJson={prevHistoryItem?.record?.json_data || {}}
            excludedKeys={['ccbc_number', 'progressReportFile']}
            diffSchema={communityReportSchema}
            overrideParent="communityReport"
          />
        )}
      </>
    );
  }

  if (tableName === 'application_claims_data') {
    const operation = historyItem.record?.history_operation;
    const isUpdate = operation === 'updated';
    const isDelete = operation === 'deleted';
    const isFile = record.json_data?.claimsFile?.length > 0;

    return (
      <>
        <StyledContent data-testid="history-content-claims">
          <span>
            {displayName} {operation} a <b>Claim & Progress Report</b> on{' '}
            {createdAtFormatted}
          </span>
        </StyledContent>

        {!isUpdate && isFile && (
          <HistoryFile
            filesArray={record.json_data.claimsFile || []}
            previousFileArray={
              prevHistoryItem?.record?.json_data?.claimsFile || []
            }
            title={`${
              isDelete ? 'Deleted' : 'Uploaded'
            } Claims & Progress Report Excel`}
            testId="history-content-claims-file"
          />
        )}
        {showHistoryDetails && isUpdate && (
          <HistoryFile
            filesArray={record.json_data.claimsFile || []}
            previousFileArray={
              prevHistoryItem?.record?.json_data?.claimsFile || []
            }
            title="Uploaded Claims & Progress Report Excel"
            testId="history-content-claims-file"
          />
        )}
      </>
    );
  }
  if (tableName === 'application_milestone_data') {
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
          <b>Milestone Report</b>
          <span> on {createdAtFormatted}</span>
        </StyledContent>
        {op === 'INSERT' && showHistoryDetails && (
          <HistoryDetails
            json={record.json_data}
            prevJson={prevHistoryItem?.record?.json_data || {}}
            excludedKeys={[
              'ccbc_number',
              'milestoneFile',
              'evidenceOfCompletionFile',
            ]}
            diffSchema={communityReportSchema}
            overrideParent="communityReport"
          />
        )}
        {op === 'UPDATE' &&
          record?.history_operation === 'deleted' &&
          showHistoryDetails && (
            <HistoryDetails
              json={{}}
              prevJson={record.json_data}
              excludedKeys={[
                'ccbc_number',
                'milestoneFile',
                'evidenceOfCompletionFile',
              ]}
              diffSchema={communityReportSchema}
              overrideParent="communityReport"
            />
          )}
        {op === 'INSERT' && changedMilestoneFile && (
          <HistoryFile
            filesArray={record.json_data.milestoneFile || []}
            previousFileArray={oldMilestoneFile || []}
            title="Uploaded Milestone Report Excel"
            testId="history-content-milestone-file"
          />
        )}
        {op === 'INSERT' && changedEvidenceFile && (
          <HistoryFile
            filesArray={record.json_data.evidenceOfCompletionFile || []}
            previousFileArray={oldEvidenceFile || []}
            title="Uploaded Milestone Completion Evidence"
            tableTitle={!changedMilestoneFile}
            testId="history-content-milestone-evidence-file"
          />
        )}
        {op === 'UPDATE' && record?.history_operation === 'deleted' && (
          <HistoryFile
            filesArray={[]}
            previousFileArray={record.json_data.milestoneFile || []}
            title="Uploaded Milestone Report Excel"
            tableTitle={false}
            testId="history-content-milestone-file"
          />
        )}
        {op === 'UPDATE' && record?.history_operation === 'deleted' && (
          <HistoryFile
            filesArray={[]}
            previousFileArray={record.json_data.evidenceOfCompletionFile || []}
            title="Uploaded Milestone Completion Evidence"
            tableTitle={false}
            testId="history-content-milestone-evidence-file"
          />
        )}
      </>
    );
  }

  return null;
};

export default HistoryContent;
