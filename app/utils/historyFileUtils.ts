import { diff } from 'json-diff';
import DownloadLink from 'components/DownloadLink';
import React from 'react';
import { getDefaultFormState } from '@rjsf/utils';
import AJV8Validator from '@rjsf/validator-ajv8';

export interface FileChange {
  type: 'added' | 'deleted' | 'replaced';
  field: string;
  fileName: string;
  uuid: string;
  oldFileName?: string;
  oldUuid?: string;
}

export const DIFF_SCHEMA_OPTIONS: any = {
  emptyObjectFields: 'skipEmptyDefaults',
  arrayMinItems: { populate: 'never' },
  allOf: 'skipDefaults',
  mergeDefaultsIntoFormData: 'useFormDataIfPresent',
  constAsDefaults: 'never',
};

// Generates file differences for project change log
// Similar to HistoryFileRow but returns structured data instead of JSX
export const generateFileChanges = (
  filesArray: any[],
  title: string,
  previousFileArray: any[] = []
): FileChange[] => {
  const filesDiff = diff(previousFileArray || [], filesArray || [], {
    keepUnchangedValues: true,
    full: true,
  });

  if (!filesDiff) return [];

  const changes: FileChange[] = [];

  filesDiff.forEach((file) => {
    const fileData = file[1];

    // A file was added
    if (file[0] === '+') {
      changes.push({
        type: 'added',
        field: title,
        fileName: fileData.name,
        uuid: fileData.uuid,
      });
    }

    // A file was removed
    else if (file[0] === '-') {
      changes.push({
        type: 'deleted',
        field: title,
        fileName: fileData.name,
        uuid: fileData.uuid,
      });
    }

    // The object was modified (file replacement)
    else if (file[0] === '~') {
      if (filesDiff.length === 1) {
        changes.push({
          type: 'replaced',
          field: title,
          fileName: fileData.name?.__new || fileData.name,
          uuid: fileData.uuid.__new,
          oldFileName: fileData.name?.__old || fileData.name,
          oldUuid: fileData.uuid.__old,
        });
      } else {
        // Handle as separate delete and add operations
        changes.push({
          type: 'deleted',
          field: title,
          fileName: fileData.name?.__old,
          uuid: fileData.uuid?.__old,
        });
        changes.push({
          type: 'added',
          field: title,
          fileName: fileData.name?.__new,
          uuid: fileData.uuid?.__new,
        });
      }
    }
  });

  return changes;
};

// Renders a file change as a React element with DownloadLink

export const renderFileChange = (
  change: FileChange,
  isOldValue: boolean = false
): React.ReactElement => {
  const { type, fileName, uuid, oldFileName, oldUuid } = change;

  const createLink = (
    linkUuid: string,
    linkFileName: string,
    applyStrikethrough: boolean = false
  ) => {
    const linkElement = React.createElement(DownloadLink, {
      uuid: linkUuid,
      fileName: linkFileName,
    });

    if (applyStrikethrough) {
      return React.createElement(
        'span',
        { style: { textDecoration: 'line-through' } },
        linkElement
      );
    }

    return linkElement;
  };

  switch (type) {
    case 'added':
      return createLink(uuid, fileName, isOldValue);

    case 'deleted':
      return createLink(uuid, fileName, isOldValue);

    case 'replaced':
      // For replaced files, show the appropriate file based on context
      if (isOldValue) {
        // In old value column, show the old file with strikethrough
        return createLink(oldUuid, oldFileName, true);
      }
      // In new value column, show the new file
      return createLink(uuid, fileName, false);

    default:
      return React.createElement('span', null, 'N/A');
  }
};

