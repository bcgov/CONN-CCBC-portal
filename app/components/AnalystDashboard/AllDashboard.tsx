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
} from 'material-react-table';

import RowCount from 'components/Table/RowCount';
import AssignLead from 'components/Analyst/AssignLead';
import StatusPill from 'components/StatusPill';
import statusStyles from 'data/statusStyles';
import Link from 'next/link';
import ClearFilters from 'components/Table/ClearFilters';

type Application = {
  ccbcNumber: string;
  applicationId: number;
  package: number;
  projectTitle: string;
  organizationName: string;
  analystStatus: string;
  externalStatus: string;
};

export const filterNumber = (row, id, filterValue) => {
  const numericProperty = Number(row.getValue(id));

  if (!numericProperty) {
    return false;
  }
  return numericProperty === Number(filterValue);
};

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.color.links};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const muiTableBodyCellProps = {
  sx: {
    padding: '8px 0px',
  },
};

const muiTableHeadCellProps = {
  sx: {
    padding: '0px',
    wordBreak: 'break-word',
    texOverflow: 'wrap',
    '.Mui-TableHeadCell-Content-Labels': {
      width: '100%',
      justifyContent: 'space-between',
    },
  },
};

const CcbcIdCell = ({ cell }) => {
  const applicationId = cell.row.original?.applicationId;
  return (
    <StyledLink href={`/analyst/application/${applicationId}`}>
      {cell.getValue()}
    </StyledLink>
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

interface Props {
  query: any;
}

const AllDashboardTable: React.FC<Props> = ({ query }) => {
  const queryFragment = useFragment(
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
      }
    `,
    query
  );

  const AssignAnalystLead = useCallback(
    ({ cell }) => {
      const row = cell.row.original;
      const { applicationId, analystLead } = row;
      return (
        <AssignLead
          query={queryFragment}
          applicationId={applicationId}
          lead={analystLead}
        />
      );
    },
    [queryFragment]
  );
  const { allApplications } = queryFragment;
  const isLargeUp = useMediaQuery('(min-width:1007px)');

  const [isFirstRender, setIsFirstRender] = useState(true);

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>(
    {}
  );
  const [density, setDensity] = useState<MRT_DensityState>('comfortable');
  const [showColumnFilters, setShowColumnFilters] = useState(false);

  const [sorting, setSorting] = useState<MRT_SortingState>([]);

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
    setIsFirstRender(false);
  }, []);

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

  const state = {
    columnFilters,
    columnVisibility,
    density,
    showColumnFilters,
    sorting,
  };

  const tableData = useMemo(
    () =>
      allApplications.edges.map(({ node: application }) => {
        const {
          ccbcNumber,
          organizationName,
          package: packageNumber,
          projectName,
          rowId: applicationId,
          zones,
          externalStatus,
          analystStatus,
          analystLead,
          intakeNumber,
        } = application;

        const zoneString = zones?.join(', ') ?? '';

        return {
          applicationId,
          ccbcNumber,
          packageNumber,
          zones: zoneString,
          analystStatus,
          externalStatus,
          analystLead,
          intakeNumber,
          projectTitle:
            application.applicationSowDataByApplicationId?.nodes[0]?.jsonData
              ?.projectTitle || projectName,
          organizationName,
        };
      }),
    [allApplications]
  );

  const columns = useMemo<MRT_ColumnDef<Application>[]>(() => {
    return [
      {
        accessorKey: 'intakeNumber',
        header: 'Intake',
        size: 26,
        maxSize: 26,
        filterFn: 'contains',
      },
      {
        accessorKey: 'ccbcNumber',
        header: 'CCBC ID',
        size: 26,
        maxSize: 26,
        Cell: CcbcIdCell,
      },
      {
        accessorKey: 'zones',
        header: 'Zones',
        size: 26,
        maxSize: 26,
        filterFn: 'contains',
      },
      {
        accessorKey: 'analystStatus',
        header: 'Internal Status',
        Cell: AnalystStatusCell,
        size: 30,
        maxSize: 30,
        filterFn: 'contains',
      },
      {
        accessorKey: 'externalStatus',
        header: 'External Status',
        size: 30,
        maxSize: 30,
        Cell: ApplicantStatusCell,
        filterFn: 'contains',
      },
      {
        accessorKey: 'projectTitle',
        header: 'Project title ',
        size: 30,
      },
      {
        accessorKey: 'organizationName',
        header: 'Organization',
        size: 30,
      },
      {
        size: 30,
        header: 'Lead',
        maxSize: 30,
        accessorKey: 'analystLead',
        Cell: AssignAnalystLead,
        filterFn: 'contains',
      },
      {
        accessorKey: 'packageNumber',
        header: 'Package',
        size: 26,
        maxSize: 26,
        filterFn: 'filterNumber',
      },
    ];
  }, [AssignAnalystLead]);

  const handleOnSortChange = (sort) => {
    if (!isFirstRender) {
      setSorting(sort());
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    state,
    muiTableContainerProps: { sx: { padding: '8px' } },
    layoutMode: isLargeUp ? 'grid' : 'semantic',
    muiTableBodyCellProps,
    muiTableHeadCellProps,
    onSortingChange: handleOnSortChange,
    onColumnFiltersChange: setColumnFilters,
    autoResetAll: false,
    onColumnVisibilityChange: setColumnVisibility,
    onDensityChange: setDensity,
    onShowColumnFiltersChange: setShowColumnFilters,
    enablePagination: false,
    enableGlobalFilter: false,
    enableBottomToolbar: false,
    filterFns: {
      filterNumber,
    },
    renderTopToolbarCustomActions: () => (
      <ClearFilters table={table} filters={table.getState().columnFilters} />
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
