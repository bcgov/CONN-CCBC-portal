import { default as TimeTravel } from '../../components/TimeTravel';
import userEvent from '@testing-library/user-event';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DateTime, Settings } from 'luxon';

const renderStaticLayout = () => {
  return render(<TimeTravel />);
};

describe('The TimeTravel component', () => {
  it('should render Reset button', () => {
    renderStaticLayout();
    expect(screen.getByRole('button', { name: 'Reset'}));
  });

  it('should render date picker', () => {
    renderStaticLayout();
    expect(screen.getByPlaceholderText('YYYY-MM-DD'));
  });

  it('should render today\'s date if no cookie provided', () => {
    const today = DateTime.now().toFormat('yyyy-MM-dd');
    renderStaticLayout();
    expect(screen.getByText(`Current date is: ${today}`));
  });
 
  it('should render mock date from the cookie provided', () => {
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: 'mocks.mocked_date=2020-01-01',
    });
    renderStaticLayout();
    expect(screen.getByText('Current date is: 2020-01-01'));
  });

  it('should reset mock date', async() => {
    const today = DateTime.now().toFormat('yyyy-MM-dd');
    renderStaticLayout(); 
    await userEvent.click(
      screen.getByRole('button', { name: 'Reset' })
    );
    expect(screen.getByText(`Current date is: ${today}`));
  });
  
  it('should set mock date', async() => {
    Settings.defaultZone = "UTC";
    Settings.defaultLocale = "en_CA";
    renderStaticLayout(); 
    const datePicker = screen.getByPlaceholderText('YYYY-MM-DD');
    fireEvent.mouseDown(datePicker);
    fireEvent.change(datePicker, { target: { value: "2020-01-01" } });
    await waitFor(() => { 
      expect(screen.getByText(`Current date is: 2020-01-01`)).toBeInTheDocument();
    }); 
  });
});
