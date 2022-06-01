import StyledGovButton from '../../components/StyledGovButton';
import { render, screen } from '@testing-library/react';

const renderStaticLayout = () => {
  return render(<StyledGovButton>Button</StyledGovButton>);
};

describe('The StyledGovButton component', () => {
  it('should have correct margin', () => {
    renderStaticLayout();
    const button = screen.getByRole('button', { name: 'Button' });
    const style = window.getComputedStyle(button);

    expect(style.margin).toBe('20px 20px 20px 0px');
  });
});