// Gets file arrays from record based on table name and field
export const getFileArraysFromRecord = (
  record: any,
  prevRecord: any,
  tableName: string,
  fieldName: string
): [any[], any[]] => {
  let currentFiles = [];
  let previousFiles = [];
  const isDeleted = record?.history_operation === 'deleted';

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Handle different data structures based on table type
  if (
    tableName === 'form_data' ||
    tableName === 'rfi_data' ||
    tableName === 'assessment_data' ||
    tableName === 'conditional_approval_data' ||
    tableName === 'application_gis_data' ||
    tableName === 'project_information_data' ||
    tableName === 'application_sow_data' ||
    tableName === 'application_community_progress_report_data' ||
    tableName === 'application_milestone_data' ||
    tableName === 'application_dependencies' ||
    tableName === 'change_request_data' ||
    tableName === 'application_claims_data'
  ) {
    // These tables store files in json_data
    currentFiles = getNestedValue(record?.json_data, fieldName) || [];
    previousFiles = getNestedValue(prevRecord?.json_data, fieldName) || [];
  } else {
    // For other tables, files might be stored directly in the record
    currentFiles = getNestedValue(record, fieldName) || [];
    previousFiles = getNestedValue(prevRecord, fieldName) || [];
  }

  if (isDeleted) {
    const deletedFiles = currentFiles.length > 0 ? currentFiles : previousFiles;
    return [[], deletedFiles || []];
  }

  return [currentFiles, previousFiles];
};

// Maps table names to their file field configurations
export const getFileFieldsForTable = (
  tableName: string,
  assessmentType?: string
): Array<{ field: string; title: string }> => {
  const getAssessmentTypeTitle = (type: string): string => {
    switch (type) {
      case 'gis':
        return 'GIS';
      case 'screening':
        return 'Screening';
      default:
        return 'Technical';
    }
  };

  const fieldsMap: Record<string, Array<{ field: string; title: string }>> = {
    rfi_data: [
      { field: 'rfiEmailCorrespondance', title: 'Email files' },
      // RFI additional files are handled separately in HistoryRfiFile
    ],
    assessment_data: [
      {
        field: 'otherFiles',
        title: `${getAssessmentTypeTitle(assessmentType)} Other Files`,
      },
    ],
    conditional_approval_data: [
      {
        field: 'letterOfApproval.letterOfApprovalUpload',
        title: 'Letter of approval',
      },
    ],
    project_information_data: [
      { field: 'statementOfWorkUpload', title: 'Statement of Work Excel' },
      { field: 'sowWirelessUpload', title: 'SOW Wireless Table' },
      { field: 'fundingAgreementUpload', title: 'Funding agreement' },
      { field: 'finalizedMapUpload', title: 'Finalized spatial data' },
      { field: 'otherFiles', title: 'Other files' },
    ],
    change_request_data: [
      {
        field: 'statementOfWorkUpload',
        title: 'Updated Statement of Work Excel',
      },
    ],
    application_community_progress_report_data: [
      { field: 'progressReportFile', title: 'Community Progress Report Excel' },
    ],
    application_claims_data: [
      { field: 'claimsFile', title: 'Claims & Progress Report Excel' },
    ],
    application_milestone_data: [
      { field: 'milestoneFile', title: 'Milestone Report Excel' },
      {
        field: 'evidenceOfCompletionFile',
        title: 'Milestone Completion Evidence',
      },
    ],
  };

  // Add assessment-specific files for assessment_data
  if (tableName === 'assessment_data' && assessmentType) {
    if (assessmentType === 'screening') {
      fieldsMap.assessment_data.push({
        field: 'screeningTemplate',
        title: 'Screening Template',
      });
    } else if (assessmentType === 'gis') {
      fieldsMap.assessment_data.push({
        field: 'gisTemplate',
        title: 'GIS Template',
      });
    } else if (assessmentType === 'technical') {
      fieldsMap.assessment_data.push({
        field: 'assessmentTemplate',
        title: 'Assessment Template',
      });
    }
  }

  return fieldsMap[tableName] || [];
};

export const normalizeJsonWithDefaults = (schema: any, json: any) => {
  return getDefaultFormState(
    AJV8Validator,
    schema,
    json,
    {},
    false,
    DIFF_SCHEMA_OPTIONS
  );
};
