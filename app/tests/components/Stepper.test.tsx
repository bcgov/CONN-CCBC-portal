import Stepper from 'components/Stepper';
import { render, screen } from '@testing-library/react';
import GlobalTheme from 'styles/GlobalTheme';
import { theme } from 'styles/GlobalTheme';

const renderStaticLayout = () => {
  return render(
    <GlobalTheme>
      <Stepper />
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
    expect(projectInformation).toHaveAttribute('href', '/form/1/1');

    const projectArea = screen.getByText('Project area');
    expect(projectArea).toHaveAttribute('href', '/form/1/2');

    const existingNetworkCoverage = screen.getByText(
      'Existing network coverage'
    );
    expect(existingNetworkCoverage).toHaveAttribute('href', '/form/1/3');

    const budgetDetails = screen.getByText('Budget details');
    expect(budgetDetails).toHaveAttribute('href', '/form/1/4');

    const projectFunding = screen.getByText('Project funding');
    expect(projectFunding).toHaveAttribute('href', '/form/1/5');

    const otherFundingSources = screen.getByText('Other funding sources');
    expect(otherFundingSources).toHaveAttribute('href', '/form/1/6');

    const technologicalSolution = screen.getByText('Technological solution');
    expect(technologicalSolution).toHaveAttribute('href', '/form/1/7');

    const benefits = screen.getByText('Benefits');
    expect(benefits).toHaveAttribute('href', '/form/1/8');

    const projectPlanning = screen.getByText('Project planning and management');
    expect(projectPlanning).toHaveAttribute('href', '/form/1/9');

    const estimatedProjectEmployment = screen.getByText(
      'Estimated project employment'
    );
    expect(estimatedProjectEmployment).toHaveAttribute('href', '/form/1/10');

    const templateUploads = screen.getByText('Template uploads');
    expect(templateUploads).toHaveAttribute('href', '/form/1/11');

    const supportingDocuments = screen.getByText('Supporting documents');
    expect(supportingDocuments).toHaveAttribute('href', '/form/1/12');

    const coverage = screen.getByText('Coverage');
    expect(coverage).toHaveAttribute('href', '/form/1/13');

    const organizationProfile = screen.getByText('Organization profile');
    expect(organizationProfile).toHaveAttribute('href', '/form/1/14');

    const organizationLocation = screen.getByText('Organization location');
    expect(organizationLocation).toHaveAttribute('href', '/form/1/15');

    const organizationContactInformation = screen.getByText(
      'Organization contact information'
    );
    expect(organizationContactInformation).toHaveAttribute(
      'href',
      '/form/1/16'
    );

    const authorizedBusinessContact = screen.getByText(
      'Authorized business contact'
    );
    expect(authorizedBusinessContact).toHaveAttribute('href', '/form/1/17');

    const alternateBusinessContact = screen.getByText(
      'Alternate business contact'
    );
    expect(alternateBusinessContact).toHaveAttribute('href', '/form/1/18');

    const review = screen.getByText('Review');
    expect(review).toHaveAttribute('href', '/form/1/19');

    const acknowledgements = screen.getByText('Acknowledgements');
    expect(acknowledgements).toHaveAttribute('href', '/form/1/20');
  });

  it('should have correct background colour when not active active', () => {
    const link = screen.getByText('Project area').parentElement;

    expect(link).toHaveStyle({ backgroundColor: theme.color.stepperGrey });
  });
});
