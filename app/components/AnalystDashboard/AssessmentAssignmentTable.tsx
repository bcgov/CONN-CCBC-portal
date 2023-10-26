import { useMemo } from 'react';
import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import AssessmentLead from 'components/AnalystDashboard/AssessmentLead';

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
  color: ${(props) => props.theme.color.text};
  text-decoration: none;
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
            status: {
              in: ["received", "screening", "assessment", "recommendation"]
            }
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
              status
              ccbcNumber
              rowId
              projectName
              intakeId
            }
          }
        }
      }
    `,
    query
  );

  const { allAnalysts, allApplications } = queryFragment;
  const isLargeUp = useMediaQuery('(min-width:1007px)');
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
          projectTitle: projectName,
          organizationName,
        };
      }),
    [allApplications]
  );

  const assessmentWidth = 36;
  const columns = useMemo<MRT_ColumnDef<Application>[]>(
    () => [
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
        accessorKey: 'pmAssessment',
        header: 'PM Assessment',
        size: assessmentWidth,
        maxSize: assessmentWidth,
        Cell: AssessmentCell,
        sortingFn: 'sortAnalysts',
        filterFn: 'filterAnalysts',
      },
      {
        accessorKey: 'techAssessment',
        header: 'Tech Assessment',
        size: assessmentWidth,
        maxSize: assessmentWidth,
        Cell: AssessmentCell,
        sortingFn: 'sortAnalysts',
        filterFn: 'filterAnalysts',
      },
      {
        accessorKey: 'permittingAssessment',
        header: 'Permitting Assessment',
        size: assessmentWidth,
        maxSize: assessmentWidth,
        Cell: AssessmentCell,
        sortingFn: 'sortAnalysts',
        filterFn: 'filterAnalysts',
      },
      {
        accessorKey: 'gisAssessment',
        header: 'GIS Assessment',
        size: assessmentWidth,
        maxSize: assessmentWidth,
        Cell: AssessmentCell,
        sortingFn: 'sortAnalysts',
        filterFn: 'filterAnalysts',
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
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    // we may want to enable pagination in the future
    enablePagination: false,
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
      },
    },
    sortingFns: {
      sortAnalysts: (rowA, rowB, columnId) => {
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
      },
    },
    filterFns: {
      filterAnalysts: (row, id, filterValue) => {
        const value = row.getValue(id) as any;
        const assignedTo = value?.jsonData?.assignedTo;

        if (!assignedTo) {
          return false;
        }

        return assignedTo.toLowerCase().includes(filterValue.toLowerCase());
      },
      filterCcbcId: (row, id, filterValue) => {
        const value = row.getValue(id) as any;

        if (!value) {
          return false;
        }
        return value.toLowerCase().includes(filterValue.toLowerCase());
      },
    },
  });
  return <MaterialReactTable table={table} />;
};

export default AssessmentAssignmentTable;
