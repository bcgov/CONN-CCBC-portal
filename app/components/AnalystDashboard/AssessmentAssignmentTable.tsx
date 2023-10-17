import { useMemo } from 'react';
import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';

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
    type: data?.node?.assessmentDataType,
  };
};

const StyledLink = styled.a`
  color: ${(props) => props.theme.color.text};
  text-decoration: none;
`;

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

  const { allApplications } = queryFragment;

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

  const columns = useMemo<MRT_ColumnDef<Application>[]>(
    () => [
      {
        accessorKey: 'ccbcNumber',
        header: 'CCBC ID',
        size: 30,

        Cell: CcbcIdCell,
      },
      {
        accessorKey: 'packageNumber',
        header: 'Package',
        size: 10,
      },
      {
        accessorKey: 'pmAssessment.jsonData.assignedTo',
        header: 'PM Assessment',
        size: 30,
      },
      {
        accessorKey: 'techAssessment.jsonData.assignedTo',
        header: 'Tech Assessment',
        size: 30,
      },
      {
        accessorKey: 'permittingAssessment.jsonData.assignedTo',
        header: 'Permitting Assessment',
        size: 30,
      },
      {
        accessorKey: 'gisAssessment.jsonData.assignedTo',
        header: 'GIS Assessment',
        size: 30,
      },
      {
        accessorKey: 'techAssessment.jsonData.targetDate',
        header: 'Target Date',
        size: 30,
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
    muiTableBodyCellProps: {
      sx: {
        padding: '8px 0px',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        padding: '0px',
      },
    },
  });
  return <MaterialReactTable table={table} />;
};

export default AssessmentAssignmentTable;
