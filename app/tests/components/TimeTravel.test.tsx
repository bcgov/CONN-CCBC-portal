//import React from 'react';
import { default as TimeTravel } from '../../components/TimeTravel';
import { render, screen } from '@testing-library/react';
import { DateTime } from 'luxon';

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
  /**if (value) {
      const mockDate = dateTimeFormat(value, 'date_year_first');
      cookie.set('mocks.mocked_timestamp', value.valueOf());
      cookie.set('mocks.mocked_date', mockDate);
      setDate(mockDate);
    } else {
      setDate(today);
      cookie.remove('mocks.mocked_timestamp');
      cookie.remove('mocks.mocked_date');
    } */
});
