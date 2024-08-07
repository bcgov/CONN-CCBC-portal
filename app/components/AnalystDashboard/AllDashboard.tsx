import { useCallback, useEffect, useMemo, useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import cookie from 'js-cookie';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_DensityState,
  type MRT_SortingState,
  type MRT_VisibilityState,
  type MRT_ColumnSizingState,
} from 'material-react-table';

import RowCount from 'components/Table/RowCount';
import AssignLead from 'components/Analyst/AssignLead';
import StatusPill from 'components/StatusPill';
import statusStyles from 'data/statusStyles';
import Link from 'next/link';
import ClearFilters from 'components/Table/ClearFilters';
import type { AllDashboardTable_query$key } from '__generated__/AllDashboardTable_query.graphql';
import { TableCellProps } from '@mui/material';
import { useFeature } from '@growthbook/growthbook-react';
import { filterZones, sortZones } from './AssessmentAssignmentTable';
import AdditionalFilters, {
  additionalFilterColumns,
} from './AdditionalFilters';

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
};

export const filterNumber = (row, id, filterValue) => {
  const numericProperty = Number(row.getValue(id));

  if (!numericProperty) {
    return false;
  }
  return numericProperty === Number(filterValue);
};

const cbcProjectStatusConverter = (status) => {
  if (status === 'Conditionally Approved') {
    return 'conditionally_approved';
  }
  if (status === 'Reporting Complete') {
    return 'complete';
  }
  if (status === 'Agreement Signed') {
    return 'approved';
  }
  if (status === 'Withdrawn') {
    return 'withdrawn';
  }
  return status;
};

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.color.links};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const StyledTableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const muiTableBodyCellProps = (props): TableCellProps => {
  const centeredCols = ['Package', 'zones'];
  return {
    align: centeredCols.includes(props.column.id) ? 'center' : 'left',
    sx: {
      padding: '8px 0px',
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
  },
};

const CcbcIdCell = ({ cell }) => {
  const applicationId = cell.row.original?.rowId;
  const isCbcProject = cell.row.original?.isCbcProject;
  const linkCbc = cell.row.original?.showLink;
  return (
    <>
      {linkCbc ? (
        <StyledLink
          href={`/analyst/${isCbcProject ? 'cbc' : 'application'}/${applicationId}`}
        >
          {cell.getValue()}
        </StyledLink>
      ) : (
        cell.getValue()
      )}
    </>
  );
};

const AnalystStatusCell = ({ cell }) => {
  const analystStatus = cell.row.original?.analystStatus;
  return <StatusPill status={analystStatus} styles={statusStyles} />;
};

const ApplicantStatusCell = ({ cell }) => {
  const analystStatus = cell.row.original?.externalStatus;
  return <StatusPill status={analystStatus} styles={statusStyles} />;
};

const filterOutNullishs = (val) => val !== undefined && val !== null;

const accessorFunctionGeneratorInjectsEmptyString = (accessorKey) => {
  return (row) => row[accessorKey] ?? '';
};

const normalizeStatusName = (status) => {
  return statusStyles[status]?.description;
};

const statusFilter = (row, id, filterValue) => {
  if (filterValue.length === 0) {
    return true;
  }
  return filterValue.includes(normalizeStatusName(row.getValue(id)));
};

interface Props {
  query: any;
}

const AllDashboardTable: React.FC<Props> = ({ query }) => {
  const queryFragment = useFragment<AllDashboardTable_query$key>(
    graphql`
      fragment AllDashboardTable_query on Query {
        ...AssignLead_query
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
              applicationSowDataByApplicationId(
                condition: { isAmendment: false }
                last: 1
              ) {
                totalCount
                nodes {
                  id
                  jsonData
                  rowId
                }
              }
            }
          }
        }
        allCbcData(filter: { archivedAt: { isNull: true } }) {
          edges {
            node {
              jsonData
              projectNumber
              cbcId
            }
          }
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
  const { allApplications, allCbcData } = queryFragment;
  const isLargeUp = useMediaQuery('(min-width:1007px)');

  const [isFirstRender, setIsFirstRender] = useState(true);

  const defaultFilters = [{ id: 'program', value: ['CCBC', 'CBC', 'OTHER'] }];
  const [columnFilters, setColumnFilters] =
    useState<MRT_ColumnFiltersState>(defaultFilters);
  const showLeadFeatureFlag = useFeature('show_lead').value ?? false;
  const showCbcProjects = useFeature('show_cbc_projects').value ?? false;
  const showCbcProjectsLink = useFeature('show_cbc_view_link').value ?? false;
  const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>(
    { Lead: false, program: false }
  );

  const [visibilityPreference, setVisibilityPreference] =
    useState<MRT_VisibilityState>();

  const [density, setDensity] = useState<MRT_DensityState>('comfortable');
  const [showColumnFilters, setShowColumnFilters] = useState(false);

  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const [columnSizing, setColumnSizing] = useState<MRT_ColumnSizingState>({
    Lead: 114,
    Package: 104,
    analystStatus: 152,
    ccbcNumber: 108,
    externalStatus: 150,
    intakeNumber: 85,
    organizationName: 141,
    projectTitle: 150,
    zones: 91,
  });

  useEffect(() => {
    const sortingSession = cookie.get('mrt_sorting_application');
    if (sortingSession) {
      setSorting(JSON.parse(sortingSession));
    }

    const columnFiltersSession = cookie.get('mrt_columnFilters_application');
    if (columnFiltersSession) {
      setColumnFilters(JSON.parse(columnFiltersSession));
    }

    const columnVisibilitySession = cookie.get(
      'mrt_columnVisibility_application'
    );
    if (columnVisibilitySession) {
      setColumnVisibility(JSON.parse(columnVisibilitySession));
    }

    const densitySession = cookie.get('mrt_density_application');
    if (densitySession) {
      setDensity(JSON.parse(densitySession));
    }

    const showColumnFiltersSession = cookie.get(
      'mrt_showColumnFilters_application'
    );
    if (showColumnFiltersSession) {
      setShowColumnFilters(JSON.parse(showColumnFiltersSession));
    }

    const columnSizingSession = cookie.get('mrt_columnSizing_application');

    if (columnSizingSession) {
      setColumnSizing(JSON.parse(columnSizingSession));
    }

    setIsFirstRender(false);
  }, []);

  useEffect(() => {
    if (!isFirstRender) {
      const showLeadSession = cookie.get('mrt_show_lead_application');
      setColumnVisibility((prevColumnVisibilty) => ({
        ...prevColumnVisibilty,
        Lead: showLeadSession
          ? JSON.parse(showLeadSession)
          : showLeadFeatureFlag,
      }));
    }
  }, [isFirstRender, showLeadFeatureFlag]);

  useEffect(() => {
    if (!isFirstRender) {
      cookie.set(
        'mrt_columnVisibility_application',
        JSON.stringify(columnVisibility)
      );
    }
  }, [columnVisibility, isFirstRender]);

  useEffect(() => {
    if (!isFirstRender) {
      cookie.set(
        'mrt_showColumnFilters_application',
        JSON.stringify(showColumnFilters)
      );
    }
  }, [showColumnFilters, isFirstRender]);

  useEffect(() => {
    if (!isFirstRender) {
      cookie.set(
        'mrt_columnFilters_application',
        JSON.stringify(columnFilters)
      );
    }
  }, [columnFilters, isFirstRender]);

  useEffect(() => {
    if (!isFirstRender) {
      cookie.set('mrt_density_application', JSON.stringify(density));
    }
  }, [density, isFirstRender]);

  useEffect(() => {
    if (!isFirstRender) {
      cookie.set('mrt_sorting_application', JSON.stringify(sorting));
    }
  }, [sorting, isFirstRender]);

  useEffect(() => {
    if (!isFirstRender) {
      cookie.set('mrt_columnSizing_application', JSON.stringify(columnSizing));
    }
  }, [columnSizing, isFirstRender]);

  /**
   * Wrapping the setColumnVisibility in a separate state to also set the cookies for controlled columns (like Lead)
   * and to check if user has really changed the visibility preference on controlled columns
   * and to keep the controlled column visibility cookies clear|empty to prevent overriding feature-flag changes in the future
   * */
  useEffect(() => {
    if (visibilityPreference) {
      setColumnVisibility((prev) => {
        if (visibilityPreference.Lead !== undefined) {
          cookie.set(
            'mrt_show_lead_application',
            JSON.stringify(visibilityPreference.Lead)
          );
        }
        return {
          ...prev,
          ...visibilityPreference,
        };
      });
    }
  }, [visibilityPreference]);

  const state = {
    columnFilters,
    columnVisibility,
    density,
    showColumnFilters,
    sorting,
    columnSizing,
  };

  const tableData = useMemo(() => {
    return [
      ...allApplications.edges.map((application) => ({
        ...application.node,
        intakeNumber: application.node.ccbcNumber.includes('000074')
          ? ''
          : application.node.intakeNumber,
        projectId: application.node.ccbcNumber,
        packageNumber: application.node.package,
        projectTitle:
          application.node.applicationSowDataByApplicationId?.nodes[0]?.jsonData
            ?.projectTitle || application.node.projectName,
        isCbcProject: false,
        showLink: true,
      })),
      ...(showCbcProjects
        ? allCbcData.edges.map((project) => ({
            rowId: project.node.cbcId,
            ...project.node.jsonData,
            program: 'CBC',
            zones: [],
            intakeNumber: project.node.jsonData?.intake || 'N/A',
            projectId: project.node.jsonData.projectNumber,
            internalStatus: null,
            externalStatus: project.node.jsonData.projectStatus
              ? cbcProjectStatusConverter(project.node.jsonData.projectStatus)
              : null,
            packageNumber: null,
            organizationName:
              project.node.jsonData.currentOperatingName || null,
            lead: null,
            isCbcProject: true,
            showLink: showCbcProjectsLink,
          })) ?? []
        : []),
    ];
  }, [allApplications, allCbcData, showCbcProjects, showCbcProjectsLink]);

  const columns = useMemo<MRT_ColumnDef<Application>[]>(() => {
    const uniqueIntakeNumbers = [
      ...new Set(
        allApplications.edges.map((edge) => edge.node?.intakeNumber?.toString())
      ),
      'N/A',
    ];

    const uniqueZones = [
      ...new Set(allApplications.edges.flatMap((edge) => edge.node.zones)),
    ]
      .map((zone) => zone.toString())
      .sort((a, b) => Number(a) - Number(b));

    const analystStatuses = [
      ...new Set(
        allApplications.edges.map((edge) => {
          return normalizeStatusName(edge.node.analystStatus);
        })
      ),
    ];

    const externalStatuses = [
      ...new Set([
        ...allApplications.edges.map((edge) =>
          normalizeStatusName(edge.node.externalStatus)
        ),
        ...allCbcData.edges
          .map((edge) => edge.node?.jsonData?.projectStatus)
          .map((status) =>
            normalizeStatusName(cbcProjectStatusConverter(status))
          ),
      ]),
    ];

    const uniqueLeads = [
      ...new Set(allApplications.edges.map((edge) => edge.node.analystLead)),
    ].filter(filterOutNullishs);

    const uniquePackages = [
      ...new Set(
        allApplications.edges.map((edge) => edge.node.package?.toString())
      ),
    ].filter(filterOutNullishs);

    return [
      {
        accessorKey: 'intakeNumber',
        header: 'Intake',
        filterVariant: 'select',
        filterSelectOptions: uniqueIntakeNumbers,
      },
      {
        accessorKey: 'projectId',
        header: 'Project ID',
        Cell: CcbcIdCell,
      },
      {
        accessorKey: 'zones',
        header: 'Zone',
        Cell: ({ cell }) => (cell.getValue() as number[]).join(', ') ?? [],
        filterVariant: 'select',
        filterSelectOptions: uniqueZones,
        filterFn: filterZones,
        sortingFn: sortZones,
      },
      {
        accessorKey: 'analystStatus',
        header: 'Internal Status',
        Cell: AnalystStatusCell,
        filterVariant: 'multi-select',
        filterFn: statusFilter,
        filterSelectOptions: analystStatuses,
      },
      {
        accessorKey: 'externalStatus',
        header: 'External Status',
        Cell: ApplicantStatusCell,
        filterVariant: 'multi-select',
        filterFn: statusFilter,
        filterSelectOptions: externalStatuses,
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
        header: 'Lead',
        accessorFn: accessorFunctionGeneratorInjectsEmptyString('analystLead'),
        Cell: AssignAnalystLead,
        filterVariant: 'select',
        filterSelectOptions: uniqueLeads,
      },
      {
        accessorFn:
          accessorFunctionGeneratorInjectsEmptyString('packageNumber'),
        header: 'Package',
        filterVariant: 'select',
        filterSelectOptions: uniquePackages,
      },
      // adding dummy columns for filter purposes
      ...additionalFilterColumns,
    ];
  }, [AssignAnalystLead, allApplications]);

  const handleOnSortChange = (sort: MRT_SortingState) => {
    if (!isFirstRender) {
      setSorting(sort);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    state,
    muiTableContainerProps: { sx: { padding: '8px' } },
    layoutMode: isLargeUp ? 'grid' : 'semantic',
    muiTableBodyCellProps,
    muiTableHeadCellProps,
    onSortingChange: handleOnSortChange,
    onColumnFiltersChange: setColumnFilters,
    autoResetAll: false,
    onColumnVisibilityChange: setVisibilityPreference,
    onDensityChange: setDensity,
    onShowColumnFiltersChange: setShowColumnFilters,
    onColumnSizingChange: setColumnSizing,
    enablePagination: false,
    enableGlobalFilter: false,
    enableBottomToolbar: false,
    filterFns: {
      filterNumber,
      statusFilter,
    },
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
      {renderRowCount()}
    </>
  );
};

export default AllDashboardTable;
