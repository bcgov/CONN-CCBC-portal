/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/jsx-pascal-case */
import { useMemo, useState } from 'react';
import * as React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  MRT_ToggleGlobalFilterButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  MRT_ShowHideColumnsButton,
  MRT_ColumnSizingState,
} from 'material-react-table';
import { diff } from 'json-diff';
import { generateRawDiff, processArrayDiff } from 'components/DiffTable';
import getConfig from 'next/config';
import cbcData from 'formSchema/uiSchema/history/cbcData';
import communities from 'formSchema/uiSchema/history/communities';
import { getFiscalQuarter, getFiscalYear } from 'utils/fiscalFormat';
import styled from 'styled-components';
import {
  generateFileChanges,
  renderFileChange,
  getFileArraysFromRecord,
  getFileFieldsForTable,
} from 'utils/historyFileUtils';
import { Box, Link, TableCellProps, IconButton, Tooltip } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTime } from 'luxon';
import { getTableConfig } from 'utils/historyTableConfig';
import {
  buildMergeChildrenMap,
  getMergeChildrenKey,
} from 'utils/mergeChildren';
import ClearFilters from 'components/Table/ClearFilters';
import { getLabelForType } from 'components/Analyst/History/HistoryFilter';
import { convertStatus } from 'backend/lib/dashboard/util';
import { useFeature } from '@growthbook/growthbook-react';
import getCbcSectionFromKey from 'utils/historyCbcSection';
import { useChangeLogCache } from 'hooks/useChangeLogCache';
import reportClientError from 'lib/helpers/reportClientError';
import AdditionalFilters from './AdditionalFilters';
import { HighlightFilterMatch } from './AllDashboardDetailPanel';

interface Props {
  query: any;
}

const StyledTableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.color.links};
  text-decoration: none;
  margin-left: 2px;

  &:hover {
    text-decoration: underline;
  }
`;

const StyledCommunitiesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin-bottom: none;
`;

const StyledCommunitiesHeader = styled.th`
  width: 50%;
  text-align: left;
  font-weight: bold;
  font-size: 13px;
  height: 32px;
  padding: 4px;
  border-bottom: 1px solid #999;
`;

const ProjectIdCell = ({ cell, renderedCellValue }) => {
  const isVisibleRow = cell.row.original?.isVisibleRow;
  const rowId = cell.row.original?.id;
  const isCbcProject = cell.row.original?.isCbcProject;

  if (!isVisibleRow) return null;

  const href = isCbcProject
    ? `/analyst/cbc/${rowId}/cbcHistory`
    : `/analyst/application/${rowId}/history`;

  return <StyledLink href={href}>{renderedCellValue}</StyledLink>;
};

const MergedCell = ({ cell, renderedCellValue }) => {
  const isVisibleRow = cell.row.original?.isVisibleRow;

  if (!isVisibleRow) return null;

  // Ensure we never return an object as a React child
  // Check if it's a React element first
  if (React.isValidElement(renderedCellValue)) {
    return renderedCellValue;
  }

  const displayValue =
    typeof renderedCellValue === 'object' && renderedCellValue !== null
      ? JSON.stringify(renderedCellValue)
      : renderedCellValue;
  return displayValue;
};

const StyledCommunitiesCell = styled.td<{
  addBorder: boolean;
  isRemoved?: boolean;
}>`
  width: 50%;
  font-size: 13px;
  padding: 2px;
  white-space: nowrap;
  display: table-cell;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 32px;
  border-bottom: ${({ addBorder }) => (addBorder ? '1px solid #ddd' : 'none')};
  text-decoration: ${({ isRemoved }) => (isRemoved ? 'line-through' : 'none')};
`;

const muiTableBodyRowProps = ({ row }) => ({
  id: `${row.original.isCbcProject ? 'cbc' : 'ccbc'}-${row.original.rowId}`,
  hover: false,
  sx: {
    cursor: 'pointer',
    borderTop: row.original.isVisibleRow
      ? '1px solid rgba(224, 224, 224, 1)'
      : 'none',
  },
});

const muiTableBodyCellProps = (): TableCellProps => ({
  align: 'left',
  sx: { padding: '8px', border: 'none', alignItems: 'flex-start' },
});

const muiTableHeadCellProps = {
  sx: {
    wordBreak: 'break-word',
    texOverflow: 'wrap',
    '.Mui-TableHeadCell-Content-Labels': {
      width: '100%',
      justifyContent: 'space-between',
    },
    '.Mui-TableHeadCell-Content-Wrapper ': {
      overflow: 'hidden',
      textOverflow: 'clip',
    },
    '&:last-child': {
      paddingRight: '16px',
    },
  },
};

