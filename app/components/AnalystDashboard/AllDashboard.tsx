/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/jsx-pascal-case */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import cookie from 'js-cookie';
import useMediaQuery from '@mui/material/useMediaQuery';
import reportClientError from 'lib/helpers/reportClientError';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_DensityState,
  type MRT_SortingState,
  type MRT_VisibilityState,
  type MRT_ColumnSizingState,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  MRT_ShowHideColumnsButton,
  MRT_FilterFns,
  MRT_Row,
  MRT_RowVirtualizer,
} from 'material-react-table';
import RowCount from 'components/Table/RowCount';
import AssignLead from 'components/Analyst/AssignLead';
import StatusPill from 'components/StatusPill';
import statusStyles from 'data/statusStyles';
import StatusInformationIcon from 'components/Analyst/StatusInformationIcon';
import ClearFilters from 'components/Table/ClearFilters';
import type { AllDashboardTable_query$key } from '__generated__/AllDashboardTable_query.graphql';
import { Box, IconButton, MenuItem, TableCellProps } from '@mui/material';
import { useFeature } from '@growthbook/growthbook-react';
import getConfig from 'next/config';
import { DateTime } from 'luxon';
import { useToast } from 'components/AppProvider';
import { useRouter } from 'next/router';
import CbcCreateModal from 'components/Analyst/CBC/CbcCreateModal';
import CbcCreateIcon from 'components/Analyst/CBC/CbcCreateIcon';
import {
  getFundingSource,
  normalizeStatusName,
} from '../../backend/lib/dashboard/util';
import DownloadIcon from './DownloadIcon';
import { sortStatus, sortZones } from './AssessmentAssignmentTable';
import AdditionalFilters, {
  additionalFilterColumns,
} from './AdditionalFilters';
import AllDashboardDetailPanel from './AllDashboardDetailPanel';
import { cbcProjectStatusConverter } from '../../utils/formatStatus';

type Application = {
  ccbcNumber: string;
  applicationId: number;
  packageNumber?: number;
  projectTitle: string;
  organizationName: string;
  analystStatus: string;
  externalStatus: string;
  analystLead?: string;
  zones: readonly number[];
  communities: any[];
};

export const filterNumber = (row, id, filterValue) => {
  const numericProperty = Number(row.getValue(id));

  if (!numericProperty) {
    return false;
  }
  return numericProperty === Number(filterValue);
};

const StyledTableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const muiTableBodyCellProps = (props): TableCellProps => {
  const centeredCols = ['Package', 'zones', 'intakeNumber'];
  const isExpandColumn = props.column.id === 'mrt-row-expand';
  const isExpandedRow = props.row.getIsExpanded();
  return {
    align: centeredCols.includes(props.column.id) ? 'center' : 'left',
    sx: {
      padding: isExpandColumn ? '0 8px' : '8px 0px',
      borderBottom: isExpandedRow ? 'none' : '1px solid rgba(224, 224, 224, 1)',
    },
  };
};

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
    '& .MuiSelect-icon': {
      display: 'none',
    },
  },
};

const AnalystStatusCell = ({ cell }) => {
  const analystStatus = cell.row.original?.analystStatus;
  return <StatusPill status={analystStatus} styles={statusStyles} />;
};

const ApplicantStatusCell = ({ cell }) => {
  const analystStatus = cell.row.original?.externalStatus;
  return <StatusPill status={analystStatus} styles={statusStyles} />;
};

export const filterOutNullishs = (val) => val !== undefined && val !== null;

const toLabelValuePair = (value) =>
  value ? { label: value, value } : { label: 'Unassigned', value: '' };

const accessorFunctionGeneratorInjectsEmptyString = (accessorKey) => {
  return (row) => row[accessorKey] ?? '';
};

const statusFilter = (row, id, filterValue) => {
  if (filterValue.length === 0) {
    return true;
  }
  return filterValue.includes(row.getValue(id));
};

const filterMultiSelectZones = (row, id, filterValue) => {
  /// NOSONAR
  if (filterValue.length === 0) {
    return true;
  }
  const rowZones = row.getValue(id) ?? [];
  // find full subArray in the row.getValue
  // if requirements change for any in the zones should be met change to some
  return filterValue.some((zone) => rowZones.includes(Number(zone)));
};

