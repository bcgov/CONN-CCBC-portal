import NavBarLinks from '../../components/NavBarLinks';
import { render, screen } from '@testing-library/react';

const renderStaticLayout = () => {
  return render(<NavBarLinks />);
};

describe('The NavBarLinks component', () => {
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
