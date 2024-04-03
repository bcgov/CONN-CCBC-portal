import { useEffect, useMemo, useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import cookie from 'js-cookie';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_DensityState,
  type MRT_SortingState,
  type MRT_VisibilityState,
  type MRT_ColumnSizingState,
  MRT_TopToolbar as MRTTopToolBar,
  MRT_TableContainer as MRTTableContainer,
} from 'material-react-table';

import AssessmentLead from 'components/AnalystDashboard/AssessmentLead';
import RowCount from 'components/Table/RowCount';
import { Box, Paper } from '@mui/material';
import ClearFilters from 'components/Table/ClearFilters';
import AssessmentLegend from './AssessmentLegend';

type Assessment = {
  rowId: string;
  assignedTo: string;
  type: string;
};

type Application = {
  intakeId: string;
  ccbcNumber: string;
  zones: string[];
  applicationId: number;
  pmAssessment: Assessment;
  techAssessment: Assessment;
  permittingAssessment: Assessment;
  gisAssessment: Assessment;
  organizationName: string;
};

export const filterAnalysts = (row, id, filterValue) => {
  const value = row.getValue(id) as any;
  const assignedTo = value?.jsonData?.assignedTo;

  if (!assignedTo) {
    return false;
  }

  return assignedTo.toLowerCase().includes(filterValue.toLowerCase());
};

export const filterCcbcId = (row, id, filterValue) => {
  const ccbcId = row.getValue(id) as any;

  if (!ccbcId) {
    return false;
  }
  return ccbcId.toLowerCase().includes(filterValue.toLowerCase());
};

export const filterZones = (row, id, filterValue) => {
  const zones = row.getValue(id) as any;

  if (!zones) {
    return false;
  }

  return zones.some((zone) => parseInt(zone, 10) === parseInt(filterValue, 10));
};

export const sortZones = (rowA, rowB, columnId) => {
  const valueA = rowA.getValue(columnId) as Array<string>;
  const valueB = rowB.getValue(columnId) as Array<string>;
  return (
    parseInt(valueA[valueA.length - 1], 10) -
    parseInt(valueB[valueB.length - 1], 10)
  );
};

export const sortAnalysts = (rowA, rowB, columnId) => {
  const valueA = rowA.getValue(columnId) as any;
  const valueB = rowB.getValue(columnId) as any;
  const assignedToA = valueA?.jsonData?.assignedTo;
  const assignedToB = valueB?.jsonData?.assignedTo;

  if (!assignedToA && !assignedToB) {
    return 0;
  }

  if (!assignedToA) {
    return -1;
  }

  if (!assignedToB) {
    return 1;
  }

  return assignedToA.localeCompare(assignedToB);
};

const findAssessment = (assessments, assessmentType) => {
  const data = assessments.find(
    ({ node: assessment }) => assessment?.assessmentDataType === assessmentType
  );

  return {
    rowId: data?.node.rowId,
    jsonData: data?.node?.jsonData,
    type: assessmentType,
    id: data?.node?.id,
  };
};

const StyledLink = styled.a`
  color: ${(props) => props.theme.color.links};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const StyledText = styled.p`
  margin: 0;
  padding-top: 5px;
`;

const StyledMRTToolBar = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
`;

const AssessmentCell = ({ cell }) => {
  const row = cell.row.original;
  const { applicationId, allAnalysts } = row;
  const assessment = cell.getValue();
  return (
    <AssessmentLead
      allAnalysts={allAnalysts.edges}
      applicationId={applicationId}
      assessmentType={assessment.type}
      jsonData={assessment.jsonData}
    />
  );
};

const CcbcIdCell = ({ cell }) => {
  const applicationId = cell.row.original?.applicationId;
  return (
    <StyledLink href={`/analyst/application/${applicationId}/assessments`}>
      {cell.getValue()}
    </StyledLink>
  );
};

interface Props {
  query: any;
}

