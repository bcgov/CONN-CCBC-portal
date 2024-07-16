/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import * as XLSX from 'xlsx';
import request from 'supertest';
import columnList from 'tests/backend/lib/excel_import/validate_cbc_project.test';
import { readCbcCommunitiesData } from 'backend/lib/excel_import/cbc_project_communities';
import { performQuery } from '../../../../backend/lib/graphql';
import LoadCbcProjectData from '../../../../backend/lib/excel_import/cbc_project';

const mockErrorData = {
  projectNumber: 9999,
  originalProjectNumber: undefined,
  phase: '4b',
  intake: undefined,
  projectStatus: 'Not Applicable',
  changeRequestPending: true,
  projectTitle: 'Program Fee (1%) - Community',
  projectDescription: undefined,
  currentOperatingName: 'Northern Development',
  applicantContractualName: 'Northern Development',
  eightThirtyMillionFunding: false,
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
  bcFundingRequested: 750000,
  federalFundingRequested: null,
  applicantAmount: null,
  otherFundingRequested: null,
  totalProjectBudget: null,
  conditionalApprovalLetterSent: undefined,
  agreementSigned: undefined,
  announcedByProvince: true,
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
  locked: true,
  lastReviewed: null,
  reviewNotes: undefined,
  errorLog: [
    'Project #9999: federalFundingRequested not imported due to formatting error - value should be a number',
    'Project #9999: applicantAmount not imported due to formatting error - value should be a number',
    'Project #9999: otherFundingRequested not imported due to formatting error - value should be a number',
    'Project #9999: totalProjectBudget not imported due to formatting error - value should be a number',
    'Project #9999: dateApplicationReceived not imported due to formatting error - value should be a date',
    'Project #9999: dateConditionallyApproved not imported due to formatting error - value should be a date',
    'Project #9999: dateAgreementSigned not imported due to formatting error - value should be a date',
    'Project #9999: proposedStartDate not imported due to formatting error - value should be a date',
    'Project #9999: proposedCompletionDate not imported due to formatting error - value should be a date',
    'Project #9999: reportingCompletionDate not imported due to formatting error - value should be a date',
    'Project #9999: dateAnnounced not imported due to formatting error - value should be a date',
    'Project #9999: lastReviewed not imported due to formatting error - value should be a date',
  ],
};
jest.mock('../../../../backend/lib/graphql');
jest.mock('backend/lib/excel_import/cbc_project_communities');

