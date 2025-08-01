/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/jsx-pascal-case */
import { useEffect, useMemo, useState } from 'react';
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
import styled from 'styled-components';
import {
  generateFileChanges,
  renderFileChange,
  getFileArraysFromRecord,
  getFileFieldsForTable,
} from 'utils/historyFileUtils';
import { Box, Link, TableCellProps } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTime } from 'luxon';
import { processHistoryItems, formatUserName } from 'utils/historyProcessing';
import { getTableConfig } from 'utils/historyTableConfig';
import ClearFilters from 'components/Table/ClearFilters';
import { getLabelForType } from 'components/Analyst/History/HistoryFilter';
import { convertStatus } from 'backend/lib/dashboard/util';
import * as Sentry from '@sentry/nextjs';
import { useFeature } from '@growthbook/growthbook-react';
import getCbcSectionFromKey from 'utils/historyCbcSection';
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
  const isSystem =
    item.createdBy === 1 &&
    (!item.ccbcUserByCreatedBy || !item.ccbcUserByCreatedBy?.givenName);
  return isSystem
    ? 'The system'
    : `${item.ccbcUserByCreatedBy?.givenName} ${item.ccbcUserByCreatedBy?.familyName}`;
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
  const [allData, setAllData] = useState({
    allCbcs: { nodes: [] },
    allApplications: { nodes: [] },
  });
  const [isLoading, setIsLoading] = useState(true);
  const isLargeUp = useMediaQuery('(min-width:1007px)');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/change-log');
        const data = await response.json();
        setAllData(data.data);
      } catch (error) {
        Sentry.captureException({
          name: 'Error getting change log data',
          message: error,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const { tableData } = useMemo(() => {
    // Return empty data if data is not available
    if (!allData.allCbcs || !allData.allApplications) {
      return { tableData: [] };
    }

    const allCbcsFlatMap =
      allData.allCbcs?.nodes?.flatMap(
        ({ projectNumber, rowId, history }) =>
          history.nodes.map((item) => {
            const { record, oldRecord, createdAt, op } = item;
            const effectiveDate =
              op === 'UPDATE'
                ? new Date(record?.updated_at)
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
            );

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
                ...communityRow(
                  'Communities Removed',
                  removed,
                  showMetaForRemoved
                ),
              ],
            };
          }) || []
      ) || [];

    const allApplicationsFlatMap =
      allData.allApplications?.nodes?.flatMap(
        ({ ccbcNumber, rowId, history, program }) => {
          // Apply HistoryTable preprocessing logic
          const processedHistory = processHistoryItems(history.nodes, {
            includeAttachments: false,
            applyUserFormatting: false,
          });

          return processedHistory
            .filter(({ historyItem }) => {
              // Exclude attachment table and tables without proper schema config
              const assessmentType = historyItem.item;
              const tableConfig = getTableConfig(
                historyItem.tableName,
                assessmentType
              );
              return (
                historyItem.tableName !== 'attachment' &&
                tableConfig !== null &&
                tableConfig.schema !== null
              );
            })
            .map(({ historyItem, prevHistoryItem }) => {
              const { record, createdAt, op, tableName, item } = historyItem;
              const effectiveDate =
                op === 'UPDATE'
                  ? new Date(record?.updated_at)
                  : new Date(createdAt);

              // Determine section name - for assessment_data, include the assessment type
              let sectionName = getLabelForType(tableName);
              if (tableName === 'assessment_data' && item) {
                // Capitalize the first letter of assessment type
                const capitalizedType =
                  item.charAt(0).toUpperCase() + item.slice(1);
                sectionName = `${capitalizedType} Assessment`;
              }
              // override section for application dependencies
              if (tableName === 'application_dependencies' && item) {
                sectionName = 'Technical Assessment';
              }

              const base = {
                changeId: `${ccbcNumber}-${createdAt}-${tableName}`,
                id: rowId,
                _sortDate: effectiveDate,
                program: program || 'CCBC',
                section: sectionName,
                isCbcProject: false,
              };

              // Get table configuration
              const assessmentType = item;

              const tableConfig = getTableConfig(tableName, assessmentType);

              let diffRows = [];

              // Special handling for application_communities
              if (tableName === 'application_communities') {
                const changes = diff(
                  prevHistoryItem?.record || {},
                  record || {}
                );
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
                diffRows = generateRawDiff(
                  diff(
                    {
                      status:
                        convertStatus(prevHistoryItem?.record?.status) || null,
                    },
                    { status: convertStatus(record?.status) || null },
                    { keepUnchangedValues: true }
                  ),
                  tableConfig.schema,
                  tableConfig.excludedKeys,
                  tableConfig.overrideParent || tableName
                );
                // special handling for analyst lead
              } else if (tableName === 'application_analyst_lead') {
                diffRows = generateRawDiff(
                  diff(
                    {
                      analyst_lead: prevHistoryItem?.item || null,
                    },
                    {
                      analyst_lead: item || null,
                    },
                    { keepUnchangedValues: true }
                  ),
                  tableConfig.schema,
                  tableConfig.excludedKeys,
                  tableConfig.overrideParent || tableName
                );
              } else if (tableName === 'application_package') {
                diffRows = generateRawDiff(
                  diff(
                    {
                      package: prevHistoryItem?.record?.package || null,
                    },
                    {
                      package: record?.package || null,
                    },
                    { keepUnchangedValues: true }
                  ),
                  tableConfig.schema,
                  tableConfig.excludedKeys,
                  tableConfig.overrideParent || tableName
                );
              } else {
                // Standard processing for other tables
                let json = {};
                let prevJson = {};

                // Handle different data sources based on table type
                // these are the tables we are processing everything else is getting ignored
                // or needs special handling
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
                  prevJson = prevHistoryItem?.record?.json_data || {};
                } else {
                  // For other tables, use the record directly
                  json = record || {};
                  prevJson = prevHistoryItem?.record || {};
                }

                diffRows = generateRawDiff(
                  diff(prevJson, json, { keepUnchangedValues: true }),
                  tableConfig.schema,
                  tableConfig.excludedKeys,
                  tableName === 'form_data'
                    ? null
                    : tableConfig.overrideParent || tableName
                );
              }

              const meta = {
                createdAt: DateTime.fromJSDate(effectiveDate).toLocaleString(
                  DateTime.DATETIME_MED
                ),
                createdAtDate: effectiveDate,
                createdBy: formatUserName(historyItem).user,
              };

              const mappedRows = diffRows.map((row, i) => ({
                ...base,
                rowId: ccbcNumber,
                isVisibleRow: i === 0, // For visual use only
                createdAt: meta.createdAt,
                createdBy: meta.createdBy,
                createdAtDate: meta.createdAtDate,
                field: row?.field || '',
                newValue: row.newValue,
                oldValue: row.oldValue,
              }));

              // Process file changes for tables that have file support
              const fileFields = getFileFieldsForTable(
                tableName,
                assessmentType
              );
              const fileRows = fileFields.flatMap((fileField) => {
                const [currentFiles, previousFiles] = getFileArraysFromRecord(
                  record,
                  prevHistoryItem?.record,
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
            .filter((item) => item.group.length > 0); // Only include items with actual changes
        }
      ) || [];

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
    tableData.forEach((row) => {
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
      accessorKey: 'section',
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
