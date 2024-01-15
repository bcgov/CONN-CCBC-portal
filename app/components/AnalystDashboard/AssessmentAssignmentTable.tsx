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

type Assessment = {
  rowId: string;
  assignedTo: string;
  type: string;
};

type Application = {
  ccbcNumber: string;
  applicationId: number;
  package: number;
  pmAssessment: Assessment;
  techAssessment: Assessment;
  permittingAssessment: Assessment;
  gisAssessment: Assessment;
  targetDate: string;
  projectTitle: string;
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
              package
              analystStatus
              ccbcNumber
              rowId
              projectName
              intakeId
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

  const [sorting, setSorting] = useState<MRT_SortingState>([]);

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

  const tableData = useMemo(
    () =>
      allApplications.edges.map(({ node: application }) => {
        const {
          ccbcNumber,
          organizationName,
          package: packageNumber,
          projectName,
          rowId: applicationId,
        } = application;

        return {
          applicationId,
          ccbcNumber,
          packageNumber,
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
          // displaying target date from technical assessment
          targetDate: findAssessment(
            application.allAssessments.edges,
            'technical'
          ),
          projectTitle:
            application.applicationSowDataByApplicationId?.nodes[0]?.jsonData
              ?.projectTitle || projectName,
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
      sortingFn: 'sortAnalysts',
      filterFn: 'filterAnalysts',
    };

    return [
      {
        accessorKey: 'ccbcNumber',
        header: 'CCBC ID',
        size: 26,
        maxSize: 26,
        Cell: CcbcIdCell,
        filterFn: 'filterCcbcId',
      },
      {
        accessorKey: 'packageNumber',
        header: 'Package',
        size: 24,
        maxSize: 24,
      },
      {
        ...sharedAssessmentCell,
        accessorKey: 'pmAssessment',
        header: 'PM',
      },
      {
        ...sharedAssessmentCell,
        accessorKey: 'techAssessment',
        header: 'Tech',
      },
      {
        ...sharedAssessmentCell,
        accessorKey: 'permittingAssessment',
        header: 'Permitting',
      },
      {
        ...sharedAssessmentCell,
        accessorKey: 'gisAssessment',
        header: 'GIS',
      },
      {
        accessorKey: 'techAssessment.jsonData.targetDate',
        header: 'Target Date',
        size: 30,
        maxSize: 30,
      },
      {
        accessorKey: 'projectTitle',
        header: 'Project Title',
        size: 30,
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
    sortingFns: {
      sortAnalysts,
    },
    filterFns: {
      filterAnalysts,
      filterCcbcId,
    },
    renderTopToolbarCustomActions: () => (
      <p style={{ margin: '0', marginTop: '20px' }}>
        Showing applications with status of “Received”, “Screening” and
        “Assessment.”
      </p>
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
