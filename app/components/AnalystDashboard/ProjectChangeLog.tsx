/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/jsx-pascal-case */
import { useMemo, useState } from 'react';
import { graphql, useFragment } from 'react-relay';
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
import { ProjectChangeLog_query$key } from '__generated__/ProjectChangeLog_query.graphql';
import { diff } from 'json-diff';
import { generateRawDiff, processArrayDiff } from 'components/DiffTable';
import getConfig from 'next/config';
import cbcData from 'formSchema/uiSchema/history/cbcData';
import applicationDiffSchema from 'formSchema/uiSchema/history/application';
import applicationGisDataSchema from 'formSchema/uiSchema/history/applicationGisData';
import rfiDiffSchema from 'formSchema/uiSchema/history/rfi';
import projectInformationSchema from 'formSchema/uiSchema/history/projectInformation';
import conditionalApprovalSchema from 'formSchema/uiSchema/history/conditionalApproval';
import screeningSchema from 'formSchema/uiSchema/history/screening';
import gis from 'formSchema/uiSchema/history/gis';
import gisAssessmentHhSchema from 'formSchema/uiSchema/history/gisAssessmentHh';
import applicationSowDataSchema from 'formSchema/uiSchema/history/applicationSowData';
import applicationAnnounced from 'formSchema/uiSchema/history/applicationAnnounced';
import fnhaContribution from 'formSchema/uiSchema/history/fnhaContribution';
import communities from 'formSchema/uiSchema/history/communities';
import styled from 'styled-components';
import { Box, Link, TableCellProps } from '@mui/material';
import { DateTime } from 'luxon';
import { processHistoryItems, formatUserName } from 'utils/historyProcessing';
import ClearFilters from 'components/Table/ClearFilters';
import { getLabelForType } from 'components/Analyst/History/HistoryFilter';
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

  return isVisibleRow ? renderedCellValue : null;
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
    ? 'The System'
    : `${item.ccbcUserByCreatedBy?.givenName} ${item.ccbcUserByCreatedBy?.familyName}`;
};

const communityArrayToHistoryString = (
  communitiesArray: any[],
  keys: string[]
) =>
  communitiesArray.map((obj) => keys.map((key) => obj?.[key] ?? '').join(' '));
// Define inline schemas for simple cases
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

const applicationDependenciesSchema = {
  applicationDependencies: {
    properties: {
      crtcProjectDependent: { title: 'CRTC Project Dependent' },
      connectedCoastNetworkDependent: {
        title: 'Connected Coast Network Dependent',
      },
    },
  },
};

