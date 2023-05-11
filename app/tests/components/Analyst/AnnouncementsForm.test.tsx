import { render, screen } from '@testing-library/react';
import {
  toastContent,
  concatCCBCNumbers,
} from 'components/Analyst/Project/Announcements/AnnouncementsForm';
import GlobalTheme from 'styles/GlobalTheme';

describe('Test pure functions in AnnouncementsForm', () => {
  it('Test result of concatCCBCNumbers with valid data', () => {
    const currentCcbcNumber = 'CCBC-010004';
    const ccbcNumberList = [
      { ccbcNumber: 'CCBC-010003' },
      { ccbcNumber: 'CCBC-010002' },
      { ccbcNumber: 'CCBC-010001' },
    ];
    const result = concatCCBCNumbers(currentCcbcNumber, ccbcNumberList);
    expect(result).toBe('CCBC-010004,CCBC-010003,CCBC-010002,CCBC-010001,');
  });
  it('Test result of concatCCBCNumbers with empty array', () => {
    const currentCcbcNumber = 'CCBC-010003';
    const ccbcNumberList = [];
    const result = concatCCBCNumbers(currentCcbcNumber, ccbcNumberList);
    expect(result).toBe('CCBC-010003');
  });
  it('Test result of concatCCBCNumbers with empty currenctCcbcNumber', () => {
    const currentCcbcNumber = '';
    const ccbcNumberList = [
      { ccbcNumber: 'CCBC-010003' },
      { ccbcNumber: 'CCBC-010002' },
      { ccbcNumber: 'CCBC-010001' },
    ];
    const result = concatCCBCNumbers(currentCcbcNumber, ccbcNumberList);
    expect(result).toBe(',CCBC-010003,CCBC-010002,CCBC-010001,');
  });
  it('renders all links when there are less than three ccbcIds', () => {
    const ccbcIds = [
      { ccbcNumber: '123', rowId: '1' },
      { ccbcNumber: '456', rowId: '2' },
    ];
    render(<GlobalTheme>{toastContent(ccbcIds)}</GlobalTheme>);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(ccbcIds.length);

    ccbcIds.forEach((ccbcId, index) => {
      expect(links[index]).toHaveAttribute(
        'href',
        `/analyst/application/${ccbcId.rowId}/project`
      );
      expect(links[index]).toHaveTextContent(ccbcId.ccbcNumber);
    });
  });

  it('renders only the first two links and "and more" when there are three or more ccbcIds', () => {
    const ccbcIds = [
      { ccbcNumber: '123', rowId: '1' },
      { ccbcNumber: '456', rowId: '2' },
      { ccbcNumber: '789', rowId: '3' },
      { ccbcNumber: '321', rowId: '3' },
    ];
    render(<GlobalTheme>{toastContent(ccbcIds)}</GlobalTheme>);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);

    ccbcIds.slice(0, 2).forEach((ccbcId, index) => {
      expect(links[index]).toHaveAttribute(
        'href',
        `/analyst/application/${ccbcId.rowId}/project`
      );
      expect(links[index]).toHaveTextContent(ccbcId.ccbcNumber);
    });

    expect(screen.getByText(/and more/)).toBeInTheDocument();
  });

  it('renders announcement with empty ccbcIds', () => {
    const ccbcIds = [];
    render(<GlobalTheme>{toastContent(ccbcIds)}</GlobalTheme>);

    expect(
      screen.getByText('Announcement successfully added')
    ).toBeInTheDocument();
  });

  it('renders announcement with undefined ccbcIds', () => {
    const ccbcIds = undefined;
    render(<GlobalTheme>{toastContent(ccbcIds)}</GlobalTheme>);

    expect(
      screen.getByText('Announcement successfully added')
    ).toBeInTheDocument();
  });
});