const formatUser = (item) => {
  const isSystem = item.createdBy === 1;
  const isApplicant =
    item.record?.user_info?.session_sub.includes('bceid') &&
    item.record?.user_info?.external_analyst !== true;
  if (isSystem) {
    return 'The system';
  }
  if (isApplicant) {
    return `The applicant`;
  }

  return `${item.record?.user_info?.given_name} ${item.record?.user_info?.family_name}`;
};

const formatProjectType = (projectType: string | null | undefined) => {
  if (projectType === 'N/A') return 'N/A';
  if (!projectType) return 'Unassigned';
  if (projectType === 'lastMile') return 'Last Mile';
  if (projectType === 'transport') return 'Transport';
  return 'Last Mile & Transport';
};

const communityArrayToHistoryString = (
  communitiesArray: any[],
  keys: string[]
) =>
  communitiesArray.map((obj) => keys.map((key) => obj?.[key] ?? '').join(' '));

const CommunitiesCell = (
  key1: string,
  key2: string,
  value: any[],
  isRemoved: boolean,
  filters: string[]
) => {
  const headers = {
    bc_geographic_name: 'Geographic Name',
    geographic_type: 'Geographic Type',
    economic_region: 'Economic Region',
    regional_district: 'Regional District',
  };
  return (
    <StyledCommunitiesTable>
      <thead>
        <tr>
          <StyledCommunitiesHeader>{headers[key1]}</StyledCommunitiesHeader>
          <StyledCommunitiesHeader>{headers[key2]}</StyledCommunitiesHeader>
        </tr>
      </thead>
      <tbody>
        {value.map((loc, i) => (
          <tr key={loc['communities_source_data_id']}>
            <StyledCommunitiesCell
              addBorder={i < value.length - 1}
              isRemoved={isRemoved}
              title={loc[key1]}
            >
              {HighlightFilterMatch({
                text: loc[key1],
                filters,
              })}
            </StyledCommunitiesCell>
            <StyledCommunitiesCell
              addBorder={i < value.length - 1}
              isRemoved={isRemoved}
              title={loc[key2]}
            >
              {HighlightFilterMatch({
                text: loc[key2],
                filters,
              })}
            </StyledCommunitiesCell>
          </tr>
        ))}
      </tbody>
    </StyledCommunitiesTable>
  );
};

const HistoryValueCell = ({
  row,
  column,
  renderedCellValue,
  table,
  historyType = 'new',
}) => {
  const { field, oldValue, newValue, isFileChange } = row.original;
  const value = historyType === 'old' ? oldValue : newValue;
  const filterValue = column.getFilterValue();
  const globalFilter = table.getState()?.globalFilter;

  // Handle file changes
  if (isFileChange) {
    if (value === 'N/A') {
      return (
        <span
          style={
            historyType === 'old' ? { textDecoration: 'line-through' } : {}
          }
        >
          N/A
        </span>
      );
    }
    return renderFileChange(value, historyType === 'old');
  }

  if (
    ['Communities Added', 'Communities Removed'].includes(field) &&
    Array.isArray(value)
  ) {
    const isRemoved = field === 'Communities Removed';
    return CommunitiesCell(
      historyType === 'old' ? 'bc_geographic_name' : 'economic_region',
      historyType === 'old' ? 'geographic_type' : 'regional_district',
      value,
      isRemoved,
      [filterValue, globalFilter]
    );
  }
  // For all other values, wrap in a span with strikethrough
  // Ensure we never return an object as a React child
  // Check if it's a React element first
  if (React.isValidElement(renderedCellValue)) {
    return (
      <span
        style={historyType === 'old' ? { textDecoration: 'line-through' } : {}}
      >
        {renderedCellValue}
      </span>
    );
  }

  const displayValue =
    typeof renderedCellValue === 'object' && renderedCellValue !== null
      ? JSON.stringify(renderedCellValue)
      : renderedCellValue;
  return (
    <span
      style={historyType === 'old' ? { textDecoration: 'line-through' } : {}}
    >
      {displayValue}
    </span>
  );
};

const OldValueCell = (props) => (
  <HistoryValueCell {...props} historyType="old" />
);

