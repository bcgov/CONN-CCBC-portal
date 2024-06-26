// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, within } from '@testing-library/react';
import { schema } from 'formSchema';
import mockFormData from 'tests/utils/mockFormData';

const mockQueryPayload = {
  Application() {
    return {
      formData: {
        id: 'TestFormId',
        rowId: 123,
        jsonData: {},
        isEditable: true,
        updatedAt: '2022-09-12T14:04:10.790848-07:00',
        formByFormSchemaId: {
          jsonSchema: schema,
        },
      },
      status: 'draft',
    };
  },
  Query() {
    return {
      openIntake: {
        closeTimestamp: '2022-08-27T12:51:26.69172-04:00',
      },
    };
  },
};

const mockQueryPayloadWithFormData = {
  ...mockQueryPayload,
  Application() {
    return {
      formData: {
        id: 'TestFormId',
        jsonData: mockFormData,
        isEditable: true,
        formByFormSchemaId: {
          jsonSchema: schema,
        },
      },
      status: 'draft',
    };
  },
};

// Tests for the Review Theme that are shared between the review page and the analyst application view
// Must pass in a function with query loader and renderer that accepts a payload.
//
// Example usage:
//
// sharedReviewThemeTests((payload) => {
//   pageTestingHelper.loadQuery(payload);
//   pageTestingHelper.renderPage();
// });

const sharedReviewThemeTests = (renderTest) => {
  it('should have correct sections', () => {
    renderTest(mockQueryPayloadWithFormData);

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
      screen.getByRole('heading', {
        name: 'Organization contact information',
      })
    ).toBeInTheDocument();
  });

  it('should have correct heading styles', () => {
    renderTest(mockQueryPayloadWithFormData);

    const heading = screen.getByRole('heading', {
      name: 'Project information',
    });

    const style = window.getComputedStyle(heading);

    expect(style.fontSize).toBe('24px');
    expect(style.marginBottom).toBe('0px');
  });

  it('should have correct subheading styles', () => {
    renderTest(mockQueryPayloadWithFormData);

    const subheading = screen.getAllByText('Amount requested under source:')[0];

    const style = window.getComputedStyle(subheading);

    expect(style.fontSize).toBe('14px');
    expect(style.fontWeight).toBe('600');
    expect(style.padding).toBe('16px');
    expect(style.margin).toBe('0px');
  });

  it('should have the correct fields in the Project Area section', () => {
    renderTest(mockQueryPayloadWithFormData);

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
    renderTest(mockQueryPayloadWithFormData);

    const section = within(
      screen.getByRole('heading', { name: 'Budget details' }).closest('section')
    );

    expect(
      section
        .getByText(/Total project cost/i)
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('$1,230');

    expect(
      section
        .getByText(/Total eligible cost/i)
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('$1,000');
  });

  it('should display headings in the estimated employment', () => {
    renderTest(mockQueryPayloadWithFormData);

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

  it('should display empty red fields in the budget details section when there are errors', () => {
    renderTest(mockQueryPayload);

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

  it('should have correct fields in the Existing network coverage section', () => {
    renderTest(mockQueryPayloadWithFormData);

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

  it('should have correct fields in the Project funding  section', () => {
    renderTest(mockQueryPayloadWithFormData);

    expect(
      document.getElementById(
        'root_projectFunding_fundingRequestedCCBC2223_title'
      )
    ).toHaveTextContent(`2022-23`);

    expect(
      document.getElementById(
        'root_projectFunding_fundingRequestedCCBC2324_title'
      )
    ).toHaveTextContent(`2023-24`);

    expect(
      document.getElementById(
        'root_projectFunding_fundingRequestedCCBC2425_title'
      )
    ).toHaveTextContent(`2024-25`);

    expect(
      document.getElementById(
        'root_projectFunding_fundingRequestedCCBC2526_title'
      )
    ).toHaveTextContent(`2025-26`);

    expect(
      document.getElementById(
        'root_projectFunding_fundingRequestedCCBC2627_title'
      )
    ).toHaveTextContent(`2026-27`);

    expect(
      document.getElementById(
        'root_projectFunding_totalFundingRequestedCCBC_title'
      )
    ).toHaveTextContent(`Total amount requested under CCBC`);

    expect(
      document.getElementById(
        'root_projectFunding_applicationContribution2223_title'
      )
    ).toHaveTextContent(`2022-23`);

    expect(
      document.getElementById(
        'root_projectFunding_applicationContribution2324_title'
      )
    ).toHaveTextContent(`2023-24`);

    expect(
      document.getElementById(
        'root_projectFunding_applicationContribution2425_title'
      )
    ).toHaveTextContent(`2024-25`);

    expect(
      document.getElementById(
        'root_projectFunding_applicationContribution2526_title'
      )
    ).toHaveTextContent(`2025-26`);

    expect(
      document.getElementById(
        'root_projectFunding_applicationContribution2627_title'
      )
    ).toHaveTextContent(`2026-27`);

    expect(
      document.getElementById(
        'root_projectFunding_totalApplicantContribution_title'
      )
    ).toHaveTextContent(`Total amount Applicant will contribute`);
  });

  it('should have correct fields in The Technological solution section', () => {
    renderTest(mockQueryPayloadWithFormData);

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
    renderTest(mockQueryPayloadWithFormData);

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
    renderTest(mockQueryPayloadWithFormData);

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
    renderTest(mockQueryPayloadWithFormData);

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
    renderTest(mockQueryPayloadWithFormData);

    expect(document.getElementById('bandNumber-error')).toBeNull();
  });
};

// eslint-disable-next-line jest/no-export
export default sharedReviewThemeTests;
