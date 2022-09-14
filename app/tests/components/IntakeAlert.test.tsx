import IntakeAlert from '../../components/IntakeAlert';
import { render, screen } from '@testing-library/react';

const renderStaticLayout = () => {
  return render(<IntakeAlert />);
};

describe('The alert component', () => {
  it('should render the correct date', () => {
    renderStaticLayout();
    const alert = screen.getByText('September 29');

    expect(alert).toBeTruthy();
  });
});