const AssessmentAssignmentTable: React.FC<Props> = ({ query }) => {
  const queryFragment = useFragment(
    graphql`
      fragment AssessmentAssignmentTable_query on Query {
        allAnalysts(first: 1000, orderBy: GIVEN_NAME_ASC)
          @connection(key: "ListOfAnalysts_allAnalysts") {
          __id
          edges {
            node {
              familyName
              givenName
              active
              id
            }
          }
        }
        allApplications(
          filter: {
            analystStatus: { in: ["received", "screening", "assessment"] }
          }
        ) {
          edges {
            node {
              allAssessments(filter: { archivedAt: { isNull: true } }) {
                edges {
                  node {
                    jsonData
                    assessmentDataType
                    rowId
                  }
                }
              }
              organizationName
              analystStatus
              ccbcNumber
              rowId
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

  const { allAnalysts, allApplications } = queryFragment;
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

  const [sorting, setSorting] = useState<MRT_SortingState>([
    { id: 'intakeId', desc: false },
  ]);

  const [columnSizing, setColumnSizing] = useState<MRT_ColumnSizingState>({
    ccbcNumber: 129,
    organizationName: 198,
    zones: 109,
    intakeId: 106,
    screeningAssessment: 145,
    financialRiskAssessment: 143,
    gisAssessment: 139,
    pmAssessment: 139,
    techAssessment: 133,
    permittingAssessment: 144,
  });

  useEffect(() => {
    const columnFiltersSession = cookie.get('mrt_columnFilters_assessment');
    const columnVisibilitySession = cookie.get(
      'mrt_columnVisibility_assessment'
    );
    const densitySession = cookie.get('mrt_density_assessment');
    const showColumnFiltersSession = cookie.get(
      'mrt_showColumnFilters_assessment'
    );
    const sortingSession = cookie.get('mrt_sorting_assessment');
    const columnSizingSession = cookie.get('mrt_columnSizing_assessment');

    if (columnFiltersSession) {
      setColumnFilters(JSON.parse(columnFiltersSession));
    }
    if (columnVisibilitySession) {
      setColumnVisibility(JSON.parse(columnVisibilitySession));
    }
    if (densitySession) {
      setDensity(JSON.parse(densitySession));
    }

    if (showColumnFiltersSession) {
      setShowColumnFilters(JSON.parse(showColumnFiltersSession));
    }

    if (sortingSession) {
      setSorting(JSON.parse(sortingSession));
    }

    if (columnSizingSession) {
      setColumnSizing(JSON.parse(columnSizingSession));
    }

    setIsFirstRender(false);
  }, []);

  useEffect(() => {
    if (isFirstRender) return;
    cookie.set('mrt_columnFilters_assessment', JSON.stringify(columnFilters));
  }, [columnFilters, isFirstRender]);

  useEffect(() => {
    if (isFirstRender) return;
    cookie.set(
      'mrt_columnVisibility_assessment',
      JSON.stringify(columnVisibility)
    );
  }, [columnVisibility, isFirstRender]);

  useEffect(() => {
    if (isFirstRender) return;
    cookie.set('mrt_density_assessment', JSON.stringify(density));
  }, [density, isFirstRender]);

  useEffect(() => {
    if (isFirstRender) return;
    cookie.set(
      'mrt_showColumnFilters_assessment',
      JSON.stringify(showColumnFilters)
    );
  }, [showColumnFilters, isFirstRender]);

  useEffect(() => {
    if (isFirstRender) return;
    cookie.set('mrt_sorting_assessment', JSON.stringify(sorting));
  }, [sorting, isFirstRender]);

  useEffect(() => {
    if (isFirstRender) return;
    cookie.set('assessment_last_visited', JSON.stringify(true));
  }, [isFirstRender]);

  useEffect(() => {
    if (!isFirstRender) {
      cookie.set('mrt_columnSizing_assessment', JSON.stringify(columnSizing));
    }
  }, [columnSizing, isFirstRender]);

  // Separate sorting function so that MRT doesn't replace the previous
  // sorting on first render, otherwise it will set to blank
  // as sort must be called to return the array of sort
  const setSortingFn = (sort: MRT_SortingState) => {
    const newSort = sort;
    if (!isFirstRender) setSorting(newSort);
  };
  const uniqueIntakeNumbers: string[] | unknown[] | null = [
    ...new Set(allApplications.edges.map((edge) => edge.node.intakeNumber)),
  ];

  const allZones: string[] = allApplications.edges.flatMap(
    (edge) => edge.node.zones
  );
  const uniqueZones: string[] = [...new Set(allZones)].sort(
    (a, b) => Number(a) - Number(b)
  );
  const tableData = useMemo(
    () =>
      allApplications.edges
        .map(({ node: application }) => {
          // if assessments length is not 6 or any assessment is not complete
          const incompleteAssessments =
            application.allAssessments.edges.length !== 6 ||
            application.allAssessments.edges.some(
              (assessment) =>
                assessment?.node?.jsonData?.nextStep !== 'Assessment complete'
            );
          if (incompleteAssessments) {
            const {
              intakeNumber,
              ccbcNumber,
              organizationName,
              zones,
              rowId: applicationId,
            } = application;

            return {
              applicationId,
              intakeId: intakeNumber.toString(),
              ccbcNumber,
              zones,
              allAnalysts,
              pmAssessment: findAssessment(
                application.allAssessments.edges,
                'projectManagement'
              ),
              techAssessment: findAssessment(
                application.allAssessments.edges,
                'technical'
              ),
              permittingAssessment: findAssessment(
                application.allAssessments.edges,
                'permitting'
              ),
              gisAssessment: findAssessment(
                application.allAssessments.edges,
                'gis'
              ),
              screeningAssessment: findAssessment(
                application.allAssessments.edges,
                'screening'
              ),
              financialRiskAssessment: findAssessment(
                application.allAssessments.edges,
                'financialRisk'
              ),
              organizationName,
            };
          }
          return null;
        })
        .filter(Boolean),
    [allApplications, allAnalysts]
  );

  const columns = useMemo<MRT_ColumnDef<Application>[]>(() => {
    // Sonarcloud duplicate lines
    const sharedAssessmentCell = {
      Cell: AssessmentCell,
      filterSelectOptions: Object.values(allAnalysts.edges)
        .filter(({ node }) => node.active)
        .map(({ node }) => `${node.givenName} ${node.familyName}`),
      sortingFn: 'sortAnalysts',
      filterFn: 'filterAnalysts',
    };

    return [
      {
        accessorKey: 'intakeId',
        header: 'Intake',
        filterVariant: 'select',
        filterSelectOptions: uniqueIntakeNumbers as string[],
      },
      {
        accessorKey: 'ccbcNumber',
        header: 'CCBC ID',
        Cell: CcbcIdCell,
        filterFn: 'filterCcbcId',
      },
      {
        accessorKey: 'zones',
        header: 'Zone',
        Cell: ({ cell }) => (cell.getValue() as number[]).join(', '),
        filterVariant: 'select',
        filterSelectOptions: uniqueZones,
        filterFn: filterZones,
        sortingFn: sortZones,
      },
      {
        ...sharedAssessmentCell,
        accessorKey: 'screeningAssessment',
        header: 'Screening',
        filterVariant: 'select',
      },
      {
        ...sharedAssessmentCell,
        accessorKey: 'financialRiskAssessment',
        header: 'Financial',
        filterVariant: 'select',
      },
      {
        ...sharedAssessmentCell,
        accessorKey: 'gisAssessment',
        header: 'GIS',
        filterVariant: 'select',
      },
      {
        ...sharedAssessmentCell,
        accessorKey: 'pmAssessment',
        header: 'PM',
        filterVariant: 'select',
      },
      {
        ...sharedAssessmentCell,
        accessorKey: 'techAssessment',
        header: 'Tech',
        filterVariant: 'select',
      },
      {
        ...sharedAssessmentCell,
        accessorKey: 'permittingAssessment',
        header: 'Permitting',
        filterVariant: 'select',
      },
      {
        accessorKey: 'organizationName',
        header: 'Organization Name',
      },
    ];
  }, []);

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    state: {
      columnFilters,
      columnVisibility,
      density,
      showColumnFilters,
      sorting,
      columnSizing,
    },
    onSortingChange: setSortingFn,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onDensityChange: setDensity,
    onShowColumnFiltersChange: setShowColumnFilters,
    onColumnSizingChange: setColumnSizing,
    enableColumnResizing: true,
    enablePagination: false,
    enableGlobalFilter: false,
    enableBottomToolbar: false,
    autoResetAll: false,
    muiTableContainerProps: { sx: { padding: '8px' } },
    layoutMode: isLargeUp ? 'grid' : 'semantic',
    muiTableBodyCellProps: (props) => {
      return {
        align: props.column.id === 'zones' ? 'center' : 'left',
        sx: {
          padding: '8px 0px',
        },
      };
    },
    muiTableHeadCellProps: {
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
    },
    sortingFns: {
      sortAnalysts,
    },
    filterFns: {
      filterAnalysts,
      filterCcbcId,
    },
    muiTopToolbarProps: {
      sx: {
        '& .MuiBox-root': {
          paddingBottom: '0',
        },
      },
    },
    renderTopToolbarCustomActions: () => (
      <StyledText>
        Showing applications with status of “Received”, “Screening”,
        “Assessment”, and that have at least one incomplete assessment.
      </StyledText>
    ),
  });

  const visibleRowCount = table.getRowModel().rows?.length ?? 0;
  const renderRowCount = () => (
    <RowCount
      visibleRowCount={visibleRowCount}
      totalRowCount={tableData.length}
    />
  );

  /**
   * Additional row to MRT_table to display the extra actions and the color legend
   * Separating from `TopToolbarCustomActions` to manupulate styles easily
   */
  const topToolbarExtraActions = () => {
    return (
      <StyledMRTToolBar>
        <ClearFilters table={table} filters={table.getState().columnFilters} />
        <AssessmentLegend />
      </StyledMRTToolBar>
    );
  };

  return (
    <>
      {renderRowCount()}
      <Paper>
        <MRTTopToolBar table={table} />
        {topToolbarExtraActions()}
        <MRTTableContainer table={table} />
      </Paper>
      {renderRowCount()}
    </>
  );
};

export default AssessmentAssignmentTable;