// Map table names to their schemas and excluded keys
const getTableConfig = (tableName: string, assessmentType?: string) => {
  const configs = {
    rfi_data: {
      schema: rfiDiffSchema,
      excludedKeys: [
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
      ],
      overrideParent: 'rfi',
    },
    application_announced: {
      schema: applicationAnnounced,
      excludedKeys: [
        'id',
        'updated_at',
        'created_at',
        'created_by',
        'updated_by',
        'archived_at',
        'archived_by',
      ],
      overrideParent: 'applicationAnnounced',
    },
    form_data: {
      schema: applicationDiffSchema,
      excludedKeys: [
        'id',
        'createdAt',
        'updatedAt',
        'applicationId',
        'acknowledgements',
        'supportingDocuments',
        'coverage',
        'templateUploads',
      ],
    },
    application_dependencies: {
      schema: applicationDependenciesSchema,
      excludedKeys: ['id', 'createdAt', 'updatedAt', 'applicationId'],
      overrideParent: 'applicationDependencies',
    },
    assessment_data: {
      schema: (() => {
        if (assessmentType === 'screening') return screeningSchema;
        if (assessmentType === 'gis') return gis;
        return null;
      })(),
      excludedKeys: [
        'id',
        'name',
        'size',
        'type',
        'uuid',
        'uploadedAt',
        'otherFiles',
        'assessmentTemplate',
      ],
      overrideParent: assessmentType,
    },
    conditional_approval_data: {
      schema: conditionalApprovalSchema,
      excludedKeys: [
        'id',
        'createdAt',
        'updatedAt',
        'uploadedAt',
        'size',
        'name',
        'uuid',
        'type',
        'letterOfApprovalUpload',
      ],
      overrideParent: 'conditionalApproval',
    },
    application_gis_data: {
      schema: applicationGisDataSchema,
      excludedKeys: ['ccbc_number'],
      overrideParent: 'gis',
    },
    application_gis_assessment_hh: {
      schema: gisAssessmentHhSchema,
      excludedKeys: [
        'id',
        'updated_at',
        'created_at',
        'created_by',
        'updated_by',
        'archived_at',
        'archived_by',
      ],
      overrideParent: 'gis',
    },
    project_information_data: {
      schema: projectInformationSchema,
      excludedKeys: [
        'statementOfWorkUpload',
        'sowWirelessUpload',
        'fundingAgreementUpload',
        'finalizedMapUpload',
        'otherFiles',
      ],
      overrideParent: 'projectInformation',
    },
    application_sow_data: {
      schema: applicationSowDataSchema,
      excludedKeys: [
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
      ],
      overrideParent: 'application_sow_data',
    },
    application_community_progress_report_data: {
      schema: communityReportSchema,
      excludedKeys: ['ccbc_number', 'progressReportFile'],
      overrideParent: 'communityReport',
    },
    application_milestone_data: {
      schema: communityReportSchema,
      excludedKeys: [
        'ccbc_number',
        'milestoneFile',
        'evidenceOfCompletionFile',
      ],
      overrideParent: 'communityReport',
    },
    application_pending_change_request: {
      schema: pendingChangeRequestSchema,
      excludedKeys: [
        'id',
        'created_at',
        'updated_at',
        'created_by',
        'updated_by',
        'archived_at',
        'archived_by',
        'is_pending',
      ],
      overrideParent: 'pendingChangeRequest',
    },
    application_fnha_contribution: {
      schema: fnhaContribution,
      excludedKeys: [
        'id',
        'updated_at',
        'created_at',
        'created_by',
        'updated_by',
        'archived_at',
        'archived_by',
        'reason_for_change',
      ],
      overrideParent: 'fnhaContribution',
    },
    application_communities: {
      schema: communities.applicationCommunities,
      excludedKeys: [],
      overrideParent: 'applicationCommunities',
    },
  };

  return configs[tableName] || null;
};

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

// OldValueCell moved out of ProjectChangeLog to avoid defining components during render
const HistoryValueCell = ({
  row,
  column,
  renderedCellValue,
  table,
  historyType = 'new',
}) => {
  const { field, oldValue, newValue } = row.original;
  const value = historyType === 'old' ? oldValue : newValue;
  const filterValue = column.getFilterValue();
  const globalFilter = table.getState()?.globalFilter;

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
  return historyType === 'old' ? (
    <span style={{ textDecoration: 'line-through' }}>{renderedCellValue}</span>
  ) : (
    renderedCellValue
  );
};

const OldValueCell = (props) => (
  <HistoryValueCell {...props} historyType="old" />
);

