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

type Application = {
  ccbcNumber: string;
  applicationId: number;
  package: number;
  projectTitle: string;
  organizationName: string;
  analystStatus: string;
};

export const filterStringValue = (row, id, filterValue) => {
  const ccbcId = row.getValue(id) as any;

  if (!ccbcId) {
    return false;
  }
  return ccbcId.toLowerCase().includes(filterValue.toLowerCase());
};

export const filterNumber = (row, id, filterValue) => {
  const numericProperty = row.getValue(id) as number;

  if (!numericProperty) {
    return false;
  }
  return numericProperty === filterValue;
};

export const filterNumberAsString = (row, id, filterValue) => {
  const numericProperty = row.getValue(id) as number;
  if (!numericProperty) {
    return false;
  }
  const numericPropertyAsString = numericProperty?.toString();
  return numericPropertyAsString.includes(filterValue);
};

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.color.links};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const CcbcIdCell = ({ cell }) => {
  const applicationId = cell.row.original?.applicationId;
  return (
    <StyledLink href={`/analyst/application/${applicationId}`}>
      {cell.getValue()}
    </StyledLink>
  );
};

const StatusCell = ({ cell }) => {
  const analystStatus = cell.row.original?.analystStatus;
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

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    () => {
      const columnFiltersSession = cookie.get('mrt_columnFilters_application');
      if (columnFiltersSession) {
        return JSON.parse(columnFiltersSession);
      }
      return [];
    }
  );
  const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>(
    () => {
      const columnVisibilitySession = cookie.get(
        'mrt_columnVisibility_application'
      );
      if (columnVisibilitySession) {
        return JSON.parse(columnVisibilitySession);
      }
      return {};
    }
  );
  const [density, setDensity] = useState<MRT_DensityState>(() => {
    const densitySession = cookie.get('mrt_density_application');
    if (densitySession) {
      return JSON.parse(densitySession);
    }
    return 'comfortable';
  });
  const [showColumnFilters, setShowColumnFilters] = useState(() => {
    const showColumnFiltersSession = cookie.get(
      'mrt_showColumnFilters_application'
    );
    if (showColumnFiltersSession) {
      return JSON.parse(showColumnFiltersSession);
    }
    return false;
  });

  const [sorting, setSorting] = useState<MRT_SortingState>(() => {
    const sortingSession = cookie.get('mrt_sorting_application');
    if (sortingSession) {
      return JSON.parse(sortingSession);
    }
    return [];
  });
  useEffect(() => {
    cookie.set('mrt_columnFilters_application', JSON.stringify(columnFilters));
  }, [columnFilters]);

  useEffect(() => {
    cookie.set(
      'mrt_columnVisibility_application',
      JSON.stringify(columnVisibility)
    );

    cookie.set(
      'mrt_showColumnFilters_application',
      JSON.stringify(showColumnFilters)
    );
    cookie.set('mrt_columnFilters_application', JSON.stringify(columnFilters));
    cookie.set('mrt_density_application', JSON.stringify(density));
    cookie.set('mrt_sorting_application', JSON.stringify(sorting));
  }, [columnVisibility, density, showColumnFilters, sorting, columnFilters]);

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
        filterFn: 'filterNumberAsString',
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
        filterFn: 'filterStringValue',
      },
      {
        accessorKey: 'analystStatus',
        header: 'Status',
        Cell: StatusCell,
        size: 24,
        maxSize: 24,
        filterFn: 'filterNumber',
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
        filterFn: 'filterStringValue',
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

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    state: {
      columnFilters,
      columnVisibility,
      density,
      showColumnFilters,
      sorting,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onDensityChange: setDensity,
    onShowColumnFiltersChange: setShowColumnFilters,
    enablePagination: false,
    enableGlobalFilter: false,
    enableBottomToolbar: false,
    muiTableContainerProps: { sx: { padding: '8px' } },
    layoutMode: isLargeUp ? 'grid' : 'semantic',
    muiTableBodyCellProps: {
      sx: {
        padding: '8px 0px',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        padding: '0px',
        wordBreak: 'break-word',
        texOverflow: 'wrap',
        '.Mui-TableHeadCell-Content-Labels': {
          width: '100%',
          justifyContent: 'space-between',
        },
      },
    },
    filterFns: {
      filterStringValue,
      filterNumber,
      filterNumberAsString,
    },
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
