import { concatCCBCNumbers } from 'components/Analyst/Project/Announcements/AnnouncementsForm';

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
});
