import { screen, within } from '@testing-library/react';
import mockFormData from 'tests/utils/mockFormData';
import { acknowledgementsEnum } from 'formSchema/pages/acknowledgements';
import PageTestingHelper from '../../../utils/pageTestingHelper';
import Application from '../../../../pages/analyst/application/[applicationId]';
import compiledApplicationIdQuery, {
  ApplicationIdQuery,
} from '../../../../__generated__/ApplicationIdQuery.graphql';

const mockQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        formData: {
          jsonData: mockFormData,
        },
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
    };
  },
};

const mockEmptyFormDataPayload = {
  Query() {
    return {
      applicationByRowId: {
        formData: {
          jsonData: {},
        },
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
    };
  },
};

const pageTestingHelper = new PageTestingHelper<ApplicationIdQuery>({
  pageComponent: Application,
  compiledQuery: compiledApplicationIdQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    rowId: 1,
  },
});

describe('The analyst view application page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      query: { applicationId: '1' },
    });
  });

  it('displays the correct nav links when user is logged in', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('displays the correct title', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByRole('heading', { name: 'Application' })
    ).toBeInTheDocument();
  });

  it('should have correct heading styles', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const heading = screen.getByRole('heading', {
      name: 'Project information',
    });

    const style = window.getComputedStyle(heading);

    expect(style.fontSize).toBe('24px');
    expect(style.marginBottom).toBe('0px');
  });

  it('should have correct subheading styles', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const subheading = screen.getAllByText('Amount requested under source:')[0];

    const style = window.getComputedStyle(subheading);

    expect(style.fontSize).toBe('14px');
    expect(style.fontWeight).toBe('600');
    expect(style.padding).toBe('16px');
    expect(style.margin).toBe('0px');
  });

  it('should have correct sections', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByRole('heading', { name: 'Project information' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Project area' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Existing network coverage' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Budget details' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Project funding' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Other funding sources' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Technological solution' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Benefits' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Project planning and management' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Estimated project employment' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Template uploads' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Supporting documents' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Coverage' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Organization profile' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Organization location' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Organization contact information' })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Review' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Acknowledgements' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Submission' })
    ).toBeInTheDocument();
  });

  it('should have the correct fields in the Project Area section', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const section = within(
      screen.getByRole('heading', { name: 'Project area' }).closest('section')
    );

    expect(
      section
        .getByText(/which zone\(s\) will this project be conducted in\?/i)
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('1');

    expect(
      section
        .getByText(/Does your Project span multiple provinces\/territories\?/i)
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent(/yes/i);

    expect(
      section
        .getByText(/select the provinces or territories/i)
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent(/Alberta,Northwest Territories/i);
  });

  it('should have correct fields in the budget details section', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const section = within(
      screen.getByRole('heading', { name: 'Budget details' }).closest('section')
    );

    expect(
      section
        .getByText(/Total project cost/i)
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('$1 230');

    expect(
      section
        .getByText(/Total eligible cost/i)
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('$1 000');
  });

  it('should display headings in the estimated employment', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const section = within(
      screen
        .getByRole('heading', { name: 'Estimated project employment' })
        .closest('section')
    );

    expect(section.getByText('Estimated direct employees')).toBeInTheDocument();
    expect(
      section.getByText('Estimated contractor labour')
    ).toBeInTheDocument();
  });

  it('should have correct fields in the Existing network coverage section', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const section = within(
      screen
        .getByRole('heading', { name: 'Existing network coverage' })
        .closest('section')
    );

    expect(
      section
        .getByText(/Does the Applicant own Passive Infrastructure/i)
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent(/yes/i);
  });

  it('should display empty red fields in the budget details section when there are errors', () => {
    pageTestingHelper.loadQuery(mockEmptyFormDataPayload);
    pageTestingHelper.renderPage();

    const section = within(
      screen.getByRole('heading', { name: 'Budget details' }).closest('section')
    );

    const errorCell = section
      .getByText('Total project cost (Template 2 - cell H28)')
      .closest('tr')
      .getElementsByTagName('td')[0];

    expect(errorCell).toBeEmptyDOMElement();
    expect(errorCell).toHaveStyle('background-color: rgba(248, 214, 203, 0.4)');
  });

  it('should have correct fields in the Project funding  section', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      document.getElementById('root_projectFunding_fundingRequestedCCBC2223')
    ).toHaveTextContent(`2022-23`);

    expect(
      document.getElementById('root_projectFunding_fundingRequestedCCBC2324')
    ).toHaveTextContent(`2023-24`);

    expect(
      document.getElementById('root_projectFunding_fundingRequestedCCBC2425')
    ).toHaveTextContent(`2024-25`);

    expect(
      document.getElementById('root_projectFunding_fundingRequestedCCBC2526')
    ).toHaveTextContent(`2025-26`);

    expect(
      document.getElementById('root_projectFunding_fundingRequestedCCBC2627')
    ).toHaveTextContent(`2026-27`);

    expect(
      document.getElementById('root_projectFunding_totalFundingRequestedCCBC')
    ).toHaveTextContent(`Total amount requested under CCBC`);

    expect(
      document.getElementById('root_projectFunding_applicationContribution2223')
    ).toHaveTextContent(`2022-23`);

    expect(
      document.getElementById('root_projectFunding_applicationContribution2324')
    ).toHaveTextContent(`2023-24`);

    expect(
      document.getElementById('root_projectFunding_applicationContribution2425')
    ).toHaveTextContent(`2024-25`);

    expect(
      document.getElementById('root_projectFunding_applicationContribution2526')
    ).toHaveTextContent(`2025-26`);

    expect(
      document.getElementById('root_projectFunding_applicationContribution2627')
    ).toHaveTextContent(`2026-27`);

    expect(
      document.getElementById('root_projectFunding_totalApplicantContribution')
    ).toHaveTextContent(`Total amount Applicant will contribute`);
  });

  it('should have correct fields in The Technological solution section', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const section = within(
      screen
        .getByRole('heading', { name: /Technological solution/i })
        .closest('section')
    );

    expect(
      section
        .getByText(/System design/i)
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('design of system');

    expect(
      section
        .getByText(/Scalability/i)
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('much scalable');

    expect(
      section
        .getByText(/backbone technology/i)
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('Fibre,Satellite');

    expect(
      section
        .getByText(/last mile technology/i)
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('Fibre,Fixed wireless');
  });

  it('should have correct fields in The Project planning section', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();
    const section = within(
      screen
        .getByRole('heading', { name: /Project planning/i })
        .closest('section')
    );

    expect(
      section
        .getByText('Project Start Date (YYYY/MM/DD)')
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('2022-06-10');
  });

  it('should have correct fields in The Other funding sources section', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const section = within(
      screen
        .getByRole('heading', { name: 'Other funding sources' })
        .closest('section')
    );

    expect(
      section
        .getAllByText('2022-23')[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('$1');

    expect(
      section
        .getAllByText('2023-24')[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('$2');

    expect(
      section
        .getAllByText('2024-25')[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('$3');

    expect(
      section
        .getAllByText('2025-26')[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('$4');

    expect(
      section
        .getAllByText('2026-27')[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('$5');

    expect(
      section
        .getByText(/Total amount requested under Canadian Infrastructure Bank/i)
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('$15');
  });

  it('should the correct fields in the Organization location section', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const section = within(
      screen
        .getByRole('heading', { name: 'Organization location' })
        .closest('section')
    );

    expect(
      section
        .getAllByText(/city/i)[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent(/victoria/i);

    expect(
      section
        .getAllByText(/unit number/i)[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent(/1231231/i);

    expect(
      section
        .getByText(/Is the mailing address the same as above/i)
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent(/no/i);
  });

  it('should have the correct field and value in the Organization profile section', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(document.getElementById('bandNumber-error')).toBeNull();
  });

  it('should have the correct error in the Review section if form checkbox not checked', () => {
    pageTestingHelper.loadQuery(mockEmptyFormDataPayload);
    pageTestingHelper.renderPage();

    const section = within(
      screen.getByRole('heading', { name: 'Review' }).closest('section')
    );

    expect(
      section
        .getAllByText(
          'By checking this box, you acknowledge that there are incomplete fields and incomplete applications may not be assessed. If the incomplete fields are not applicable to you, please check the box and continue to the acknowledgements page.'
        )[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveStyle('background-color: rgba(248, 214, 203, 0.4)');
  });

  it('should have the correct value in the Review section if form checkbox is checked', () => {
    const payload = {
      Query() {
        return {
          applicationByRowId: {
            formData: {
              jsonData: {
                review: {
                  acknowledgeIncomplete: true,
                },
              },
            },
          },
          session: {
            sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
          },
        };
      },
    };
    pageTestingHelper.loadQuery(payload);
    pageTestingHelper.renderPage();

    const section = within(
      screen.getByRole('heading', { name: 'Review' }).closest('section')
    );

    expect(
      section
        .getAllByText(
          'By checking this box, you acknowledge that there are incomplete fields and incomplete applications may not be assessed. If the incomplete fields are not applicable to you, please check the box and continue to the acknowledgements page.'
        )[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('Yes');
  });

  it('should have the correct message in the Review section if form has no validation errors', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const section = within(
      screen.getByRole('heading', { name: 'Review' }).closest('section')
    );

    expect(
      section.getByText('All mandatory fields are filled')
    ).toBeInTheDocument();
  });

  it('should have correct fields in Acknowledgements section', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const section = within(
      screen
        .getByRole('heading', { name: 'Acknowledgements' })
        .closest('section')
    );

    expect(
      section
        .getAllByText(acknowledgementsEnum[0])[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('Yes');

    expect(
      section
        .getAllByText(acknowledgementsEnum[1])[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('Yes');

    expect(
      section
        .getAllByText(acknowledgementsEnum[2])[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('Yes');

    expect(
      section
        .getAllByText(acknowledgementsEnum[3])[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('Yes');

    expect(
      section
        .getAllByText(acknowledgementsEnum[3])[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('Yes');

    expect(
      section
        .getAllByText(acknowledgementsEnum[5])[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('Yes');

    expect(
      section
        .getAllByText(acknowledgementsEnum[6])[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('Yes');

    expect(
      section
        .getAllByText(acknowledgementsEnum[7])[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('Yes');

    expect(
      section
        .getAllByText(acknowledgementsEnum[8])[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('Yes');

    expect(
      section
        .getAllByText(acknowledgementsEnum[9])[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('Yes');

    expect(
      section
        .getAllByText(acknowledgementsEnum[10])[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('Yes');

    expect(
      section
        .getAllByText(acknowledgementsEnum[11])[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('Yes');

    expect(
      section
        .getAllByText(acknowledgementsEnum[12])[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('Yes');

    expect(
      section
        .getAllByText(acknowledgementsEnum[13])[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('Yes');

    expect(
      section
        .getAllByText(acknowledgementsEnum[14])[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('Yes');

    expect(
      section
        .getAllByText(acknowledgementsEnum[15])[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('Yes');

    expect(
      section
        .getAllByText(acknowledgementsEnum[16])[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('Yes');
  });

  it('should the correct fields in the Submission section', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const section = within(
      screen.getByRole('heading', { name: 'Submission' }).closest('section')
    );

    expect(
      section
        .getAllByText('Completed for (Legal organization name)')[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent(mockFormData.submission.submissionCompletedFor);

    expect(
      section
        .getAllByText('Completed by')[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent(mockFormData.submission.submissionCompletedBy);

    expect(
      section.getByText('Title').closest('tr').getElementsByTagName('td')[0]
    ).toHaveTextContent(mockFormData.submission.submissionTitle);

    expect(
      section
        .getAllByText('On this date (YYYY-MM-DD)')[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent(mockFormData.submission.submissionDate);
  });
});
