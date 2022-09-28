import IntakeAlert from '../../components/IntakeAlert';
import { render, screen } from '@testing-library/react';

const renderStaticLayout = () => {
  return render(<IntakeAlert openTimestamp="2022-09-19T09:00:00-07:00" />);
};

describe('The alert component', () => {
  it('should render the correct date', () => {
    renderStaticLayout();
    const alert = screen.getByText('September 19, 2022');

    expect(alert).toBeInTheDocument();
  });
});
