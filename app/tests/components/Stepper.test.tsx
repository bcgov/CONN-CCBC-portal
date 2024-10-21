import Stepper from 'components/Stepper';
import schema from 'formSchema/schema';
import { render, screen } from '@testing-library/react';
import GlobalTheme, { theme } from 'styles/GlobalTheme';

const renderStaticLayout = () => {
  return render(
    <GlobalTheme>
      <Stepper schema={schema} />
    </GlobalTheme>
  );
};

jest.mock('next/router', () => ({
  useRouter() {
    return {
      query: { id: 1, page: 1 },
    };
  },
}));

describe('The Stepper component', () => {
  beforeEach(() => {
    renderStaticLayout();
  });

  it('should have correct background colour when active', () => {
    const link = screen.getByText('Project information').parentElement;

    expect(link).toHaveStyle({ backgroundColor: theme.color.stepperBlue });
  });

  it('should have correct links', () => {
    const projectInformation = screen.getByText('Project information');
    expect(projectInformation).toHaveAttribute(
      'href',
      '/applicantportal/form/1/1'
    );

    const projectArea = screen.getByText('Project area');
    expect(projectArea).toHaveAttribute('href', '/applicantportal/form/1/2');

    const existingNetworkCoverage = screen.getByText(
      'Existing network coverage'
    );
    expect(existingNetworkCoverage).toHaveAttribute(
      'href',
      '/applicantportal/form/1/3'
    );

    const budgetDetails = screen.getByText('Budget details');
    expect(budgetDetails).toHaveAttribute('href', '/applicantportal/form/1/4');

    const projectFunding = screen.getByText('Project funding');
    expect(projectFunding).toHaveAttribute('href', '/applicantportal/form/1/5');

    const otherFundingSources = screen.getByText('Other funding sources');
    expect(otherFundingSources).toHaveAttribute(
      'href',
      '/applicantportal/form/1/6'
    );

    const technologicalSolution = screen.getByText('Technological solution');
    expect(technologicalSolution).toHaveAttribute(
      'href',
      '/applicantportal/form/1/7'
    );

    const benefits = screen.getByText('Benefits');
    expect(benefits).toHaveAttribute('href', '/applicantportal/form/1/8');

    const projectPlanning = screen.getByText('Project planning and management');
    expect(projectPlanning).toHaveAttribute(
      'href',
      '/applicantportal/form/1/9'
    );

    const estimatedProjectEmployment = screen.getByText(
      'Estimated project employment'
    );
    expect(estimatedProjectEmployment).toHaveAttribute(
      'href',
      '/applicantportal/form/1/10'
    );

    const templateUploads = screen.getByText('Template uploads');
    expect(templateUploads).toHaveAttribute(
      'href',
      '/applicantportal/form/1/11'
    );

    const supportingDocuments = screen.getByText('Supporting documents');
    expect(supportingDocuments).toHaveAttribute(
      'href',
      '/applicantportal/form/1/12'
    );

    const coverage = screen.getByText('Coverage');
    expect(coverage).toHaveAttribute('href', '/applicantportal/form/1/13');

    const organizationProfile = screen.getByText('Organization profile');
    expect(organizationProfile).toHaveAttribute(
      'href',
      '/applicantportal/form/1/14'
    );

    const organizationLocation = screen.getByText('Organization location');
    expect(organizationLocation).toHaveAttribute(
      'href',
      '/applicantportal/form/1/15'
    );

    const organizationContactInformation = screen.getByText(
      'Organization contact information'
    );
    expect(organizationContactInformation).toHaveAttribute(
      'href',
      '/applicantportal/form/1/16'
    );

    const authorizedBusinessContact = screen.getByText(
      'Authorized business contact'
    );
    expect(authorizedBusinessContact).toHaveAttribute(
      'href',
      '/applicantportal/form/1/17'
    );

    const alternateBusinessContact = screen.getByText(
      'Alternate business contact'
    );
    expect(alternateBusinessContact).toHaveAttribute(
      'href',
      '/applicantportal/form/1/18'
    );

    const review = screen.getByText('Review');
    expect(review).toHaveAttribute('href', '/applicantportal/form/1/19');

    const acknowledgements = screen.getByText('Acknowledgements');
    expect(acknowledgements).toHaveAttribute(
      'href',
      '/applicantportal/form/1/20'
    );
  });

  it('should have correct background colour when not active active', () => {
    const link = screen.getByText('Project area').parentElement;
    const style = window.getComputedStyle(link);

    expect(style.backgroundColor).toBe('rgba(196, 196, 196, 0.06)');
  });
});
