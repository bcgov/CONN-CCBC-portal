import { useEffect, useMemo, useState } from 'react';
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

import AssessmentLead from 'components/AnalystDashboard/AssessmentLead';
import RowCount from 'components/Table/RowCount';
import { Box } from '@mui/material';
import ClearFilters from 'components/Table/ClearFilters';

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

const filterZones = (row, id, filterValue) => {
  const zones = row.getValue(id) as any;

  if (!zones) {
    return false;
  }

  return zones.some((zone) => zone === filterValue);
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
        allAnalysts(
          first: 1000
          filter: { active: { equalTo: true } }
          orderBy: GIVEN_NAME_ASC
        ) @connection(key: "ListOfAnalysts_allAnalysts") {
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
              intakeId
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

  // Separate sorting function so that MRT doesn't replace the previous
  // sorting on first render, otherwise it will set to blank
  // as sort must be called to return the array of sort
  const setSortingFn = (sort) => {
    const newSort = sort();
    if (!isFirstRender) setSorting(newSort);
  };
  const uniqueIntakeIds: string[] | unknown[] | null = [
    ...new Set(allApplications.edges.map((edge) => edge.node.intakeId)),
  ];

  const allZones: string[] = allApplications.edges.flatMap(
    (edge) => edge.node.zones
  );
  const uniqueZones: string[] = [...new Set(allZones)].sort(
    (a, b) => Number(a) - Number(b)
  );

  const tableData = useMemo(
    () =>
      allApplications.edges.map(({ node: application }) => {
        const {
          intakeId,
          ccbcNumber,
          organizationName,
          zones,
          rowId: applicationId,
        } = application;

        return {
          applicationId,
          intakeId: intakeId.toString(),
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
          organizationName,
        };
      }),
    [allApplications, allAnalysts]
  );

  const assessmentWidth = 30;

  const columns = useMemo<MRT_ColumnDef<Application>[]>(() => {
    // Sonarcloud duplicate lines
    const sharedAssessmentCell = {
      size: assessmentWidth,
      maxSize: assessmentWidth,
      Cell: AssessmentCell,
      filterSelectOptions: Object.values(allAnalysts.edges).map(
        ({ node }) => `${node.givenName} ${node.familyName}`
      ),
      sortingFn: 'sortAnalysts',
      filterFn: 'filterAnalysts',
    };

    return [
      {
        accessorKey: 'intakeId',
        header: 'Intake',
        size: 24,
        maxSize: 24,
        filterVariant: 'select',
        filterSelectOptions: uniqueIntakeIds as string[],
      },
      {
        accessorKey: 'ccbcNumber',
        header: 'CCBC ID',
        size: 26,
        maxSize: 26,
        Cell: CcbcIdCell,
        filterFn: 'filterCcbcId',
      },
      {
        accessorKey: 'zones',
        header: 'Zone',
        size: 24,
        maxSize: 24,
        Cell: ({ cell }) => (cell.getValue() as number[]).join(', '),
        filterVariant: 'select',
        filterSelectOptions: uniqueZones,
        filterFn: filterZones,
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
        ...sharedAssessmentCell,
        accessorKey: 'gisAssessment',
        header: 'GIS',
        filterVariant: 'select',
      },
      {
        accessorKey: 'organizationName',
        header: 'Organization Name',
        size: 30,
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
    },
    onSortingChange: setSortingFn,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onDensityChange: setDensity,
    onShowColumnFiltersChange: setShowColumnFilters,
    enablePagination: false,
    enableGlobalFilter: false,
    enableBottomToolbar: false,
    autoResetAll: false,
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
    sortingFns: {
      sortAnalysts,
    },
    filterFns: {
      filterAnalysts,
      filterCcbcId,
    },
    renderTopToolbarCustomActions: () => (
      <Box>
        <StyledText>
          Showing applications with status of “Received”, “Screening” and
          “Assessment.”
        </StyledText>
        <ClearFilters table={table} filters={table.getState().columnFilters} />
      </Box>
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

export default AssessmentAssignmentTable;