const ProjectChangeLog: React.FC<Props> = ({ query }) => {
  const queryFragment = useFragment<ProjectChangeLog_query$key>(
    graphql`
      fragment ProjectChangeLog_query on Query {
        allCbcs(first: 1) {
          nodes {
            rowId
            projectNumber
            history {
              nodes {
                op
                createdAt
                createdBy
                id
                record
                oldRecord
                tableName
                ccbcUserByCreatedBy {
                  givenName
                  familyName
                }
              }
            }
          }
        }
        allApplications(first: 1) {
          nodes {
            rowId
            ccbcNumber
            program
            formData {
              jsonData
            }
            history {
              nodes {
                applicationId
                createdAt
                createdBy
                externalAnalyst
                familyName
                item
                givenName
                op
                record
                oldRecord
                recordId
                sessionSub
                tableName
              }
            }
            ccbcUserByCreatedBy {
              familyName
              givenName
            }
          }
        }
        session {
          authRole
        }
      }
    `,
    query
  );

  const enableTimeMachine =
    getConfig()?.publicRuntimeConfig?.ENABLE_MOCK_TIME || false;
  const tableHeightOffset = enableTimeMachine ? '435px' : '360px';
  const filterVariant = 'contains';
  const defaultFilters = [{ id: 'program', value: ['CBC', 'CCBC', 'OTHER'] }];
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const { allCbcs, allApplications } = queryFragment;
  const isLargeUp = useMediaQuery('(min-width:1007px)');

  const { tableData, totalLength } = useMemo(() => {
    let totalLength = 0;
    const allCbcsFlatMap =
      allCbcs?.nodes?.flatMap(
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
              section: 'Section',
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
              createdBy: formatUser(item),
            };

            const mappedRows = diffRows.map((row, i) => ({
              ...base,
              rowId: projectNumber,
              isVisibleRow: i === 0, // For visual use only
              createdAt: meta.createdAt,
              createdBy: meta.createdBy,
              field: row.field,
              newValue: row.newValue,
              oldValue: row.oldValue,
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
      allApplications?.nodes?.flatMap(
        ({ ccbcNumber, rowId, history, program }) => {
          // Apply HistoryTable preprocessing logic
          const processedHistory = processHistoryItems(history.nodes, {
            includeAttachments: false,
            applyUserFormatting: false,
          });

          return processedHistory
            .filter(({ historyItem }) => {
              // Exclude attachment table and tables without proper schema config
              const assessmentType =
                historyItem.record?.json_data?.assessmentType;
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
              totalLength++;
              const { record, createdAt, op, tableName } = historyItem;
              const effectiveDate =
                op === 'UPDATE'
                  ? new Date(record?.updated_at)
                  : new Date(createdAt);

              const base = {
                changeId: `${ccbcNumber}-${createdAt}-${tableName}`,
                id: rowId,
                _sortDate: effectiveDate,
                program: program || 'CCBC',
                section: getLabelForType(tableName),
                isCbcProject: false,
              };

              // Get table configuration
              const assessmentType = record?.json_data?.assessmentType;
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
                  tableConfig.overrideParent || tableName
                );
              }

              const meta = {
                createdAt: DateTime.fromJSDate(effectiveDate).toLocaleString(
                  DateTime.DATETIME_MED
                ),
                createdBy: formatUserName(historyItem).user,
              };

              const mappedRows = diffRows.map((row, i) => ({
                ...base,
                rowId: ccbcNumber,
                isVisibleRow: i === 0, // For visual use only
                createdAt: meta.createdAt,
                createdBy: meta.createdBy,
                field: row.field,
                newValue: row.newValue,
                oldValue: row.oldValue,
              }));

              return {
                _sortDate: effectiveDate,
                group: mappedRows,
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

    return { tableData, totalLength };
  }, [allCbcs, allApplications]);

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
      header: 'Program',
      filterFn: filterVariant,
      filterVariant: 'multi-select',
      filterSelectOptions: programOptions,
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
      accessorFn: (row) => row.oldValueString ?? row.oldValue,
      header: 'Old Value',
      Cell: OldValueCell,
      filterFn: filterVariant,
    },
    {
      accessorFn: (row) => row.newValueString ?? row.newValue,
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
      filterFn: filterVariant,
      Cell: MergedCell,
    },
  ];

  const columnSizing: MRT_ColumnSizingState = {
    rowId: 50,
    program: 80,
    createdAt: 104,
    createdBy: 110,
    field: 108,
  };

  const state = {
    showColumnFilters: true,
    columnFilters,
    showGlobalFilter: true,
    columnSizing,
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
          externalFilters={false}
        />
        <AdditionalFilters
          filters={columnFilters}
          setFilters={setColumnFilters}
          disabledFilters={[{ id: 'program', value: ['CCBC', 'CBC', 'OTHER'] }]}
        />
      </StyledTableHeader>
    ),
  });

  return (
    <>
      <div>TOTAL LENGTH: {totalLength}</div>
      <MaterialReactTable table={table} />
    </>
  );
};

export default ProjectChangeLog;
