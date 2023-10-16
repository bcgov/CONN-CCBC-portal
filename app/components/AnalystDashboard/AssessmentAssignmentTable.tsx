import { useMemo } from 'react';
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
    assignedTo: data?.node?.jsonData?.assignedTo,
    type: data?.node?.assessmentDataType,
  };
};

interface Props {
  allApplications;
}
const AssessmentAssignmentTable: React.FC<Props> = ({ allApplications }) => {
  const tableData = useMemo(
    () =>
      allApplications.edges.map(({ node: application }) => {
        const {
          ccbcNumber,
          organizationName,
          package: packageNumber,
          projectName,
        } = application;

        return {
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
          targetDate: '2021-01-01',
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
      },
      {
        accessorKey: 'packageNumber',
        header: 'Package',
        size: 10,
      },
      {
        accessorKey: 'pmAssessment.assignedTo',
        header: 'PM Assessment',
        size: 50,
      },
      {
        accessorKey: 'techAssessment.assignedTo',
        header: 'Tech Assessment',
        size: 50,
      },
      {
        accessorKey: 'permittingAssessment.assignedTo',
        header: 'Permitting Assessment',
        size: 50,
      },
      {
        accessorKey: 'gisAssessment.assignedTo',
        header: 'GIS Assessment',
        size: 50,
      },
      {
        accessorKey: 'targetDate',
        header: 'Target Date',
        size: 50,
      },
      {
        accessorKey: 'projectTitle',
        header: 'Project Title',
        size: 50,
      },
      {
        accessorKey: 'organizationName',
        header: 'Organization Name',
        size: 50,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    // we may want to enable pagination in the future
    enablePagination: false,
  });
  return <MaterialReactTable table={table} />;
};

export default AssessmentAssignmentTable;