const genericFilterMultiSelect = (row, id, filterValue) => {
  /// NOSONAR
  if (filterValue.length === 0) {
    return true;
  }
  const stringFilterValues = filterValue.map((value) => value?.toString());
  return stringFilterValues.includes(row.getValue(id)?.toString());
};

interface Props {
  query: any;
}

const AllDashboardTable: React.FC<Props> = ({ query }) => {
  /* ---- BEGIN DEBUG ---- */
  if (typeof window !== 'undefined') {
    const origin = window.location?.origin;
    const env =
      process?.env?.NODE_ENV ||
      (process?.env?.NEXT_PUBLIC_ENV as string) ||
      'unknown';
    if (!(window as any).__ccbcDashboardTableLogBoot) {
      (window as any).__ccbcDashboardTableLogBoot = true;
      console.log('[AllDashboardTable] boot', {
        origin,
        env,
        time: new Date().toISOString(),
      });
    }
  }
  /* ---- END DEGUG ---- */
  const queryFragment = useFragment<AllDashboardTable_query$key>(
    graphql`
      fragment AllDashboardTable_query on Query {
        ...AssignLead_query
        allApplicationStatusTypes {
          nodes {
            name
            statusOrder
          }
        }
        allApplications(
          first: 1000
          filter: { archivedAt: { isNull: true } }
          orderBy: CCBC_NUMBER_ASC
        ) {
          edges {
            node {
              organizationName
              package
              analystStatus
              externalStatus
              analystLead
              ccbcNumber
              rowId
              projectName
              intakeNumber
              program
              zones
              status
              applicationSowDataByApplicationId(
                condition: { archivedAt: null }
                last: 1
              ) {
                totalCount
                nodes {
                  id
                  jsonData
                  rowId
                  sowTab7SBySowId {
                    nodes {
                      rowId
                      jsonData
                      sowId
                    }
                  }
                  sowTab8SBySowId {
                    nodes {
                      rowId
                      jsonData
                      sowId
                    }
                  }
                }
              }
              applicationFormTemplate9DataByApplicationId {
                nodes {
                  jsonData
                }
              }
            }
          }
        }
        allCbcData(
          filter: { archivedAt: { isNull: true } }
          orderBy: PROJECT_NUMBER_ASC
        ) {
          edges {
            node {
              jsonData
              projectNumber
              cbcId
              cbcByCbcId {
                cbcProjectCommunitiesByCbcId(
                  filter: { archivedAt: { isNull: true } }
                ) {
                  nodes {
                    communitiesSourceDataByCommunitiesSourceDataId {
                      bcGeographicName
                      mapLink
                    }
                  }
                }
              }
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

  const AssignAnalystLead = useCallback(
    ({ cell }) => {
      const row = cell.row.original;
      const applicationId = row?.rowId || null;
      const { analystLead, isCbcProject } = row;
      return (
        <>
          {!isCbcProject ? (
            <AssignLead
              query={queryFragment}
              applicationId={applicationId}
              lead={analystLead}
            />
          ) : null}
        </>
      );
    },
    [queryFragment]
  );
  const { allApplications, allCbcData, allApplicationStatusTypes, session } =
    queryFragment;
  const { authRole } = session;
  const isLargeUp = useMediaQuery('(min-width:1007px)');
  const router = useRouter();

  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateCbcModalOpen, setIsCreateCbcModalOpen] = useState(false);
  const { showToast, hideToast } = useToast();

  const defaultFilters = [{ id: 'program', value: ['CCBC', 'CBC', 'OTHER'] }];
  const enableTimeMachine =
    getConfig()?.publicRuntimeConfig?.ENABLE_MOCK_TIME || false;
  const [columnFilters, setColumnFilters] =
    useState<MRT_ColumnFiltersState>(defaultFilters);
  const showLeadFeatureFlag = useFeature('show_lead').value ?? false;
  const showCbcProjects = useFeature('show_cbc_projects').value ?? false;
  const showCbcProjectsLink = false;
  const freezeHeader = useFeature('freeze_dashboard_header').value ?? false;
  const enableGlobalFilter = useFeature('show_global_filter').value ?? false;
  const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>(
    { Lead: false, program: false }
  );

  const [visibilityPreference, setVisibilityPreference] =
    useState<MRT_VisibilityState>();
  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);

  const [density, setDensity] = useState<MRT_DensityState>('comfortable');

  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [expanded, setExpanded] = useState({});
  const [globalFilter, setGlobalFilter] = useState(null);
  // uses rowId for the key to keep track of last visited row
  const [lastVisitedRow, setLastVisitedRow] = useState<{
    isCcbc: boolean;
    rowId: any;
  } | null>(null);
  const globalFilterMode = useRef('contains');

  const expandedRowsRef = useRef({});

  const [columnSizing, setColumnSizing] = useState<MRT_ColumnSizingState>({
    'mrt-row-expand': 40,
    Lead: 114,
    Package: 104,
    analystStatus: 152,
    projectId: 108,
    externalStatus: 150,
    intakeNumber: 90,
    organizationName: 141,
    projectTitle: 150,
    zones: 91,
    fundingSource: 110,
  });

  const handleBlob = (blob, toastMessage, reportDate) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportDate}_Connectivity_Projects_Export.xlsx`;
    document.body.appendChild(a); // Append to the DOM to ensure click works in Firefox
    a.click();
    a.remove(); // Remove the element after clicking
    window.URL.revokeObjectURL(url); // Clean up and release object URL
    showToast(toastMessage, 'success', 15000);
  };

  const handleError = (error) => {
    reportClientError(error, { source: 'all-dashboard' });
    showToast('An error occurred. Please try again.', 'error', 15000);
  };

  const handleDownload = async (rows: MRT_Row<any>[]) => {
    /* ---- BEGIN DEBUG ---- */
    console.time('[AllDashboardTable] export');
    setIsLoading(true);
    hideToast();
    const rowData = rows.map((row) => row.original);
    console.log('[AllDashboardTable] export rows', {
      count: rowData.length,
    });
    const groupedData = rowData.reduce(
      (result, item) => {
        const program =
          item.program === 'CCBC' || item.program === 'OTHER' ? 'ccbc' : 'cbc';

        if (!result[program]) {
          // eslint-disable-next-line no-param-reassign
          result[program.toLowerCase()] = [];
        }

        result[program].push(item.rowId);
        return result;
      },
      {} as Record<string, number[]>
    );
    await fetch('/api/dashboard/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(groupedData),
    }).then((response) => {
      response
        .blob()
        .then((blob) => {
          handleBlob(
            blob,
            'Export successful',
            DateTime.now()
              .setZone('America/Los_Angeles')
              .toLocaleString(DateTime.DATETIME_FULL)
          );
        })
        .catch((error) => {
          handleError(error);
        });
    });
    setIsLoading(false);
    console.timeEnd('[AllDashboardTable] export');
    /* ---- END DEGUG ---- */
  };

  const statusOrderMap = useMemo(() => {
    /* ---- BEGIN DEBUG ---- */
    const start = performance.now();
    const map = allApplicationStatusTypes?.nodes?.reduce((acc, status) => {
      acc[status.name] = status.statusOrder;
      acc[normalizeStatusName(status.name)] = status.statusOrder;
      return acc;
    }, {});
    console.log('[AllDashboardTable] statusOrderMap time', {
      durationMs: performance.now() - start,
    });
    /* ---- END DEGUG ---- */
    return map;
  }, [allApplicationStatusTypes?.nodes]);

  useEffect(() => {
    /* ---- BEGIN DEBUG ---- */
    console.log('[AllDashboardTable] flags', {
      showLeadFeatureFlag,
      showCbcProjects,
      freezeHeader,
      enableGlobalFilter,
      enableTimeMachine,
    });
    /* ---- END DEGUG ---- */
  }, [
    showLeadFeatureFlag,
    showCbcProjects,
    freezeHeader,
    enableGlobalFilter,
    enableTimeMachine,
  ]);

  useEffect(() => {
    /* ---- BEGIN DEBUG ---- */
    console.log('[AllDashboardTable] counts', {
      allApplications: allApplications?.edges?.length ?? 0,
      allCbcData: allCbcData?.edges?.length ?? 0,
      allApplicationStatusTypes:
        allApplicationStatusTypes?.nodes?.length ?? 0,
    });
    /* ---- END DEGUG ---- */
  }, [allApplications?.edges?.length, allCbcData?.edges?.length]);

  useEffect(() => {
    /* ---- BEGIN DEBUG ---- */
    console.time('[AllDashboardTable] loadInitialState');
    const loadInitialState = () => {
      const settings = [
        { key: 'mrt_sorting_application', setter: setSorting },
        { key: 'mrt_columnFilters_application', setter: setColumnFilters },
        {
          key: 'mrt_columnVisibility_application',
          setter: setColumnVisibility,
        },
        { key: 'mrt_density_application', setter: setDensity },
        { key: 'mrt_columnSizing_application', setter: setColumnSizing },
      ];

      settings.forEach(({ key, setter }) => {
        const value = cookie.get(key);
        if (value) setter(JSON.parse(value));
      });

      const showLeadSession = cookie.get('mrt_show_lead_application');
      setColumnVisibility((prev) => ({
        ...prev,
        Lead: showLeadSession
          ? JSON.parse(showLeadSession)
          : showLeadFeatureFlag,
      }));

      const lastVisitedRow = sessionStorage.getItem(
        'mrt_last_visited_row_application'
      );
      if (lastVisitedRow) setLastVisitedRow(JSON.parse(lastVisitedRow));

      setIsFirstRender(false);
    };

    loadInitialState();
    console.timeEnd('[AllDashboardTable] loadInitialState');
    /* ---- END DEGUG ---- */
  }, [showLeadFeatureFlag]);

  useEffect(() => {
    if (!isFirstRender) {
      /* ---- BEGIN DEBUG ---- */
      console.time('[AllDashboardTable] saveStateToCookies');
      const saveToCookies = [
        { key: 'mrt_columnVisibility_application', value: columnVisibility },
        { key: 'mrt_columnFilters_application', value: columnFilters },
        { key: 'mrt_density_application', value: density },
        { key: 'mrt_sorting_application', value: sorting },
        { key: 'mrt_columnSizing_application', value: columnSizing },
      ];

      saveToCookies.forEach(({ key, value }) => {
        cookie.set(key, JSON.stringify(value));
      });
      console.timeEnd('[AllDashboardTable] saveStateToCookies');
      /* ---- END DEGUG ---- */
    }
  }, [
    isFirstRender,
    columnVisibility,
    columnFilters,
    density,
    sorting,
    columnSizing,
  ]);

  useEffect(() => {
    if (visibilityPreference) {
      setColumnVisibility((prev) => ({
        ...prev,
        ...visibilityPreference,
      }));
      if (visibilityPreference.Lead !== undefined) {
        cookie.set(
          'mrt_show_lead_application',
          JSON.stringify(visibilityPreference.Lead)
        );
      }
    }
  }, [visibilityPreference]);

  useEffect(() => {
    /* ---- BEGIN DEBUG ---- */
    console.time('[AllDashboardTable] globalFilterExpanded');
    const newExpanded = globalFilter ? expandedRowsRef.current : {};
    setExpanded(newExpanded);
    expandedRowsRef.current = {};
    console.timeEnd('[AllDashboardTable] globalFilterExpanded');
    /* ---- END DEGUG ---- */
  }, [globalFilter]);

  const state = {
    showGlobalFilter: true,
    showColumnFilters: true,
    columnFilters,
    columnVisibility,
    density,
    sorting,
    columnSizing,
    expanded,
    globalFilter,
  };

  const customGlobalFilter = (
    row,
    id,
    filterValue,
    filterMeta,
    columnVisibility
  ) => {
    // exclude hidden columns from global filter
    const visibility = columnVisibility?.[id];
    if (visibility === false) return false;
    if (!filterValue) return true;
    if (row.getValue(id) === null) return false;
    const filterMode = globalFilterMode.current || 'contains';
    let defaultMatch;
    if (filterMode === 'fuzzy') {
      defaultMatch = MRT_FilterFns.fuzzy(row, id, filterValue, filterMeta);
    } else {
      defaultMatch = MRT_FilterFns[filterMode](row, id, filterValue);
    }

    const communitiesString = row.original.communities
      ?.map((item) => item.geoName)
      .join(',')
      ?.toLowerCase();
    const detailsMatch = communitiesString?.includes(filterValue.toLowerCase());

    // Match for original project number
    const originalProjectNumber = row?.original?.originalProjectNumber;
    // Ensure both are numbers for comparison, or fall back to string includes if not
    let projectNumberMatch = false;
    if (
      originalProjectNumber !== undefined &&
      originalProjectNumber !== null &&
      filterValue !== undefined &&
      filterValue !== null &&
      filterValue !== ''
    ) {
      // Try numeric comparison if both are numbers or can be parsed as numbers
      const origNum = Number(originalProjectNumber);
      const filterNum = Number(filterValue);
      if (!Number.isNaN(origNum) && !Number.isNaN(filterNum)) {
        projectNumberMatch = origNum === filterNum;
      } else {
        // fallback to string includes for partial match
        projectNumberMatch = originalProjectNumber
          .toString()
          .includes(filterValue.toString());
      }
    }

    const shouldExpand = detailsMatch || projectNumberMatch;

    expandedRowsRef.current[row.id] = shouldExpand;

    return defaultMatch || shouldExpand;
  };

  const getCommunities = (application) => {
    const communityDataSource =
      application.status === 'applicant_approved' ||
      application.status === 'approved'
        ? application.applicationSowDataByApplicationId.nodes[0]
            ?.sowTab8SBySowId
        : application.applicationFormTemplate9DataByApplicationId;
    return communityDataSource?.nodes[0]?.jsonData?.geoNames?.map((item) => ({
      geoName: item.bcGeoName || item.geoName,
      mapLink: item.mapLink,
    }));
  };

  const getCbcCommunities = (project) => {
    const communityDataSource =
      project.node.cbcByCbcId?.cbcProjectCommunitiesByCbcId;
    return communityDataSource?.nodes?.map((item) => ({
      geoName:
        item.communitiesSourceDataByCommunitiesSourceDataId.bcGeographicName,
      mapLink: item.communitiesSourceDataByCommunitiesSourceDataId.mapLink,
    }));
  };

  const tableData = useMemo(() => {
    /* ---- BEGIN DEBUG ---- */
    console.time('[AllDashboardTable] buildTableData');
    const allCcbcApplications = allApplications.edges.map((application) => ({
      ...application.node,
      intakeNumber: application?.node?.ccbcNumber?.includes('000074')
        ? ''
        : application.node.intakeNumber,
      projectId: application.node.ccbcNumber,
      packageNumber: application.node.package,
      projectTitle: application.node.projectName,
      isCbcProject: false,
      showLink: false,
      externalStatusOrder: statusOrderMap[application.node.externalStatus],
      internalStatusOrder: statusOrderMap[application.node.analystStatus],
      communities: getCommunities(application.node),
      organizationName: application.node.organizationName || '',
      fundingSource: getFundingSource(application.node),
    }));

    const allCbcApplications = showCbcProjects
      ? (allCbcData.edges.map((project) => {
          const cbcStatus = project.node.jsonData.projectStatus
            ? cbcProjectStatusConverter(project.node.jsonData.projectStatus)
            : null;
          const cbcStatusOrder = cbcStatus
            ? statusOrderMap[cbcProjectStatusConverter(cbcStatus)]
            : null;
          const cbcApplication = {
            rowId: project.node.cbcId,
            ...project.node.jsonData,
            program: 'CBC',
            zones: project.node.jsonData?.zones || [],
            intakeNumber: project.node.jsonData?.intake || 'N/A',
            projectId: project.node.projectNumber,
            internalStatus: null,
            externalStatus: cbcStatus,
            analystStatus: cbcStatus,
            externalStatusOrder: cbcStatusOrder,
            internalStatusOrder: cbcStatusOrder,
            packageNumber: null,
            organizationName: project.node.jsonData.currentOperatingName || '',
            lead: null,
            isCbcProject: true,
            showLink: showCbcProjectsLink,
            communities: getCbcCommunities(project),
          };
          return {
            ...cbcApplication,
            fundingSource: getFundingSource(cbcApplication),
          };
        }) ?? [])
      : [];

    const combined = [...allCcbcApplications, ...allCbcApplications];
    console.timeEnd('[AllDashboardTable] buildTableData');
    console.log('[AllDashboardTable] tableData counts', {
      ccbc: allCcbcApplications.length,
      cbc: allCbcApplications.length,
      total: combined.length,
    });
    /* ---- END DEGUG ---- */
    return combined;
  }, [
    allApplications.edges,
    allCbcData.edges,
    showCbcProjects,
    showCbcProjectsLink,
    statusOrderMap,
  ]);

  const columns = useMemo<MRT_ColumnDef<Application>[]>(() => {
    /* ---- BEGIN DEBUG ---- */
    console.time('[AllDashboardTable] buildColumns');
    const uniqueIntakeNumbers = [
      ...new Set(
        allApplications.edges.map((edge) => edge.node?.intakeNumber?.toString())
      ),
      'N/A',
    ].sort((a, b) => {
      if (a === 'N/A') return -1;
      if (b === 'N/A') return 1;
      return Number(a) - Number(b);
    });

    const uniqueZones = [
      ...new Set([
        ...allApplications.edges.flatMap((edge) => edge.node.zones),
        ...allCbcData.edges.flatMap((edge) => edge.node.jsonData?.zones),
      ]),
    ]
      .filter(filterOutNullishs)
      .map((zone) => zone.toString())
      .sort((a, b) => Number(a) - Number(b));

    const allCbcStatuses = allCbcData.edges
      .map((edge) => edge.node?.jsonData?.projectStatus)
      .map((status) => normalizeStatusName(cbcProjectStatusConverter(status)));

    const analystStatuses = [
      ...new Set([
        ...allApplications.edges.map((edge) =>
          normalizeStatusName(edge.node.analystStatus)
        ),
        ...allCbcStatuses,
      ]),
    ].sort((a, b) => statusOrderMap[a] - statusOrderMap[b]);

    const externalStatuses = [
      ...new Set([
        ...allApplications.edges.map((edge) =>
          normalizeStatusName(edge.node.externalStatus)
        ),
        ...allCbcStatuses,
      ]),
    ].sort((a, b) => statusOrderMap[a] - statusOrderMap[b]);

    const uniqueLeads = [
      ...new Set(allApplications.edges.map((edge) => edge.node.analystLead)),
    ].filter(filterOutNullishs);

    const uniquePackages = [
      ...new Set(
        allApplications.edges.map((edge) => edge.node.package?.toString())
      ),
    ]
      .map(toLabelValuePair)
      .toSorted((a, b) => Number(a.value) - Number(b.value));

    const sortedZones = (zones?: number[] | null) =>
      Array.isArray(zones)
        ? [...zones].sort((a, b) => a - b).join(', ')
        : zones;

    const columnDefs: MRT_ColumnDef<Application>[] = [
      {
        accessorKey: 'intakeNumber',
        header: 'Intake',
        filterVariant: 'multi-select',
        filterFn: genericFilterMultiSelect,
        filterSelectOptions: uniqueIntakeNumbers,
      },
      {
        accessorKey: 'projectId',
        header: 'Project ID',
      },
      {
        accessorKey: 'zones',
        header: 'Zone',
        Cell: ({ cell }) => sortedZones(cell.getValue() as number[]),
        filterVariant: 'multi-select',
        filterSelectOptions: uniqueZones,
        filterFn: filterMultiSelectZones,
        sortingFn: sortZones,
      },
      {
        accessorFn: (row) => normalizeStatusName(row.analystStatus),
        id: 'analystStatus',
        header: 'Internal Status',
        Cell: AnalystStatusCell,
        filterVariant: 'multi-select',
        filterFn: statusFilter,
        filterSelectOptions: analystStatuses,
        sortingFn: sortStatus,
      },
      {
        accessorFn: (row) => normalizeStatusName(row.externalStatus),
        id: 'externalStatus',
        header: 'External Status',
        Cell: ApplicantStatusCell,
        filterVariant: 'multi-select',
        filterFn: statusFilter,
        filterSelectOptions: externalStatuses,
        sortingFn: sortStatus,
      },
      {
        accessorKey: 'projectTitle',
        header: 'Project title ',
      },
      {
        accessorKey: 'organizationName',
        header: 'Organization',
      },
      {
        accessorKey: 'fundingSource',
        header: 'BC/ISED Funded',
        filterVariant: 'multi-select',
        filterSelectOptions: ['BC', 'ISED', 'BC & ISED', 'N/A', 'TBD'],
        filterFn: genericFilterMultiSelect,
      },
      {
        header: 'Lead',
        accessorFn: accessorFunctionGeneratorInjectsEmptyString('analystLead'),
        Cell: AssignAnalystLead,
        filterVariant: 'multi-select',
        filterSelectOptions: uniqueLeads,
        filterFn: genericFilterMultiSelect,
      },
      {
        accessorFn:
          accessorFunctionGeneratorInjectsEmptyString('packageNumber'),
        header: 'Package',
        filterVariant: 'multi-select',
        filterSelectOptions: uniquePackages,
        filterFn: genericFilterMultiSelect,
      },
      // adding dummy columns for filter purposes
      ...(additionalFilterColumns as MRT_ColumnDef<Application>[]),
    ];
    console.timeEnd('[AllDashboardTable] buildColumns');
    console.log('[AllDashboardTable] columnOptions counts', {
      uniqueIntakeNumbers: uniqueIntakeNumbers.length,
      uniqueZones: uniqueZones.length,
      analystStatuses: analystStatuses.length,
      externalStatuses: externalStatuses.length,
      uniqueLeads: uniqueLeads.length,
      uniquePackages: uniquePackages.length,
      columns: columnDefs.length,
    });
    /* ---- END DEGUG ---- */
    return columnDefs;
  }, [AssignAnalystLead, allApplications, allCbcData.edges, statusOrderMap]);

  const handleOnSortChange = (sort: MRT_SortingState) => {
    if (!isFirstRender) {
      setSorting(sort);
    }
  };

  const tableHeightOffset = enableTimeMachine ? '460px' : '360px';

  const isLastVisitedRow = (row) => {
    return (
      parseInt(lastVisitedRow?.rowId, 10) ===
        parseInt(row.original.rowId, 10) &&
      lastVisitedRow?.isCcbc === !row.original.isCbcProject
    );
  };

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    state,
    muiTableContainerProps: {
      sx: {
        padding: '0 8px 8px 8px',
        maxHeight: freezeHeader ? `calc(100vh - ${tableHeightOffset})` : '100%',
      },
    },
    layoutMode: isLargeUp ? 'grid' : 'semantic',
    muiTableBodyCellProps,
    muiTableHeadCellProps,
    muiTableBodyRowProps: ({ row }) => ({
      id: `${row.original.isCbcProject ? 'cbc' : 'ccbc'}-${row.original.rowId}`,
      onClick: () => {
        if (row.original.isCbcProject) {
          router.push(`/analyst/cbc/${row.original.rowId}`);
        } else {
          router.push(`/analyst/application/${row.original.rowId}/summary`);
        }
      },
      sx: {
        cursor: 'pointer',
        backgroundColor: isLastVisitedRow(row)
          ? 'rgba(178, 178, 178, 0.3)'
          : 'inherit',
      },
    }),
    enableStickyHeader: freezeHeader,
    onSortingChange: handleOnSortChange,
    onColumnFiltersChange: setColumnFilters,
    autoResetAll: false,
    onColumnVisibilityChange: (columnVisibility) => {
      setVisibilityPreference(columnVisibility);
      table.setGlobalFilter(null);
    },
    onDensityChange: setDensity,
    onColumnSizingChange: setColumnSizing,
    enablePagination: false,
    enableGlobalFilter,
    enableGlobalFilterModes: true,
    globalFilterModeOptions: ['fuzzy', 'startsWith', 'contains'],
    enableBottomToolbar: false,
    enableColumnActions: false,
    filterFns: {
      filterNumber,
      statusFilter,
      customGlobalFilter: (row, id, filterValue, filterMeta) =>
        customGlobalFilter(
          row,
          id,
          filterValue,
          filterMeta,
          table.getState()?.columnVisibility
        ),
    },
    renderDetailPanel: ({ row }) => (
      <AllDashboardDetailPanel row={row} filterValue={globalFilter} />
    ),
    globalFilterFn: 'customGlobalFilter',
    enableRowVirtualization: true,
    rowVirtualizerInstanceRef,
    rowVirtualizerOptions: { overscan: 50 },
    icons: {
      FilterAltIcon: () => null,
    },
    onGlobalFilterChange: setGlobalFilter,
    onExpandedChange: (expanded) => {
      setExpanded(expanded);
    },
    renderGlobalFilterModeMenuItems: ({
      internalFilterOptions,
      onSelectFilterMode,
    }) => {
      return internalFilterOptions.map((option) => (
        <MenuItem
          key={option.toString()}
          selected={option?.option === globalFilterMode.current}
          onClick={() => {
            onSelectFilterMode(option?.option);
            // setting up for custom global filter
            table.setGlobalFilterFn('customGlobalFilter');
            globalFilterMode.current = option?.option;
          }}
        >
          {option.label}
        </MenuItem>
      ));
    },
    renderToolbarInternalActions: ({ table }) => (
      <Box>
        {(authRole === 'super_admin' || authRole === 'cbc_admin') && (
          <IconButton size="small">
            <CbcCreateIcon handleClick={() => setIsCreateCbcModalOpen(true)} />
          </IconButton>
        )}
        <IconButton size="small">
          <DownloadIcon
            handleClick={() => handleDownload(table.getRowModel().rows)}
            isLoading={isLoading}
          />
        </IconButton>
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
        <IconButton size="small">
          <StatusInformationIcon />
        </IconButton>
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
        />
      </StyledTableHeader>
    ),
  });

  useEffect(() => {
    /* ---- BEGIN DEBUG ---- */
    console.log('[AllDashboardTable] tableState', {
      columnFiltersCount: columnFilters?.length ?? 0,
      sortingCount: sorting?.length ?? 0,
      density,
      columnVisibilityKeys: Object.keys(columnVisibility || {}).length,
      columnSizingKeys: Object.keys(columnSizing || {}).length,
      expandedCount: Object.keys(expanded || {}).length,
      globalFilter,
      isLargeUp,
    });
    /* ---- END DEGUG ---- */
  }, [
    columnFilters,
    sorting,
    density,
    columnVisibility,
    columnSizing,
    expanded,
    globalFilter,
    isLargeUp,
  ]);

  useEffect(() => {
    if (!isFirstRender && lastVisitedRow) {
      /* ---- BEGIN DEBUG ---- */
      console.time('[AllDashboardTable] scrollToLastVisited');
      const targetRowIndex = table
        .getSortedRowModel()
        .rows?.findIndex(
          (row) => row.original.rowId === Number(lastVisitedRow.rowId)
        );

      if (targetRowIndex !== -1) {
        setTimeout(() => {
          // accounting for detail panels hence *2
          rowVirtualizerInstanceRef.current?.scrollToIndex(targetRowIndex * 2, {
            align: 'center',
          });
          console.timeEnd('[AllDashboardTable] scrollToLastVisited');
          /* ---- END DEGUG ---- */
        }, 0);
      } else {
        console.timeEnd('[AllDashboardTable] scrollToLastVisited');
        /* ---- END DEGUG ---- */
      }
    }
  }, [isFirstRender, lastVisitedRow]);

  useEffect(() => {
    /* ---- BEGIN DEBUG ---- */
    console.time('[AllDashboardTable] saveRowModel');
    const rowModel = table.getRowModel().rows?.map((row) => row.original);
    localStorage.setItem('dashboard_row_model', JSON.stringify(rowModel));
    console.timeEnd('[AllDashboardTable] saveRowModel');
    /* ---- END DEGUG ---- */
  }, [table.getRowModel().rows]);

  const visibleRowCount = table.getRowModel().rows?.length ?? 0;
  const renderRowCount = () => (
    <RowCount
      visibleRowCount={visibleRowCount}
      totalRowCount={tableData.length}
    />
  );

  return (
    <>
      {renderRowCount()}
      <MaterialReactTable table={table} />
      <CbcCreateModal
        isOpen={isCreateCbcModalOpen}
        setIsOpen={setIsCreateCbcModalOpen}
      />
      {!freezeHeader && renderRowCount()}
    </>
  );
};

export default AllDashboardTable;
