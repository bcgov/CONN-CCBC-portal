/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import request from 'supertest';
import * as XLSX from 'xlsx';
import { performQuery } from '../../../backend/lib/graphql';
import LoadTab7Data from '../../../backend/lib/sow_import/tab_7';

jest.mock('../../../backend/lib/graphql');

describe('sow tab 7 tests', () => {
  beforeEach(() => {
    mocked(performQuery).mockImplementation(async () => {
      return {};
    });
    jest.spyOn(XLSX, 'read').mockReturnValue({
      Sheets: { Sheet1: {} },
      SheetNames: ['7'],
    });
  });

  it('should parse the worksheet and submit expected mutation', async () => {
    const tab7 = [
      { B: 'Universal Broadband Fund' },
      { B: 'Step 7. Detailed Budget' },
      {
        B: 'Complete the below tables to provide detailed budget information required for the Connecting Communities BC Fund Contribution Agreement.',
      },
      {
        B: 'IMPORTANT: Do not copy or paste values into this template, it includes formulas designed to calculate totals.',
      },
      { B: 'Summary Table' },
      {
        B: 'The Project Components section indicates if the project will be targeting a remote community, an Indigenous community or a satellite dependent community,  or if the project consists of a Mobile Wireless component, as specified in the Application.',
      },
      {
        B: 'The Budget Summary tables are auto-populated and summarize the total project costs entered in Parts 1, 2 and 3. ',
      },
      { B: 'Part 1. Detailed Budget' },
      {
        B: 'The costs from your Application budget have been copied into this sheet. Where necessary, your Program Officer have identified budget items requiring additional detail or explanation. Please provide the additional details, review all the information contained within and return it to your Program Officer. ',
      },
      { B: 'Notes:' },
      {
        B: 'a) Complete the eligible and ineligible cost categories ensuring that you are placing the items in the appropriate cost category.  Costs must be rounded to the nearest whole dollar.  Attempting to include decimal values will trigger an error message.',
      },
      {
        B: 'b) The following rows are automatically calculated based upon the allocations provided: Total Eligible, Total Ineligible and Total Project Costs.',
      },
      {
        B: 'c) Please confirm the funding ratio(s) requested from the program.',
      },
      { B: 'Part 2: Summary Project Budget' },
      {
        B: 'This table provides a summary of the total eligible and ineligible project costs as provided in Part 1. ',
      },
      { B: 'Part 3: Summary of Estimate Project Financing' },
      {
        B: 'In this table, identify the project funding sources and enter the amount of funding from each source.',
      },
      {
        B: 'Verify that all budget line items correlate between Parts 1, 2, 3 and 4 on the Detailed Budget Template.  Error messages will be triggered if any of the information does not match. ',
      },
      { B: 'This section is complete.' },
      { B: 'Summary Table' },
      {
        B: 'Please fill out this section',
        F: 'Do Not Fill-This section is auto-populated',
      },
      {
        B: 'Indicate below whether the project contains the following components.',
      },
      { F: 'Project Costing', P: 'Errors', Q: 'Is there an error?' },
      {
        C: 'Are you targeting a very remote community or an Indigenous community or a satellite dependent community? ',
        D: 'No',
        G: '*Total Eligible Costs',
        H: 500000,
        P: 'Has erroneously included Rural/Sat/Ind costs:',
        Q: 0,
        S: 'DetailedTotalEligibleRural',
        T: 500000,
      },
      {
        G: '*Total Ineligible Costs',
        H: 250000,
        P: 'Has erroneously omitted Rural/Sat/Ind costs:',
        Q: 0,
        S: 'DetailedTotalEligibleSat',
        T: 0,
      },
      {
        G: '*Total Project Cost',
        H: 750000,
        P: 'Has erroneously included Mobile costs:',
        Q: 0,
        S: 'DetailedTotalEligibleMobile',
        T: 0,
      },
      {
        F: 'Project Funding',
        P: 'Has erroneously omitted Mobile costs:',
        Q: 0,
        S: 'DetailedTotalEligible',
        T: 500000,
      },
      {
        G: '*Amount requested from the Federal Government',
        H: 225000,
        I: '*Amount requested from the Province',
        J: 225000,
        S: 'DetailedTotalIneligible',
        T: 250000,
      },
      {
        C: 'Does the project have a mobile component?',
        D: 'No',
        G: '*Amount Applicant will contribute',
        H: 300000,
        I: '*Amount CIB will contribute',
        J: 0,
        P: 'Does the Eligible Total Project Costs in Part 2 match Part 1',
        Q: 0,
        S: 'DetailedTotalProjCosts',
        T: 750000,
      },
      {
        G: '*Funding from all other sources',
        H: 225000,
        I: '*Total requested from the CCBC Program',
        J: 450000,
        P: 'Does the Ineligible Total Project Costs in Part 2 match Part 1',
        Q: 0,
        S: 'DetailedTotalRequested',
        T: 225000,
      },
      { P: 'Does the Total Project Costs in Part 2 match Part 1', Q: 0 },
      { B: 'Part 1: DETAILED BUDGET' },
      {
        B: 'Eligible Costs',
        P: 'Is the Part 3 Total Financial Contributions differnet from Part 2 for F/Y 20-21',
        Q: 0,
      },
      {
        B: 'Direct Labour Costs (Costs for Recipient employees only.)',
        D: 'Description of Labour',
        F:
          'Additional Comments\n' +
          ' (Level of effort and unit cost. \n' +
          'E.g., 75 hours @ $50/hour)',
        H: 'Rural Broadband ($)',
        I: 'Very Remote / \nSatellite / \nIndigenous Broadband\n($)',
        J: 'Mobile ($)',
        K: 'Total Amount ($)',
        P: 'F/Y 21-22: Is the Part 3 Total Financial Contributions differnet from Part 2.',
        Q: 0,
      },
      {
        B: 'A',
        D: 'Test',
        F: 'Lorem Ipsum',
        H: 20000,
        I: 0,
        J: 0,
        K: 20000,
        P: 'F/Y 22-23: Is the Part 3 Total Financial Contributions differnet from Part 2.',
        Q: 0,
      },
      {
        B: 'B',
        D: 'Test',
        F: 'Lorem Ipsum',
        H: 20000,
        I: 0,
        J: 0,
        K: 20000,
        P: 'F/Y 23-24: Is the Part 3 Total Financial Contributions differnet from Part 2.',
        Q: 0,
      },
      {
        B: 'C',
        D: 'Test',
        F: 'Lorem Ipsum',
        H: 20000,
        I: 0,
        J: 0,
        K: 20000,
        P: 'F/Y 24-25: Is the Part 3 Total Financial Contributions differnet from Part 2.',
        Q: 0,
      },
      {
        B: 'D',
        D: 'Test',
        F: 'Lorem Ipsum',
        H: 20000,
        I: 0,
        J: 0,
        K: 20000,
        P: 'F/Y 25-26: Is the Part 3 Total Financial Contributions differnet from Part 2.',
        Q: 0,
      },
      {
        H: 0,
        I: 0,
        J: 0,
        K: 0,
        P: 'F/Y 26-27: Is the Part 3 Total Financial Contributions differnet from Part 2.',
        Q: 0,
      },
      {
        H: 0,
        I: 0,
        J: 0,
        K: 0,
        P: 'Is the Part 3 Total Financial Contributions differnet from Part 2.',
        Q: 0,
      },
      { H: 0, I: 0, J: 0, K: 0 },
      {
        H: 0,
        I: 0,
        J: 0,
        K: 0,
        P: 'Is Federal Contribution (TotalRequested) in Part 3 correct?',
        Q: 0,
      },
      {
        H: 0,
        I: 0,
        J: 0,
        K: 0,
        P: 'Is Provincial Contribution (TotalRequested) in Part 3 correct?',
        Q: 0,
      },
      { H: 0, I: 0, J: 0, K: 0 },
      {
        H: 0,
        I: 0,
        J: 0,
        K: 0,
        P: 'Contribution Totals are at or below 90%',
      },
      { H: 0, I: 0, J: 0, K: 0, P: 'Rural Broadband ($)', Q: '0' },
      {
        H: 0,
        I: 0,
        J: 0,
        K: 0,
        P: 'Very Remote / \nSatellite / \nIndigenous Broadband\n($)',
        Q: '0',
      },
      { H: 0, I: 0, J: 0, K: 0, P: 'Mobile ($)', Q: '0' },
      { H: 0, I: 0, J: 0, K: 0, P: 'Total Amount ($)', Q: '0' },
      { H: 0, I: 0, J: 0, K: 0 },
      { H: 0, I: 0, J: 0, K: 0, P: 'Check for a blank workbook', Q: 0 },
      { H: 0, I: 0, J: 0, K: 0 },
      { H: 0, I: 0, J: 0, K: 0 },
      {
        H: 0,
        I: 0,
        J: 0,
        K: 0,
        P: 'F/Y 23-24: Quarterly Totals Match Provincial Contributions',
        Q: 0,
      },
      {
        H: 0,
        I: 0,
        J: 0,
        K: 0,
        P: 'F/Y 24-25: Quarterly Totals Match Provincial Contributions',
        Q: 0,
      },
      {
        H: 0,
        I: 0,
        J: 0,
        K: 0,
        P: 'F/Y 25-26: Quarterly Totals Match Provincial Contributions',
        Q: 0,
      },
      {
        H: 0,
        I: 0,
        J: 0,
        K: 0,
        P: 'F/Y 26-27: Quarterly Totals Match Provincial Contributions',
        Q: 0,
      },
      { H: 0, I: 0, J: 0, K: 0, P: 'Do the totals match', Q: 0 },
      { H: 0, I: 0, J: 0, K: 0 },
      { H: 0, I: 0, J: 0, K: 0 },
    ];
    const expectedInput = {
      input: {
        sowId: 1,
        jsonData: {
          targetingVeryRemoteOrIndigenousOrSatelliteDependentCommunity: 'No',
          totalEligibleCosts: 500000,
          totalIneligibleCosts: 250000,
          totalProjectCosts: 750000,
          amountRequestedFromFederalGovernment: 225000,
          amountApplicantWillContribute: 300000,
          fundingFromAllOtherSources: 225000,
          amountRequestedFromProvince: 225000,
          amountCIBWillContribute: 0,
          totalRequestedFromCCBCProgram: 450000,
        },
      },
    };
    jest.spyOn(XLSX.utils, 'sheet_to_json').mockReturnValue(tab7);
    const wb = XLSX.read(null);

    await LoadTab7Data(1, wb, '7', request);
    expect(performQuery).toHaveBeenCalledWith(
      expect.anything(),
      expectedInput,
      expect.anything()
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