mocked(readCbcCommunitiesData).mockResolvedValue({});

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
      .mockReturnValue([
        { ...columnList },
        { A: 121231, B: 2, C: 3, D: 4, E: 5, F: 'Yes', AH: '2023-01-01' },
      ]);

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
          cbcByProjectNumber: {
            cbcDataByProjectNumber: {
              nodes: [],
            },
            applicationPendingChangeRequestsByCbcId: {
              nodes: [],
            },
          },
          createCbc: {
            cbc: {
              rowId: 1,
            },
          },
          createPendingChangeRequest: {
            pendingChangeRequest: {
              cbcId: '1',
              isPending: true,
              comment: null,
            },
          },
        },
      };
    });

    const wb = XLSX.read(null);
    const data = await LoadCbcProjectData(
      wb,
      'CBC Project',
      'CBC & CCBC Project Communities',
      null,
      request
    );

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
        cbcByProjectNumber: {
          cbcDataByProjectNumber: {
            nodes: [],
          },
          applicationPendingChangeRequestsByCbcId: {
            nodes: [],
          },
        },
        createCbc: {
          cbc: {
            rowId: 1,
          },
        },
        createPendingChangeRequest: {
          pendingChangeRequest: {
            cbcId: '1',
            isPending: true,
            comment: null,
          },
        },
      },
      errorLog: [],
    });
  });

  it('should update when existing pending change request is different to parsed data', async () => {
    jest
      .spyOn(XLSX.utils, 'sheet_to_json')
      .mockReturnValue([
        { ...columnList },
        { A: 121231, B: 2, C: 3, D: 4, E: 5, F: 'No', AH: '2023-01-01' },
      ]);

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
          cbcByProjectNumber: {
            cbcDataByProjectNumber: {
              nodes: [{ rowId: 1, projectNumber: 121231, id: '1' }],
            },
            applicationPendingChangeRequestsByCbcId: {
              nodes: [
                {
                  rowId: 1,
                  cbcId: '1',
                  isPending: true,
                },
              ],
            },
          },
          createCbc: {
            cbc: {
              rowId: 1,
            },
          },
          createPendingChangeRequest: {
            pendingChangeRequest: {
              cbcId: '1',
              isPending: false,
              comment: null,
            },
          },
        },
      };
    });

    const wb = XLSX.read(null);
    const data = await LoadCbcProjectData(
      wb,
      'CBC Project',
      'CBC & CCBC Project Communities',
      null,
      request
    );

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
        cbcByProjectNumber: {
          cbcDataByProjectNumber: {
            nodes: [{ rowId: 1, projectNumber: 121231, id: '1' }],
          },
          applicationPendingChangeRequestsByCbcId: {
            nodes: [{ rowId: 1, cbcId: '1', isPending: true }],
          },
        },
        createCbc: {
          cbc: {
            rowId: 1,
          },
        },
        createPendingChangeRequest: {
          pendingChangeRequest: {
            cbcId: '1',
            isPending: false,
            comment: null,
          },
        },
      },
      errorLog: [],
    });
  });

  it('should create communities data records successfully', async () => {
    jest
      .spyOn(XLSX.utils, 'sheet_to_json')
      .mockReturnValue([
        { ...columnList },
        { A: 121231, B: 2, C: 3, D: 4, E: 5, F: 'No', AH: '2023-01-01' },
      ]);

    mocked(readCbcCommunitiesData).mockResolvedValue({
      '121231': [
        {
          projectNumber: 121231,
          communitiesSourceDataId: 1,
        },
        {
          projectNumber: 121231,
          communitiesSourceDataId: 2,
        },
      ],
    });

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
          cbcByProjectNumber: {
            cbcDataByProjectNumber: {
              nodes: [{ rowId: 1, projectNumber: 121231, id: '1' }],
            },
            applicationPendingChangeRequestsByCbcId: {
              nodes: [
                {
                  rowId: 1,
                  cbcId: '1',
                  isPending: true,
                },
              ],
            },
            cbcProjectCommunitiesByCbcId: {
              nodes: [
                { rowId: 2, cbcId: '121231', communitiesSourceDataId: '1' },
              ],
            },
          },
          createCbc: {
            cbc: {
              rowId: 1,
            },
          },
          createPendingChangeRequest: {
            pendingChangeRequest: {
              cbcId: '1',
              isPending: false,
              comment: null,
            },
          },
          createCbcProjectCommunity: {
            cbcProjectCommunity: {
              rowId: 2,
              cbcId: '1',
              communitiesSourceDataId: '2',
            },
          },
        },
      };
    });

    const wb = XLSX.read(null);
    const data = await LoadCbcProjectData(
      wb,
      'CBC Project',
      'CBC & CCBC Project Communities',
      null,
      request
    );

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
        cbcByProjectNumber: {
          cbcDataByProjectNumber: {
            nodes: [{ rowId: 1, projectNumber: 121231, id: '1' }],
          },
          applicationPendingChangeRequestsByCbcId: {
            nodes: [{ rowId: 1, cbcId: '1', isPending: true }],
          },
          cbcProjectCommunitiesByCbcId: {
            nodes: [
              {
                rowId: 2,
                cbcId: '121231',
                communitiesSourceDataId: '1',
              },
            ],
          },
        },
        createCbc: {
          cbc: {
            rowId: 1,
          },
        },
        createPendingChangeRequest: {
          pendingChangeRequest: {
            cbcId: '1',
            isPending: false,
            comment: null,
          },
        },
        createCbcProjectCommunity: {
          cbcProjectCommunity: {
            rowId: 2,
            cbcId: '1',
            communitiesSourceDataId: '2',
          },
        },
      },
      errorLog: [],
    });
  });

  it('should parse worksheet with errors', async () => {
    jest.spyOn(XLSX.utils, 'sheet_to_json').mockReturnValue([
      { ...columnList },
      {
        A: 9999,
        C: '4b',
        E: 'Not Applicable',
        G: 'Program Fee (1%) - Community',
        H: 'NULL',
        I: 'Northern Development',
        J: 'Northern Development',
        K: 'No',
        L: 'NULL',
        M: 'NULL',
        N: 'Program Fee',
        O: 'NULL',
        P: 'NULL',
        Q: 'NULL',
        R: 'NULL',
        S: 'NULL',
        T: 'NULL',
        U: 'should be a number',
        V: 'should be a number',
        W: 'should be a number',
        Y: 'should be a number',
        Z: 'NULL',
        AA: 'should be a number',
        AB: 'should be a number',
        AC: 'should be a number',
        AD: 'NULL',
        AE: 'NULL',
        AF: 'NULL',
        AG: 'NULL',
        AH: 'NULL',
        AI: 'should be a date',
        AJ: 'should be a date',
        AK: 'should be a date',
        AL: 'should be a date',
        AM: 'should be a date',
        AN: 'should be a date',
        AO: 'NULL',
        AP: 'should be a date',
        AQ: 'should be a date',
        AR: 'NULL',
        AS: 'NULL',
        AT: 'NULL',
        AU: 'NULL',
        AV: 'NULL',
        AW: 'should be a date',
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
          cbcByProjectNumber: {
            cbcDataByProjectNumber: {
              nodes: [],
            },
          },
          createCbc: {
            cbc: {
              rowId: 1,
            },
          },
        },
      };
    });

    const response = await LoadCbcProjectData(
      wb,
      'CBC Project',
      'CBC & CCBC Project Communities',
      null,
      request
    );

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
        cbcByProjectNumber: {
          cbcDataByProjectNumber: {
            nodes: [],
          },
        },
        createCbc: {
          cbc: {
            rowId: 1,
          },
        },
      },
      errorLog: [
        'Project #9999: communitiesAndLocalesCount not imported due to formatting error - value should be a number',
        'Project #9999: indigenousCommunities not imported due to formatting error - value should be a number',
        'Project #9999: householdCount not imported due to formatting error - value should be a number',
        'Project #9999: highwayKm not imported due to formatting error - value should be a number',
        'Project #9999: bcFundingRequested not imported due to formatting error - value should be a number',
        'Project #9999: federalFundingRequested not imported due to formatting error - value should be a number',
        'Project #9999: applicantAmount not imported due to formatting error - value should be a number',
        'Project #9999: dateApplicationReceived not imported due to formatting error - value should be a date',
        'Project #9999: dateConditionallyApproved not imported due to formatting error - value should be a date',
        'Project #9999: dateAgreementSigned not imported due to formatting error - value should be a date',
        'Project #9999: proposedStartDate not imported due to formatting error - value should be a date',
        'Project #9999: proposedCompletionDate not imported due to formatting error - value should be a date',
        'Project #9999: reportingCompletionDate not imported due to formatting error - value should be a date',
        'Project #9999: projectMilestoneCompleted not imported due to formatting error - value should be a number',
        'Project #9999: constructionCompletedOn not imported due to formatting error - value should be a date',
        'Project #9999: lastReviewed not imported due to formatting error - value should be a date',
      ],
    });
  });

  it('should trim strings', async () => {
    jest.spyOn(XLSX.utils, 'sheet_to_json').mockReturnValue([
      { ...columnList },
      {
        A: 9999,
        C: '  4b  ',
        E: '  Not Applicable  ',
        G: '  Program Fee (1%) - Community',
        H: 'NULL',
        I: '  Northern Development',
        J: '  Northern Development',
        K: 'No',
        L: 'NULL',
        M: 'NULL',
        N: 'Program Fee',
        O: 'NULL',
        P: 'NULL',
        Q: 'NULL',
        R: 'NULL',
        S: 'NULL',
        T: 'NULL',
        U: 'should be a number',
        V: 'should be a number',
        W: 'should be a number',
        Y: 'should be a number',
        Z: 'NULL',
        AA: 'should be a number',
        AB: 'should be a number',
        AC: 'should be a number',
        AD: 'NULL',
        AE: 'NULL',
        AF: 'NULL',
        AG: 'NULL',
        AH: 'NULL',
        AI: 'should be a date',
        AJ: 'should be a date',
        AK: 'should be a date',
        AL: 'should be a date',
        AM: 'should be a date',
        AN: 'should be a date',
        AO: 'NULL',
        AP: 'should be a date',
        AQ: 'should be a date',
        AR: 'NULL',
        AS: 'NULL',
        AT: 'NULL',
        AU: 'NULL',
        AV: 'NULL',
        AW: 'should be a date',
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
          cbcByProjectNumber: {
            cbcDataByProjectNumber: {
              nodes: [],
            },
          },
          createCbc: {
            cbc: {
              rowId: 1,
            },
          },
        },
      };
    });

    const result = (await LoadCbcProjectData(
      wb,
      'CBC Project',
      'CBC & CCBC Project Communities',
      null,
      request
    )) as any;
    expect(result.data.createCbcProject.cbcProject.jsonData[0].phase).toEqual(
      '4b'
    );
    expect(
      result.data.createCbcProject.cbcProject.jsonData[0].projectStatus
    ).toEqual('Not Applicable');
    expect(
      result.data.createCbcProject.cbcProject.jsonData[0].projectTitle
    ).toEqual('Program Fee (1%) - Community');
    expect(
      result.data.createCbcProject.cbcProject.jsonData[0]
        .applicantContractualName
    ).toEqual('Northern Development');
    expect(
      result.data.createCbcProject.cbcProject.jsonData[0].currentOperatingName
    ).toEqual('Northern Development');
  });

  it('should turn yes-no and x to boolean', async () => {
    jest.spyOn(XLSX.utils, 'sheet_to_json').mockReturnValue([
      { ...columnList },
      {
        A: 9999,
        C: '4b',
        E: 'Not Applicable',
        F: 'Yes',
        G: 'Program Fee (1%) - Community',
        H: 'NULL',
        I: 'Northern Development',
        J: 'Northern Development',
        K: 'No',
        L: 'NULL',
        M: 'NULL',
        N: 'Program Fee',
        O: 'NULL',
        P: 'NULL',
        Q: 'NULL',
        R: 'NULL',
        S: 'NULL',
        T: 'NULL',
        U: 'should be a number',
        V: 'should be a number',
        W: 'should be a number',
        Y: 'should be a number',
        Z: 'NULL',
        AA: 'should be a number',
        AB: 'should be a number',
        AC: 'should be a number',
        AD: 'NULL',
        AE: 'NULL',
        AF: 'NULL',
        AG: 'NULL',
        AH: 'YES',
        AI: 'should be a date',
        AJ: 'should be a date',
        AK: 'should be a date',
        AL: 'should be a date',
        AM: 'should be a date',
        AN: 'should be a date',
        AO: 'NULL',
        AP: 'should be a date',
        AQ: 'should be a date',
        AR: 'NULL',
        AS: 'NULL',
        AT: 'NULL',
        AU: 'NULL',
        AV: 'x',
        AW: 'should be a date',
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
          cbcByProjectNumber: {
            cbcDataByProjectNumber: {
              nodes: [],
            },
          },
          createCbc: {
            cbc: {
              rowId: 1,
            },
          },
        },
      };
    });

    const result = (await LoadCbcProjectData(
      wb,
      'CBC Project',
      'CBC & CCBC Project Communities',
      null,
      request
    )) as any;
    expect(result.data.createCbcProject.cbcProject.jsonData[0].locked).toEqual(
      true
    );
    expect(
      result.data.createCbcProject.cbcProject.jsonData[0].changeRequestPending
    ).toEqual(true);
    expect(
      result.data.createCbcProject.cbcProject.jsonData[0]
        .eightThirtyMillionFunding
    ).toEqual(false);
    expect(
      result.data.createCbcProject.cbcProject.jsonData[0].announcedByProvince
    ).toEqual(true);
  });
});
