import { render, screen } from '@testing-library/react';
import AssessmentAssignmentTable from 'components/AnalystDashboard/AssessmentAssignmentTable';
import GlobalTheme from 'styles/GlobalTheme';

const mockAllApplications = {
  edges: [
    {
      node: {
        allAssessments: {
          edges: [
            {
              node: {
                jsonData: {
                  nextStep: 'Not started',
                  assignedTo: 'Test Analyst GIS',
                },
                assessmentDataType: 'gis',
                rowId: 2,
              },
            },
            {
              node: {
                jsonData: {
                  nextStep: 'Not started',
                  assignedTo: 'Test Analyst Project Management',
                },
                assessmentDataType: 'projectManagement',
                rowId: 4,
              },
            },

            {
              node: {
                jsonData: {
                  nextStep: 'Not started',
                  assignedTo: 'Test Analyst Permitting',
                },
                assessmentDataType: 'permitting',
                rowId: 6,
              },
            },
            {
              node: {
                jsonData: {
                  decision: 'No decision',
                  nextStep: 'Not started',
                  assignedTo: 'Test Analyst Technical',
                  targetDate: '2023-10-26',
                },
                assessmentDataType: 'technical',
                rowId: 7,
              },
            },
          ],
        },
        organizationName: 'org name received',
        package: 1,
        status: 'received',
        ccbcNumber: 'CCBC-010001',
        rowId: 1,
        projectName: 'Received Application Title',
        intakeId: 1,
      },
    },
    {
      node: {
        allAssessments: {
          edges: [],
        },
        organizationName: 'org name 2',
        package: null,
        status: 'received',
        ccbcNumber: 'CCBC-010002',
        rowId: 2,
        projectName: 'Received Application Title 2',
        intakeId: 1,
      },
    },
    {
      node: {
        allAssessments: {
          edges: [],
        },
        organizationName: 'more testing',
        package: null,
        status: 'received',
        ccbcNumber: 'CCBC-010006',
        rowId: 8,
        projectName: null,
        intakeId: 1,
      },
    },
    {
      node: {
        allAssessments: {
          edges: [],
        },
        organizationName: 'org name ',
        package: null,
        status: 'received',
        ccbcNumber: 'CCBC-010007',
        rowId: 9,
        projectName: null,
        intakeId: 1,
      },
    },
  ],
};

const renderStaticLayout = () => {
  return render(
    <GlobalTheme>
      <AssessmentAssignmentTable allApplications={mockAllApplications} />
    </GlobalTheme>
  );
};

describe('The AssessmentAssignmentTable component', () => {
  it('should render the table headers', () => {
    renderStaticLayout();
    expect(screen.getByText('CCBC ID')).toBeInTheDocument();
    expect(screen.getByText('Package')).toBeInTheDocument();
    expect(screen.getByText('PM Assessment')).toBeInTheDocument();
    expect(screen.getByText('Tech Assessment')).toBeInTheDocument();
    expect(screen.getByText('Permitting Assessment')).toBeInTheDocument();
    expect(screen.getByText('GIS Assessment')).toBeInTheDocument();
    expect(screen.getByText('Project Title')).toBeInTheDocument();
    expect(screen.getByText('Organization Name')).toBeInTheDocument();
  });

  it('should render the correct row data', () => {
    renderStaticLayout();
    expect(screen.getByText('CCBC-010001')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(
      screen.getByText('Test Analyst Project Management')
    ).toBeInTheDocument();
    expect(screen.getByText('Test Analyst Technical')).toBeInTheDocument();
    expect(screen.getByText('Test Analyst Permitting')).toBeInTheDocument();
    expect(screen.getByText('Test Analyst GIS')).toBeInTheDocument();
    expect(screen.getByText('2023-10-26')).toBeInTheDocument();
    expect(screen.getByText('Received Application Title')).toBeInTheDocument();
    expect(screen.getByText('org name received')).toBeInTheDocument();
  });
});
