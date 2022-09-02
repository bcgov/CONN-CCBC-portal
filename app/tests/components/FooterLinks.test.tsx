import FooterLinks from '../../components/FooterLinks';
import { render, screen } from '@testing-library/react';

const renderStaticLayout = () => {
  return render(<FooterLinks />);
};

describe('The FooterLinks component', () => {
  it('should render Project details link title', () => {
    renderStaticLayout();
    expect(screen.getByText('Project details'));
  });

  it('should render the Project details link href', () => {
    renderStaticLayout();
    const link = screen.getByRole('link', { name: 'Project details' });
    expect(link).toHaveAttribute(
      'href',
      'https://www.gov.bc.ca/connectingcommunitiesbc'
    );
  });

  it('should render Disclaimer link title', () => {
    renderStaticLayout();
    expect(screen.getByText('Disclaimer'));
  });

  it('should render the Disclaimer link href', () => {
    renderStaticLayout();
    const link = screen.getByRole('link', { name: 'Disclaimer' });
    expect(link).toHaveAttribute(
      'href',
      'https://www2.gov.bc.ca/gov/content/home/disclaimer'
    );
  });

  it('should render Privacy link title', () => {
    renderStaticLayout();
    expect(screen.getByText('Privacy'));
  });

  it('should render the Privacy link href', () => {
    renderStaticLayout();
    const link = screen.getByRole('link', { name: 'Privacy' });
    expect(link).toHaveAttribute(
      'href',
      'https://www2.gov.bc.ca/gov/content/home/privacy'
    );
  });

  it('should render Accessibility link title', () => {
    renderStaticLayout();
    expect(screen.getByText('Accessibility'));
  });

  it('should render the Accessibility link href', () => {
    renderStaticLayout();
    const link = screen.getByRole('link', { name: 'Accessibility' });
    expect(link).toHaveAttribute(
      'href',
      'https://www2.gov.bc.ca/gov/content/home/accessible-government'
    );
  });

  it('should render Copyright link title', () => {
    renderStaticLayout();
    expect(screen.getByText('Copyright'));
  });

  it('should render the Copyright link href', () => {
    renderStaticLayout();
    const link = screen.getByRole('link', { name: 'Copyright' });
    expect(link).toHaveAttribute(
      'href',
      'https://www2.gov.bc.ca/gov/content/home/copyright'
    );
  });
});
