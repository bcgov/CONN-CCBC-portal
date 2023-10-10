/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import * as XLSX from 'xlsx';
import request from 'supertest';
import { performQuery } from '../../../../backend/lib/graphql';
import LoadCbcProjectData from '../../../../backend/lib/excel_import/cbc_project';

const mockErrorData = {
  projectNumber: 9999,
  orignalProjectNumber: undefined,
  phase: '4b',
  intake: undefined,
  projectStatus: 'Not Applicable',
  projectTitle: 'Program Fee (1%) - Community',
  projectDescription: undefined,
  applicant: 'Northern Development',
  eightThirtyMillionFunding: 'No',
  federalFundingSource: undefined,
  federalProjectNumber: undefined,
  projectType: 'Program Fee',
  transportProjectType: undefined,
  highwayProjectType: undefined,
  lastMileProjectType: undefined,
  lastMileMinimumSpeed: undefined,
  connectedCoastNetworkDependant: undefined,
  projectLocations: undefined,
  communitiesAndLocalesCount: null,
  indigenousCommunities: null,
  householdCount: null,
  transportKm: null,
  highwayKm: null,
  restAreas: undefined,
  bcFundingRequest: 750000,
  federalFunding: null,
  applicantAmount: null,
  otherFunding: null,
  totalProjectBudget: null,
  nditConditionalApprovalLetterSent: undefined,
  bindingAgreementSignedNditRecipient: undefined,
  announcedByProvince: undefined,
  dateApplicationReceived: null,
  dateConditionallyApproved: null,
  dateAgreementSigned: null,
  proposedStartDate: null,
  proposedCompletionDate: null,
  reportingCompletionDate: null,
  dateAnnounced: null,
  projectMilestoneCompleted: null,
  constructionCompletedOn: null,
  milestoneComments: undefined,
  primaryNewsRelease: undefined,
  secondaryNewsRelease: undefined,
  notes: undefined,
  locked: undefined,
  lastReviewed: null,
  reviewNotes: undefined,
  errorLog: [
    'federalFunding not imported due to formatting error - value should be a number',
    'applicantAmount not imported due to formatting error - value should be a number',
    'otherFunding not imported due to formatting error - value should be a number',
    'totalProjectBudget not imported due to formatting error - value should be a number',
    'dateApplicationReceived not imported due to formatting error - value should be a date',
    'dateConditionallyApproved not imported due to formatting error - value should be a date',
    'dateAgreementSigned not imported due to formatting error - value should be a date',
    'proposedStartDate not imported due to formatting error - value should be a date',
    'proposedCompletionDate not imported due to formatting error - value should be a date',
    'reportingCompletionDate not imported due to formatting error - value should be a date',
    'dateAnnounced not imported due to formatting error - value should be a date',
    'lastReviewed not imported due to formatting error - value should be a date',
  ],
};
jest.mock('../../../../backend/lib/graphql');

describe('cbc_project', () => {
  beforeEach(() => {
    jest.spyOn(XLSX, 'read').mockReturnValue({
      Sheets: { 'CBC Project': {} },
      SheetNames: ['CBC Project'],
    });
  });

  it('should parse worksheet', async () => {
    jest
      .spyOn(XLSX.utils, 'sheet_to_json')
      .mockReturnValue([{ A: 121231, B: 2, C: 3, D: 4, E: 5 }]);

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          createCbcProject: {
            cbcProject: {
              id: '1',
              rowId: 1,
              jsonData: {},
            },
            clientMutationId: '1',
          },
        },
      };
    });

    const wb = XLSX.read(null);
    const data = await LoadCbcProjectData(wb, 'CBC Project', null, request);

    expect(data).toEqual({
      data: {
        createCbcProject: {
          cbcProject: {
            id: '1',
            rowId: 1,
            jsonData: {},
          },
          clientMutationId: '1',
        },
      },
    });
  });

  it('should parse worksheet with errors', async () => {
    jest.spyOn(XLSX.utils, 'sheet_to_json').mockReturnValue([
      { A: 1 },
      {
        A: 9999,
        C: '4b',
        E: 'Not Applicable',
        F: 'Program Fee (1%) - Community',
        G: 'NULL',
        H: 'Northern Development',
        I: 'No',
        J: 'NULL',
        K: 'NULL',
        L: 'Program Fee',
        M: 'NULL',
        N: 'NULL',
        O: 'NULL',
        P: 'NULL',
        Q: 'NULL',
        R: 'NULL',
        S: 'should be a number',
        T: 'should be a number',
        U: 'should be a number',
        W: 'should be a number',
        X: 'NULL',
        Y: 'should be a number',
        Z: 'should be a number',
        AA: 'should be a number',
        AB: 'NULL',
        AC: 'NULL',
        AD: 'NULL',
        AE: 'NULL',
        AF: 'NULL',
        AG: 'should be a date',
        AH: 'should be a date',
        AI: 'should be a date',
        AJ: 'should be a date',
        AK: 'should be a date',
        AL: 'should be a date',
        AM: 'NULL',
        AN: 'should be a date',
        AO: 'should be a date',
        AP: 'NULL',
        AQ: 'NULL',
        AR: 'NULL',
        AS: 'NULL',
        AT: 'NULL',
        AU: 'should be a date',
      },
    ]);

    const wb = XLSX.read(null);

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          createCbcProject: {
            cbcProject: {
              id: '1',
              rowId: 1,
              jsonData: [mockErrorData],
            },
            clientMutationId: '1',
          },
        },
      };
    });

    const response = await LoadCbcProjectData(wb, 'CBC Project', null, request);

    expect(response).toEqual({
      data: {
        createCbcProject: {
          cbcProject: {
            id: '1',
            rowId: 1,
            jsonData: [mockErrorData],
          },
          clientMutationId: '1',
        },
      },
    });
  });
});