const ProjectChangeLog: React.FC<Props> = () => {
  const enableTimeMachine =
    getConfig()?.publicRuntimeConfig?.ENABLE_MOCK_TIME || false;
  const tableHeightOffset = enableTimeMachine ? '435px' : '360px';
  const filterVariant = 'contains';
  const enableProjectTypeFilters =
    useFeature('filter_changelog_by_project_type').value || false;
  const defaultFilters = [{ id: 'program', value: ['CCBC', 'CBC', 'OTHER'] }];
  const [columnFilters, setColumnFilters] =
    useState<MRT_ColumnFiltersState>(defaultFilters);

  // Use the caching hook instead of local state and useEffect
  const { data: allData, isLoading, error, refreshData } = useChangeLogCache();

  const isLargeUp = useMediaQuery('(min-width:1007px)');

  // Show error if needed
  if (error) {
    reportClientError(error, {
      source: 'project-change-log',
      metadata: { message: error.message },
    });
  }

  const { tableData } = useMemo(() => {
    // Return empty data if data is not available
    if (!allData?.allCbcs || !allData?.allApplications) {
      return { tableData: [] };
    }
    const mergeChildrenByRecordId = buildMergeChildrenMap(
      allData.allApplications
    );
    const allCbcsFlatMap =
      allData.allCbcs?.map((item) => {
        const { record, oldRecord, createdAt, op, ts } = item;
        const projectNumber = record?.project_number;
        const rowId = record?.cbc_id;
        const effectiveDate =
          op === 'UPDATE'
            ? new Date(record?.updated_at || ts)
            : new Date(createdAt);

        const base = {
          changeId: `${projectNumber}-${createdAt}`,
          id: rowId,
          _sortDate: effectiveDate,
          program: 'CBC',
          isCbcProject: true,
        };

        const json = {
          ...record?.json_data,
          project_number: record?.project_number,
        };
        const prevJson = {
          ...oldRecord?.json_data,
          project_number: oldRecord?.project_number,
        };

        const diffRows = generateRawDiff(
          diff(prevJson, json, { keepUnchangedValues: true }),
          cbcData,
          [
            'id',
            'created_at',
            'updated_at',
            'change_reason',
            'cbc_data_id',
            'locations',
            'errorLog',
            'error_log',
            'projectNumber',
          ],
          'cbcData'
        ).filter((row) => row.oldValue !== row.newValue);

        const meta = {
          createdAt: DateTime.fromJSDate(effectiveDate).toLocaleString(
            DateTime.DATETIME_MED
          ),
          createdAtDate: effectiveDate, // Raw date for filtering
          createdBy: formatUser(item),
        };

        const mappedRows = diffRows.map((row, i) => ({
          ...base,
          rowId: projectNumber,
          isVisibleRow: i === 0, // For visual use only
          createdAt: meta.createdAt,
          createdAtDate: meta.createdAtDate,
          createdBy: meta.createdBy,
          field: row.field,
          newValue: row.newValue,
          oldValue: row.oldValue,
          section: getCbcSectionFromKey(row.key || row.field),
        }));

        const added = record?.added_communities ?? [];
        const removed = record?.deleted_communities ?? [];

        const hasMappedRows = mappedRows.length > 0;
        const showMetaForRemoved = !hasMappedRows && !added.length;

        const communityRow = (
          label: string,
          values: any[],
          showMeta: boolean
        ) =>
          values.length
            ? [
                {
                  ...base,
                  rowId: projectNumber,
                  isVisibleRow: showMeta, // For visual use only
                  createdAt: meta.createdAt,
                  createdAtDate: meta.createdAtDate,
                  createdBy: meta.createdBy,
                  field: label,
                  newValue: values,
                  oldValue: values,
                  // passing a string of values for communities for filtering purpose
                  oldValueString: communityArrayToHistoryString(values, [
                    'bc_geographic_name',
                    'geographic_type',
                  ]),
                  newValueString: communityArrayToHistoryString(values, [
                    'economic_region',
                    'regional_district',
                  ]),
                  section: getCbcSectionFromKey(
                    label === 'Communities Added'
                      ? 'added_communities'
                      : 'deleted_communities'
                  ),
                },
              ]
            : [];

        return {
          _sortDate: effectiveDate,
          group: [
            ...mappedRows,
            ...communityRow('Communities Added', added, !hasMappedRows),
            ...communityRow('Communities Removed', removed, showMetaForRemoved),
          ],
        };
      }) || [];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const allApplicationsFlatMap =
      allData.allApplications
        ?.filter((item) => {
          // Exclude attachment table and tables without proper schema config
          const assessmentType =
            item.record?.json_data?.assessmentType || item.record?.item;
          const tableConfig = getTableConfig(item.tableName, assessmentType);
          return (
            item.tableName !== 'attachment' &&
            tableConfig !== null &&
            tableConfig?.schema !== null &&
            item.ccbcNumber !== null
          );
        })
        // Filter based on new logic: find "received" status and filter by row ID
        ?.filter((item) => {
          const isApplicant =
            item.record?.user_info?.session_sub?.includes('bceid') &&
            item.record?.user_info?.external_analyst !== true;

          // Always ignore all applicant changes for application_dependencies
          if (isApplicant && item.tableName === 'application_dependencies') {
            return false;
          }

          // Find the "received" status record for this application
          const receivedStatusRecord = allData.allApplications?.find(
            (statusItem) =>
              statusItem.tableName === 'application_status' &&
              statusItem.ccbcNumber === item.ccbcNumber &&
              statusItem.record?.status === 'received'
          );

          // For form_data with rowId >= receivedStatusRecord.rowId, always include
          if (
            item.tableName === 'form_data' &&
            Number(item.rowId) >= Number(receivedStatusRecord.rowId)
          ) {
            return true;
          }

          // Find the "submitted" status record for this application
          const submittedStatusRecord = allData.allApplications?.find(
            (statusItem) =>
              statusItem.tableName === 'application_status' &&
              statusItem.ccbcNumber === item.ccbcNumber &&
              statusItem.record?.status === 'submitted'
          );

          // If we found a "received" status record, filter by row ID
          if (receivedStatusRecord) {
            // Exception: For form_data with rowId lower than received status rowId, check timestamps
            if (
              item.tableName === 'form_data' &&
              Number(item.rowId) < Number(receivedStatusRecord.rowId)
            ) {
              const itemTime = new Date(item.ts).getTime();
              const receivedTime = new Date(receivedStatusRecord.ts).getTime();
              const twoMinutesInMs = 2 * 60 * 1000; // 2 minutes in milliseconds

              // First check for exact timestamp match with received status
              if (item.ts === receivedStatusRecord.ts) {
                return true;
              }

              const timeDifferenceReceived = Math.abs(itemTime - receivedTime);

              // Check against received status (2 minutes before and after)
              if (timeDifferenceReceived <= twoMinutesInMs) {
                return true;
              }

              // Check against submitted status if it exists (2 minutes before and after)
              if (submittedStatusRecord) {
                const submittedTime = new Date(
                  submittedStatusRecord.ts
                ).getTime();

                // First check for exact timestamp match with submitted status
                if (itemTime === submittedTime) {
                  return true;
                }

                const timeDifferenceSubmitted = Math.abs(
                  itemTime - submittedTime
                );

                if (timeDifferenceSubmitted <= twoMinutesInMs) {
                  return true;
                }
              }

              // If no timestamp matches found and rowId is lower, filter it out
              return false;
            }

            // If the current item's row ID is less than the received status row ID, ignore it
            if (Number(item.rowId) < Number(receivedStatusRecord.rowId)) {
              return false;
            }
          }

          return true;
        })
        // Join step: Find previous records for INSERT operations with null oldRecord
        ?.map((item, index, array) => {
          if (item.op === 'INSERT' && !item.oldRecord) {
            // Look for matching items from the remaining array (similar to historyProcessing.ts)
            const remainingItems = array.slice(index + 1);
            const matchingItems = remainingItems.filter((previousItem) => {
              // Basic table and ccbc_number match
              if (previousItem.ccbcNumber !== item.ccbcNumber) {
                return false;
              }

              // assessment data must match by item type
              if (item.tableName === 'assessment_data') {
                return (
                  previousItem.tableName === item.tableName &&
                  previousItem.record?.item === item.record?.item
                );
              }
              // rfis must match by rfi_number
              if (item.tableName === 'rfi_data') {
                return (
                  previousItem.tableName === item.tableName &&
                  previousItem.record?.rfi_number === item.record?.rfi_number &&
                  previousItem.op === 'INSERT'
                );
              }
              // Helper function to check quarter and year matching for date-based tables
              const checkQuarterYearMatch = () => {
                const quarter =
                  item.record?.json_data?.dueDate &&
                  getFiscalQuarter(item.record.json_data.dueDate);
                const year =
                  item.record?.json_data?.dueDate &&
                  getFiscalYear(item.record.json_data.dueDate);
                const updated =
                  previousItem.tableName === item.tableName &&
                  previousItem.op === 'INSERT' &&
                  getFiscalQuarter(previousItem.record?.json_data?.dueDate) ===
                    quarter &&
                  getFiscalYear(previousItem.record?.json_data?.dueDate) ===
                    year;
                return updated;
              };

              // community reports must match by quarter
              if (
                item.tableName === 'application_community_progress_report_data'
              ) {
                return checkQuarterYearMatch();
              }
              // application milestone needs to match by quarter
              if (item.tableName === 'application_milestone_data') {
                return checkQuarterYearMatch();
              }
              // change request data must match by amendment number
              if (item.tableName === 'change_request_data') {
                return (
                  previousItem.tableName === item.tableName &&
                  previousItem.record?.json_data?.amendmentNumber ===
                    item.record?.json_data?.amendmentNumber
                );
              }
              // application status must match by status type (external vs internal)
              if (item.tableName === 'application_status') {
                if (previousItem.tableName !== item.tableName) {
                  return false;
                }

                // Special case: 'received' status can match both external and internal
                const currentStatus = item.record?.status;
                const previousStatus = previousItem.record?.status;

                if (
                  currentStatus === 'received' ||
                  previousStatus === 'received'
                ) {
                  return true; // 'received' matches with any status type
                }

                // Check if current status is external (applicant_, withdrawn, submitted)
                const currentIsExternal =
                  currentStatus?.includes('applicant_') ||
                  currentStatus === 'withdrawn' ||
                  currentStatus === 'submitted';

                // Check if previous status is external (applicant_, withdrawn, submitted)
                const previousIsExternal =
                  previousStatus?.includes('applicant_') ||
                  previousStatus === 'withdrawn' ||
                  previousStatus === 'submitted';

                // Both must be the same type (external or internal)
                return currentIsExternal === previousIsExternal;
              }
              // Default: match by table name
              return previousItem.tableName === item.tableName;
            });

            // Get the first matching item (most recent)
            const matchingItem =
              matchingItems.length > 0 ? matchingItems[0] : null;

            if (matchingItem) {
              return {
                ...item,
                oldRecord: matchingItem.record,
              };
            }
          }
          return item;
        })
        ?.map((item) => {
          const {
            record,
            oldRecord,
            createdAt,
            op,
            ts,
            tableName,
            ccbcNumber,
            applicationId,
            program,
          } = item;
          const effectiveDate =
            op === 'UPDATE'
              ? new Date(record?.updated_at || ts)
              : new Date(createdAt);

          // Determine section name - for assessment_data, include the assessment type
          let sectionName = getLabelForType(tableName);
          let overrideField = null;
          const assessmentType =
            record?.json_data?.assessmentType || record?.item;
          if (tableName === 'assessment_data' && assessmentType) {
            // Capitalize the first letter of assessment type
            const capitalizedType =
              assessmentType.charAt(0).toUpperCase() + assessmentType.slice(1);
            sectionName = `${capitalizedType} Assessment`;
          }
          // override section for application dependencies
          if (tableName === 'application_dependencies' && assessmentType) {
            sectionName = 'Technical Assessment';
          }

          const base = {
            changeId: `${ccbcNumber}-${createdAt}-${tableName}`,
            id: applicationId,
            _sortDate: effectiveDate,
            program: program || 'CCBC',
            isCbcProject: false,
            section: sectionName,
          };

          // Get table configuration
          const tableConfig = getTableConfig(tableName, assessmentType);

          let diffRows = [];

          if (tableName === 'application_merge') {
            const recordParentId = record?.parent_application_id;
            const oldParentId = oldRecord?.parent_application_id;
            const mergeChildren = mergeChildrenByRecordId.get(
              getMergeChildrenKey(item, applicationId)
            );
            const isRemoval =
              !!record?.archived_at &&
              oldRecord?.parent_application === record?.parent_application;
            const isParentHistory =
              applicationId === recordParentId || applicationId === oldParentId;
            const isOldParentHistory =
              applicationId === oldParentId && applicationId !== recordParentId;
            const parentChanged =
              (recordParentId != null &&
                oldParentId != null &&
                recordParentId !== oldParentId) ||
              record?.parent_cbc_id !== oldRecord?.parent_cbc_id;

            const excluded = tableConfig?.excludedKeys ?? [];
            const parentHistoryExcluded = [
              'parent_application',
              'parent_ccbc_number',
              'parent_cbc_project_number',
            ];
            const childHistoryExcluded = [
              'child_ccbc_number',
              'child_ccbc_numbers',
              'child_cbc_project_number',
              'child_application',
              'parent_ccbc_number',
              'parent_cbc_project_number',
            ];

            const excludedKeys = [
              ...excluded,
              ...(isParentHistory
                ? parentHistoryExcluded
                : childHistoryExcluded),
            ];

            // main diff
            diffRows = generateRawDiff(
              diff(oldRecord ?? {}, record ?? {}, {
                keepUnchangedValues: true,
              }),
              tableConfig?.schema ?? {},
              excludedKeys,
              tableConfig?.overrideParent ?? tableName
            );

            // removal or update
            if ((isRemoval || parentChanged) && diffRows.length === 0) {
              const childNumber =
                oldRecord?.child_ccbc_number ?? record?.child_ccbc_number;
              if (isParentHistory) {
                const isParentRemoval = isRemoval || isOldParentHistory;
                diffRows = [
                  {
                    key: 'child_ccbc_number',
                    field: 'Child Application',
                    newValue: isParentRemoval ? 'N/A' : childNumber,
                    oldValue: isParentRemoval ? childNumber : 'N/A',
                  },
                ];
              } else if (isRemoval) {
                const removedParent =
                  oldRecord?.parent_application ?? record?.parent_application;
                diffRows = [
                  {
                    key: 'parent_application',
                    field: 'Parent application',
                    newValue: 'N/A',
                    oldValue: removedParent,
                  },
                ];
              }
            }
            if (isParentHistory && mergeChildren) {
              const oldChildren = mergeChildren.before ?? [];
              const newChildren = mergeChildren.after ?? [];
              const oldChildrenValue = oldChildren.join(', ');
              const newChildrenValue = newChildren.join(', ');
              const childrenListChanged = oldChildrenValue !== newChildrenValue;
              const childListRow = {
                key: 'children',
                field: 'Child Application',
                newValue: newChildren.length ? newChildrenValue : 'N/A',
                oldValue: oldChildren.length ? oldChildrenValue : 'N/A',
              };

              const isChildRow = (row: any) =>
                row.key === 'child_ccbc_number' ||
                row.field === 'Child Application';

              if (childrenListChanged) {
                diffRows = [
                  childListRow,
                  ...diffRows.filter((row) => !isChildRow(row)),
                ];
              } else if (isRemoval) {
                const childNumber =
                  oldRecord?.child_ccbc_number ?? record?.child_ccbc_number;
                const hasChildRow = diffRows.some(isChildRow);
                if (!hasChildRow && childNumber) {
                  diffRows = [
                    {
                      key: 'child_ccbc_number',
                      field: 'Child Application',
                      newValue: 'N/A',
                      oldValue: childNumber,
                    },
                    ...diffRows,
                  ];
                }
              }
            }
            // Special handling for application_communities
          } else if (tableName === 'application_communities') {
            const changes = diff(oldRecord || {}, record || {});
            const [newArray, oldArray] = processArrayDiff(
              changes,
              communities.applicationCommunities
            );

            const processCommunity = (values) => {
              return values?.map((community) => ({
                economic_region: community.er,
                regional_district: community.rd,
              }));
            };

            if (newArray.length > 0) {
              diffRows.push({
                field: 'Communities Added',
                newValue: processCommunity(newArray),
                oldValue: 'N/A',
              });
            }

            if (oldArray.length > 0) {
              diffRows.push({
                field: 'Communities Removed',
                newValue: 'N/A',
                oldValue: processCommunity(oldArray),
              });
            }
            // special handling for application status
          } else if (tableName === 'application_status') {
            const isExternal =
              record?.status?.includes('applicant_') ||
              record?.status === 'withdrawn';
            diffRows = generateRawDiff(
              diff(
                {
                  status: oldRecord?.status || null,
                },
                { status: record?.status || null },
                { keepUnchangedValues: true }
              ),
              tableConfig.schema,
              tableConfig.excludedKeys,
              tableConfig.overrideParent || tableName
            ).filter((row) => row.oldValue !== row.newValue);
            overrideField = isExternal ? 'External Status' : 'Internal Status';
            // special handling for analyst lead
          } else if (tableName === 'application_analyst_lead') {
            diffRows = generateRawDiff(
              diff(
                {
                  analyst_lead: oldRecord?.item || null,
                },
                {
                  analyst_lead: record?.item || assessmentType || null,
                },
                { keepUnchangedValues: true }
              ),
              tableConfig.schema,
              tableConfig.excludedKeys,
              tableConfig.overrideParent || tableName
            ).filter((row) => row.oldValue !== row.newValue);
          } else if (tableName === 'application_project_type') {
            diffRows = generateRawDiff(
              diff(
                {
                  project_type: oldRecord?.project_type || null,
                },
                {
                  project_type: record?.project_type || null,
                },
                { keepUnchangedValues: true }
              ),
              tableConfig.schema,
              tableConfig.excludedKeys,
              tableConfig.overrideParent || tableName
            )
              .map((row) => ({
                ...row,
                newValue: formatProjectType(row.newValue),
                oldValue: formatProjectType(row.oldValue),
              }))
              .filter((row) => row.oldValue !== row.newValue);
            overrideField = 'Project Type';
          } else if (tableName === 'application_package') {
            diffRows = generateRawDiff(
              diff(
                {
                  package: oldRecord?.package || null,
                },
                {
                  package: record?.package || null,
                },
                { keepUnchangedValues: true }
              ),
              tableConfig.schema,
              tableConfig.excludedKeys,
              tableConfig.overrideParent || tableName
            ).filter((row) => row.oldValue !== row.newValue);
          } else {
            // Standard processing for other tables
            let json = {};
            let prevJson = {};

            // Handle different data sources based on table type
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
              tableName === 'application_dependencies'
            ) {
              json = record?.json_data || {};
              prevJson = oldRecord?.json_data || {};

              // Exclude form_data entries when prevJson is empty
              if (
                tableName === 'form_data' &&
                Object.keys(prevJson).length === 0
              ) {
                return {
                  _sortDate: effectiveDate,
                  group: [], // Return empty group to exclude this entry
                };
              }
            } else {
              // For other tables, use the record directly
              json = record || {};
              prevJson = oldRecord || {};
            }

            diffRows = generateRawDiff(
              diff(prevJson, json, { keepUnchangedValues: true }),
              tableConfig?.schema || {},
              tableConfig?.excludedKeys || [],
              tableName === 'form_data'
                ? null
                : tableConfig?.overrideParent || tableName
            ).filter((row) => row.oldValue !== row.newValue);
          }

          const meta = {
            createdAt: DateTime.fromJSDate(effectiveDate).toLocaleString(
              DateTime.DATETIME_MED
            ),
            createdAtDate: effectiveDate,
            createdBy: formatUser(item),
          };

          const mappedRows = diffRows.map((row, i) => ({
            ...base,
            rowId: ccbcNumber,
            isVisibleRow: i === 0, // For visual use only
            createdAt: meta.createdAt,
            createdBy: meta.createdBy,
            createdAtDate: meta.createdAtDate,
            field: overrideField || row?.field || '',
            newValue:
              tableName === 'application_status'
                ? convertStatus(row.newValue)
                : row.newValue,
            oldValue:
              tableName === 'application_status'
                ? convertStatus(row.oldValue)
                : row.oldValue,
            section: sectionName,
          }));

          // Process file changes for tables that have file support
          const fileFields = getFileFieldsForTable(tableName, assessmentType);
          const fileRows = fileFields.flatMap((fileField) => {
            const [currentFiles, previousFiles] = getFileArraysFromRecord(
              record,
              oldRecord,
              tableName,
              fileField.field
            );
            const fileChanges = generateFileChanges(
              currentFiles,
              fileField.title,
              previousFiles
            );

            return fileChanges.map((change, changeIndex) => ({
              ...base,
              rowId: ccbcNumber,
              isVisibleRow: changeIndex === 0 && mappedRows.length === 0,
              createdAt: meta.createdAt,
              createdBy: meta.createdBy,
              createdAtDate: meta.createdAtDate,
              field: change?.field || '',
              newValue: change.type === 'deleted' ? 'N/A' : change,
              oldValue: change.type === 'added' ? 'N/A' : change,
              isFileChange: true,
            }));
          });

          return {
            _sortDate: effectiveDate,
            group: [...mappedRows, ...fileRows],
          };
        })
        .filter((item) => item.group.length > 0) || []; // Only include items with actual changes

    const entries = [...allCbcsFlatMap, ...allApplicationsFlatMap];

    const tableData = entries
      .sort((a, b) => b._sortDate.getTime() - a._sortDate.getTime())
      .flatMap((entry, i) =>
        entry.group.map((row) => ({
          ...row,
          isEvenGroup: i % 2 === 0,
        }))
      );

    return { tableData };
  }, [allData]);

  // Collect unique createdBy values for the multi-select filter
  const createdByOptions = useMemo(() => {
    const set = new Set<string>();
    tableData.forEach((row) => {
      if (row.createdBy) set.add(row.createdBy);
    });
    return Array.from(set).sort();
  }, [tableData]);

  // Collect unique program values for the multi-select filter
  const programOptions = useMemo(() => {
    const set = new Set<string>();
    tableData.forEach((row) => {
      if (row.program) set.add(row.program);
    });
    return Array.from(set).sort();
  }, [tableData]);

  // Collect unique section values for the multi-select filter
  const sectionOptions = useMemo(() => {
    const set = new Set<string>();
    tableData.forEach((row: any) => {
      if (row.section) set.add(row.section);
    });
    return Array.from(set).sort();
  }, [tableData]);

  // Custom filter function for program
  const programFilterFn = (row, columnId, filterValues) => {
    const rowValue = row.getValue(columnId);

    // If no filter values are selected, show nothing
    if (!filterValues || filterValues.length === 0) {
      return false;
    }

    // If all program options are selected, show everything
    if (filterValues.length === programOptions.length) {
      return true;
    }

    // Check if the row's program value is included in the selected filter values
    return filterValues.includes(rowValue);
  };

  const columns: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'rowId',
      id: 'rowId',
      Cell: ProjectIdCell,
      header: 'ID',
      filterFn: filterVariant,
    },
    {
      accessorKey: 'program',
      filterFn: programFilterFn,
      header: 'Program',
      Cell: MergedCell,
    },
    {
      // accessorKey: 'section',
      accessorFn: (row) => row?.section || 'N/A',
      header: 'Section',
      filterFn: filterVariant,
      filterVariant: 'multi-select',
      filterSelectOptions: sectionOptions,
    },
    {
      accessorKey: 'field',
      header: 'Fields changed',
      filterFn: filterVariant,
    },
    {
      accessorKey: 'oldValue',
      header: 'Old Value',
      Cell: OldValueCell,
      filterFn: filterVariant,
    },
    {
      accessorKey: 'newValue',
      header: 'New Value',
      Cell: HistoryValueCell,
      filterFn: filterVariant,
    },
    {
      accessorKey: 'createdBy',
      header: 'User',
      filterFn: filterVariant,
      filterVariant: 'multi-select',
      filterSelectOptions: createdByOptions,
      Cell: MergedCell,
    },
    {
      accessorKey: 'createdAt',
      header: 'Date and Time',
      filterVariant: 'date-range',
      filterFn: (row, _columnId, filterValues) => {
        const { createdAtDate } = row.original;
        const [startDate, endDate] = filterValues;

        if (!createdAtDate) return false;
        if (!startDate && !endDate) return true;

        const rowDate = new Date(createdAtDate);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && end) {
          return rowDate >= start && rowDate <= end;
        }
        if (start) {
          return rowDate >= start;
        }
        if (end) {
          return rowDate <= end;
        }
        return true;
      },
      Cell: MergedCell,
    },
  ];

  const columnSizing: MRT_ColumnSizingState = {
    rowId: 50,
    createdAt: 250,
    createdBy: 110,
    field: 108,
  };

  const state = {
    showColumnFilters: true,
    columnFilters,
    isLoading,
    showGlobalFilter: true,
    columnSizing,
    columnVisibility: {
      program: false,
    },
  };

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    state,
    muiTableContainerProps: {
      sx: {
        padding: '0 8px 8px 8px',
        maxHeight: `calc(100vh - ${tableHeightOffset})`,
      },
    },
    layoutMode: isLargeUp ? 'grid' : 'semantic',
    muiTableBodyCellProps,
    muiTableHeadCellProps,
    muiTableBodyRowProps,
    enableColumnResizing: true,
    enableRowVirtualization: true,
    rowVirtualizerOptions: { overscan: 50 },
    columnResizeMode: 'onChange',
    enableStickyHeader: true,
    autoResetAll: false,
    enablePagination: false,
    enableGlobalFilter: true,
    globalFilterFn: filterVariant,
    enableBottomToolbar: false,
    onColumnFiltersChange: setColumnFilters,
    renderToolbarInternalActions: ({ table }) => (
      <Box>
        <Tooltip title="Refresh data">
          <IconButton onClick={refreshData} disabled={isLoading}>
            <Refresh />
          </IconButton>
        </Tooltip>
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
      </Box>
    ),
    renderTopToolbarCustomActions: () => (
      <StyledTableHeader>
        <ClearFilters
          table={table}
          filters={table.getState().columnFilters}
          defaultFilters={defaultFilters}
        />
        <AdditionalFilters
          filters={columnFilters}
          setFilters={setColumnFilters}
          disabledFilters={
            !isLoading && enableProjectTypeFilters
              ? []
              : [{ id: 'program', value: ['CCBC', 'CBC', 'OTHER'] }]
          }
        />
      </StyledTableHeader>
    ),
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MaterialReactTable table={table} />
    </LocalizationProvider>
  );
};

export default ProjectChangeLog;
