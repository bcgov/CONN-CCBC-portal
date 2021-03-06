import { SubHeaderNavbarLinks } from '../../components/NavbarLinks';
import { render, screen } from '@testing-library/react';

const renderStaticLayout = () => {
  return render(<SubHeaderNavbarLinks />);
};

describe('The SubHeaderNavbarLinks component', () => {
  it('should render Help button', () => {
    renderStaticLayout();
    expect(screen.getByText('Help'));
  });

  it('should render the mailto href', () => {
    renderStaticLayout();
    const link = screen.getByRole('link', { name: 'Help' });
    expect(link).toHaveAttribute(
      'href',
      'mailto:connectingcommunitiesbc@gov.bc.ca'
    );
  });
});
