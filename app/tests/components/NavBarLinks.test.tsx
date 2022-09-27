import { SubHeaderNavbarLinks } from '../../components/NavbarLinks';
import { render, screen } from '@testing-library/react';

const renderStaticLayout = () => {
  return render(<SubHeaderNavbarLinks />);
};

describe('The SubHeaderNavbarLinks component', () => {
  it('should render Email us button', () => {
    renderStaticLayout();
    expect(screen.getByText('Email us'));
  });

  it('should render the mailto href', () => {
    renderStaticLayout();
    const link = screen.getByRole('link', { name: 'Email us' });
    expect(link).toHaveAttribute(
      'href',
      'mailto:connectingcommunitiesbc@gov.bc.ca'
    );
  });
});
