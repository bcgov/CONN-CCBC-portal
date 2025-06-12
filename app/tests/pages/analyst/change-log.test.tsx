import { mocked } from 'jest-mock';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { isAuthenticated } from '@bcgov-cas/sso-express/dist/helpers';
import * as moduleApi from '@growthbook/growthbook-react';
import { FeatureResult, JSONValue } from '@growthbook/growthbook-react';
import cookie from 'js-cookie';
import userEvent from '@testing-library/user-event';
import compiledchangelogQuery, {
  changeLogQuery,
} from '__generated__/changeLogQuery.graphql';
import ChangeLog from '../../../pages/analyst/change-log';
import defaultRelayOptions from '../../../lib/relay/withRelayOptions';
import PageTestingHelper from '../../utils/pageTestingHelper';

jest.setTimeout(10000);

const mockQueryPayload = {
  Query() {
    return {
      session: {
        sub: 'feae2edcecbd418f9564bb170504321b@idir',
        authRole: 'super_admin',
      },
      allCbcs: {
        nodes: [
          {
            rowId: 3,
            projectNumber: 6036,
            history: {
              nodes: [
                {
                  op: 'UPDATE',
                  createdAt: '2024-05-24T17:39:54.240526+00:00',
                  createdBy: 107,
                  id: 'WyJyZWNvcmRfdmVyc2lvbnMiLDI5NTMwXQ==',
                  record: {
                    id: 3,
                    cbc_id: 3,
                    json_data: {
                      phase: 2,
                      intake: 2,
                      locked: true,
                      highwayKm: null,
                      projectType: 'Last-Mile',
                      transportKm: null,
                      lastReviewed: '2024-07-09T00:00:00.000Z',
                      projectTitle: 'South Hazelton Broadband Expansion',
                      dateAnnounced: null,
                      projectNumber: 6036,
                      projectStatus: 'Reporting Complete',
                      householdCount: 235,
                      agreementSigned: true,
                      applicantAmount: 412386,
                      projectLocations: 'South Hazelton',
                      proposedStartDate: '2019-01-02T00:00:00.000Z',
                      bcFundingRequested: 412385,
                      projectDescription:
                        'Project will build a high-speed backbone and fibre to the home network to deliver high speed internet to the community of South Hazelton.',
                      totalProjectBudget: 824771,
                      announcedByProvince: true,
                      dateAgreementSigned: '2019-09-10T00:00:00.000Z',
                      lastMileProjectType: 'Fibre',
                      changeRequestPending: false,
                      currentOperatingName: 'CityWest Cable & Telephone Corp.',
                      lastMileMinimumSpeed: 50,
                      secondaryNewsRelease:
                        'https://www.citywest.ca/about-us/news/2020/06/04/citywest-to-launch-services-in-south-hazelton  \n\nhttps://news.gov.bc.ca/releases/2020CITZ0068-002125',
                      indigenousCommunities: null,
                      otherFundingRequested: null,
                      proposedCompletionDate: '2020-01-01T00:00:00.000Z',
                      constructionCompletedOn: '2020-11-12T00:00:00.000Z',
                      dateApplicationReceived: '2019-02-13T00:00:00.000Z',
                      federalFundingRequested: null,
                      reportingCompletionDate: '2022-10-05T00:00:00.000Z',
                      applicantContractualName:
                        'CityWest Cable & Telephone Corp.',
                      dateConditionallyApproved: '2019-05-24T00:00:00.000Z',
                      eightThirtyMillionFunding: false,
                      projectMilestoneCompleted: 100,
                      communitiesAndLocalesCount: 1,
                      conditionalApprovalLetterSent: true,
                      connectedCoastNetworkDependant: false,
                    },
                    created_at: '2024-05-24T17:39:54.240526+00:00',
                    created_by: null,
                    updated_at: '2024-12-03T17:51:51.613208+00:00',
                    updated_by: 107,
                    archived_at: null,
                    archived_by: null,
                    change_reason:
                      'BC Funding Requested and Total Project Budget updated per signed agreement',
                    project_number: 6036,
                    added_communities: null,
                    deleted_communities: null,
                    sharepoint_timestamp: '2024-05-24T17:22:54+00:00',
                  },
                  oldRecord: {
                    id: 3,
                    cbc_id: 3,
                    json_data: {
                      phase: 2,
                      intake: 2,
                      locked: true,
                      errorLog: [],
                      highwayKm: null,
                      projectType: 'Last-Mile',
                      transportKm: null,
                      lastReviewed: '2024-07-09T00:00:00.000Z',
                      projectTitle: 'South Hazelton Broadband Expansion',
                      dateAnnounced: null,
                      projectNumber: 6036,
                      projectStatus: 'Reporting Complete',
                      householdCount: 235,
                      agreementSigned: true,
                      applicantAmount: 412386,
                      projectLocations: 'South Hazelton',
                      proposedStartDate: '2019-01-02T00:00:00.000Z',
                      bcFundingRequested: 250189,
                      projectDescription:
                        'Project will build a high-speed backbone and fibre to the home network to deliver high speed internet to the community of South Hazelton.',
                      totalProjectBudget: 662575,
                      announcedByProvince: true,
                      dateAgreementSigned: '2019-09-10T00:00:00.000Z',
                      lastMileProjectType: 'Fibre',
                      changeRequestPending: false,
                      currentOperatingName: 'CityWest Cable & Telephone Corp.',
                      lastMileMinimumSpeed: 50,
                      secondaryNewsRelease:
                        'https://www.citywest.ca/about-us/news/2020/06/04/citywest-to-launch-services-in-south-hazelton  \n\nhttps://news.gov.bc.ca/releases/2020CITZ0068-002125',
                      indigenousCommunities: null,
                      otherFundingRequested: null,
                      proposedCompletionDate: '2020-01-01T00:00:00.000Z',
                      constructionCompletedOn: '2020-11-12T00:00:00.000Z',
                      dateApplicationReceived: '2019-02-13T00:00:00.000Z',
                      federalFundingRequested: null,
                      reportingCompletionDate: '2022-10-05T00:00:00.000Z',
                      applicantContractualName:
                        'CityWest Cable & Telephone Corp.',
                      dateConditionallyApproved: '2019-05-24T00:00:00.000Z',
                      eightThirtyMillionFunding: false,
                      projectMilestoneCompleted: 100,
                      communitiesAndLocalesCount: 1,
                      conditionalApprovalLetterSent: true,
                      connectedCoastNetworkDependant: false,
                    },
                    created_at: '2024-05-24T17:39:54.240526+00:00',
                    created_by: null,
                    updated_at: '2024-09-25T18:19:56.329161+00:00',
                    updated_by: 100,
                    archived_at: null,
                    archived_by: null,
                    change_reason: null,
                    project_number: 6036,
                    sharepoint_timestamp: '2024-05-24T17:22:54+00:00',
                  },
                  tableName: 'cbc_data',
                  ccbcUserByCreatedBy: {
                    givenName: 'Leslie',
                    familyName: 'Chiu',
                    id: 'WyJjY2JjX3VzZXJzIiwxMDdd',
                  },
                },
              ],
            },
            id: 'WyJjYmNzIiwzXQ==',
          },
          {
            rowId: 4,
            projectNumber: 5070,
            history: {
              nodes: [
                {
                  op: 'UPDATE',
                  createdAt: '2024-05-24T17:39:54.329486+00:00',
                  createdBy: 1,
                  id: 'WyJyZWNvcmRfdmVyc2lvbnMiLDM0OTY3XQ==',
                  record: {
                    id: 9,
                    cbc_id: 4,
                    json_data: {
                      phase: 2,
                      zones: [11],
                      intake: 1,
                      locked: null,
                      errorLog: [],
                      highwayKm: null,
                      projectType: 'Transport',
                      reviewNotes:
                        'Qtrly Report: Milestone Comment  -> Waiting for change order approval',
                      transportKm: 125,
                      lastReviewed: '2024-07-09T00:00:00.000Z',
                      projectTitle:
                        'Transport Fibre Builds - Whistler to Cache Creek',
                      dateAnnounced: '2018-03-13T00:00:00.000Z',
                      projectNumber: 5070,
                      projectStatus: 'Agreement Signed',
                      householdCount: null,
                      agreementSigned: true,
                      applicantAmount: 1641519,
                      projectLocations:
                        "Lower Hat Creek 2 (Bonaparte)\nUpper Hat Creek 1 (Bonaparte)\nMount Currie (Lil'wat Nation)\nPavilion (Ts'kw'aylaxw First Nation)\nTs'kw'aylaxw\nXaxli'p.",
                      milestoneComments: 'Waiting for change order approval',
                      proposedStartDate: '2018-02-05T00:00:00.000Z',
                      bcFundingRequested: 1927353,
                      primaryNewsRelease:
                        'https://news.gov.bc.ca/releases/2018CITZ0005-000389',
                      projectDescription:
                        'A fibre backbone network will be established to improve broadband capacity',
                      totalProjectBudget: 5633904,
                      announcedByProvince: true,
                      dateAgreementSigned: '2020-03-12T00:00:00.000Z',
                      changeRequestPending: false,
                      currentOperatingName: 'Rogers Communications Canada Inc.',
                      federalFundingSource: 'ISED-CTI',
                      federalProjectNumber: 'CTI-812494',
                      secondaryNewsRelease:
                        'https://www.canada.ca/en/innovation-science-economic-development/news/2018/03/rural-and-remote-communities-in-british-columbia-will-benefit-from-faster-internet.html\n\nhttps://news.gov.bc.ca/factsheets/internet-connectivity-in-bc\n\nhttps://news.gov.bc.ca/releases/2018CITZ0013-000499',
                      transportProjectType: 'Fibre',
                      indigenousCommunities: 6,
                      otherFundingRequested: null,
                      proposedCompletionDate: '2023-12-31T00:00:00.000Z',
                      constructionCompletedOn: '2023-12-21T00:00:00.000Z',
                      dateApplicationReceived: '2017-04-19T00:00:00.000Z',
                      federalFundingRequested: 2065032,
                      reportingCompletionDate: null,
                      applicantContractualName: 'Shaw Cablesystems G.P.',
                      dateConditionallyApproved: '2018-03-07T00:00:00.000Z',
                      eightThirtyMillionFunding: false,
                      projectMilestoneCompleted: 100,
                      communitiesAndLocalesCount: 14,
                      conditionalApprovalLetterSent: true,
                      connectedCoastNetworkDependant: false,
                    },
                    created_at: '2024-05-24T17:39:54.329486+00:00',
                    created_by: null,
                    updated_at: '2025-02-26T22:37:15.138305+00:00',
                    updated_by: null,
                    archived_at: null,
                    archived_by: null,
                    change_reason: 'Initial upload of zones from data team',
                    project_number: 5070,
                    added_communities: null,
                    deleted_communities: null,
                    sharepoint_timestamp: '2024-05-24T17:22:54+00:00',
                  },
                  oldRecord: {
                    id: 9,
                    cbc_id: 4,
                    json_data: {
                      phase: 2,
                      intake: 1,
                      locked: null,
                      errorLog: [],
                      highwayKm: null,
                      projectType: 'Transport',
                      reviewNotes:
                        'Qtrly Report: Milestone Comment  -> Waiting for change order approval',
                      transportKm: 125,
                      lastReviewed: '2024-07-09T00:00:00.000Z',
                      projectTitle:
                        'Transport Fibre Builds - Whistler to Cache Creek',
                      dateAnnounced: '2018-03-13T00:00:00.000Z',
                      projectNumber: 5070,
                      projectStatus: 'Agreement Signed',
                      householdCount: null,
                      agreementSigned: true,
                      applicantAmount: 1641519,
                      projectLocations:
                        "Lower Hat Creek 2 (Bonaparte)\nUpper Hat Creek 1 (Bonaparte)\nMount Currie (Lil'wat Nation)\nPavilion (Ts'kw'aylaxw First Nation)\nTs'kw'aylaxw\nXaxli'p.",
                      milestoneComments: 'Waiting for change order approval',
                      proposedStartDate: '2018-02-05T00:00:00.000Z',
                      bcFundingRequested: 1927353,
                      primaryNewsRelease:
                        'https://news.gov.bc.ca/releases/2018CITZ0005-000389',
                      projectDescription:
                        'A fibre backbone network will be established to improve broadband capacity',
                      totalProjectBudget: 5633904,
                      announcedByProvince: true,
                      dateAgreementSigned: '2020-03-12T00:00:00.000Z',
                      changeRequestPending: false,
                      currentOperatingName: 'Rogers Communications Canada Inc.',
                      federalFundingSource: 'ISED-CTI',
                      federalProjectNumber: 'CTI-812494',
                      secondaryNewsRelease:
                        'https://www.canada.ca/en/innovation-science-economic-development/news/2018/03/rural-and-remote-communities-in-british-columbia-will-benefit-from-faster-internet.html\n\nhttps://news.gov.bc.ca/factsheets/internet-connectivity-in-bc\n\nhttps://news.gov.bc.ca/releases/2018CITZ0013-000499',
                      transportProjectType: 'Fibre',
                      indigenousCommunities: 6,
                      otherFundingRequested: null,
                      proposedCompletionDate: '2023-12-31T00:00:00.000Z',
                      constructionCompletedOn: '2023-12-21T00:00:00.000Z',
                      dateApplicationReceived: '2017-04-19T00:00:00.000Z',
                      federalFundingRequested: 2065032,
                      reportingCompletionDate: null,
                      applicantContractualName: 'Shaw Cablesystems G.P.',
                      dateConditionallyApproved: '2018-03-07T00:00:00.000Z',
                      eightThirtyMillionFunding: false,
                      projectMilestoneCompleted: 100,
                      communitiesAndLocalesCount: 14,
                      conditionalApprovalLetterSent: true,
                      connectedCoastNetworkDependant: false,
                    },
                    created_at: '2024-05-24T17:39:54.329486+00:00',
                    created_by: null,
                    updated_at: '2024-09-25T18:19:56.354057+00:00',
                    updated_by: 100,
                    archived_at: null,
                    archived_by: null,
                    change_reason: null,
                    project_number: 5070,
                    sharepoint_timestamp: '2024-05-24T17:22:54+00:00',
                  },
                  tableName: 'cbc_data',
                  ccbcUserByCreatedBy: {
                    givenName: null,
                    familyName: null,
                    id: 'WyJjY2JjX3VzZXJzIiwxXQ==',
                  },
                },
              ],
            },
            id: 'WyJjYmNzIiw0XQ==',
          },
          {
            rowId: 50,
            projectNumber: 6870,
            history: {
              nodes: [
                {
                  op: 'UPDATE',
                  createdAt: '2024-05-24T17:39:54.556828+00:00',
                  createdBy: 336,
                  id: 'WyJyZWNvcmRfdmVyc2lvbnMiLDM2MzczXQ==',
                  record: {
                    id: 54,
                    cbc_id: 50,
                    json_data: {
                      notes: 'COVID-19 Intake',
                      phase: 3,
                      zones: [9],
                      intake: 3,
                      locked: true,
                      errorLog: [],
                      highwayKm: null,
                      projectType: 'Last-Mile',
                      transportKm: null,
                      lastReviewed: '2024-07-09T00:00:00.000Z',
                      projectTitle:
                        'Access Point Upgrade - St. Leon to Trout Lake',
                      dateAnnounced: '2020-04-24T00:00:00.000Z',
                      projectNumber: 6870,
                      projectStatus: 'Reporting Complete',
                      householdCount: 154,
                      agreementSigned: true,
                      applicantAmount: 14411,
                      projectLocations:
                        'Beaton/Whiskey Point (27HH); Galena Bay/Galena Shores (30HH); Haylon/Lakeside (22HH); Sawczuk Rd. (18HH); St. Leon (2HH); Trout Lake Lake (2HH); Trout Lake Properties (10HH); Trout Lake Town Site (127HH)',
                      proposedStartDate: '2020-05-20T00:00:00.000Z',
                      bcFundingRequested: 9817,
                      primaryNewsRelease:
                        'https://news.gov.bc.ca/releases/2020CITZ0008-000751',
                      projectDescription:
                        'Infrastructure upgrade project to provide improved internet speeds to eight communities.',
                      totalProjectBudget: 36920,
                      announcedByProvince: true,
                      dateAgreementSigned: '2020-06-26T00:00:00.000Z',
                      lastMileProjectType: 'Upgrade Wireless',
                      changeRequestPending: false,
                      currentOperatingName: 'Trout Lake BC Internet Society',
                      lastMileMinimumSpeed: 25,
                      secondaryNewsRelease:
                        'https://news.gov.bc.ca/releases/2020CITZ0038-001783',
                      indigenousCommunities: null,
                      otherFundingRequested: 12692,
                      proposedCompletionDate: '2020-06-30T00:00:00.000Z',
                      constructionCompletedOn: '2020-06-30T00:00:00.000Z',
                      dateApplicationReceived: '2020-05-08T00:00:00.000Z',
                      federalFundingRequested: null,
                      reportingCompletionDate: '2020-07-28T00:00:00.000Z',
                      applicantContractualName:
                        'Trout Lake BC Internet Society',
                      dateConditionallyApproved: '2020-05-20T00:00:00.000Z',
                      eightThirtyMillionFunding: false,
                      projectMilestoneCompleted: 100,
                      communitiesAndLocalesCount: 4,
                      conditionalApprovalLetterSent: true,
                      connectedCoastNetworkDependant: false,
                    },
                    created_at: '2024-05-24T17:39:54.556828+00:00',
                    created_by: null,
                    updated_at: '2025-05-22T16:14:37.004492+00:00',
                    updated_by: 336,
                    archived_at: null,
                    archived_by: null,
                    change_reason: 'sd',
                    project_number: 6870,
                    added_communities: [
                      {
                        id: 1,
                        cbc_id: 50,
                        latitude: 57.937307,
                        map_link:
                          'https://apps.gov.bc.ca/pub/bcgnws/names/40304.html',
                        longitude: -130.03517399999998,
                        created_at: '2024-08-07T16:57:20.674395+00:00',
                        created_by: 336,
                        updated_at: '2024-09-25T18:18:05.933174+00:00',
                        updated_by: 100,
                        archived_at: null,
                        archived_by: null,
                        economic_region: 'North Coast',
                        geographic_type: 'Locality',
                        regional_district:
                          'Regional District of Kitimat-Stikine',
                        bc_geographic_name: '40 Mile Flats',
                        geographic_name_id: 40304,
                        communities_source_data_id: 40304,
                      },
                    ],
                    deleted_communities: [
                      {
                        id: 244,
                        cbc_id: 50,
                        latitude: 50.733197,
                        map_link:
                          'https://apps.gov.bc.ca/pub/bcgnws/names/2738.html',
                        longitude: -117.734488,
                        created_at: '2024-08-07T16:57:22.269325+00:00',
                        created_by: 336,
                        updated_at: '2024-09-25T18:18:07.651715+00:00',
                        updated_by: 100,
                        archived_at: null,
                        archived_by: null,
                        economic_region: 'Thompson--Okanagan',
                        geographic_type: 'Locality',
                        regional_district: 'Columbia Shuswap Regional District',
                        bc_geographic_name: 'Beaton',
                        geographic_name_id: 2738,
                        communities_source_data_id: 2738,
                      },
                      {
                        id: 992,
                        cbc_id: 50,
                        latitude: 50.666529,
                        map_link:
                          'https://apps.gov.bc.ca/pub/bcgnws/names/5227.html',
                        longitude: -117.851157,
                        created_at: '2024-08-07T16:57:26.898619+00:00',
                        created_by: 336,
                        updated_at: '2024-09-25T18:18:12.560262+00:00',
                        updated_by: 100,
                        archived_at: null,
                        archived_by: null,
                        economic_region: 'Thompson--Okanagan',
                        geographic_type: 'Locality',
                        regional_district: 'Columbia Shuswap Regional District',
                        bc_geographic_name: 'Galena Bay',
                        geographic_name_id: 5227,
                        communities_source_data_id: 5227,
                      },
                    ],
                    sharepoint_timestamp: '2024-05-24T17:22:54+00:00',
                  },
                  oldRecord: {
                    id: 54,
                    cbc_id: 50,
                    json_data: {
                      notes: 'COVID-19 Intake',
                      phase: 3,
                      zones: [9],
                      intake: 3,
                      locked: true,
                      errorLog: [],
                      highwayKm: null,
                      projectType: 'Last-Mile',
                      transportKm: null,
                      lastReviewed: '2024-07-09T00:00:00.000Z',
                      projectTitle:
                        'Access Point Upgrade - St. Leon to Trout Lake',
                      dateAnnounced: '2020-04-24T00:00:00.000Z',
                      projectNumber: 6870,
                      projectStatus: 'Reporting Complete',
                      householdCount: 154,
                      agreementSigned: true,
                      applicantAmount: 14411,
                      projectLocations:
                        'Beaton/Whiskey Point (27HH); Galena Bay/Galena Shores (30HH); Haylon/Lakeside (22HH); Sawczuk Rd. (18HH); St. Leon (2HH); Trout Lake Lake (2HH); Trout Lake Properties (10HH); Trout Lake Town Site (127HH)',
                      proposedStartDate: '2020-05-20T00:00:00.000Z',
                      bcFundingRequested: 9817,
                      primaryNewsRelease:
                        'https://news.gov.bc.ca/releases/2020CITZ0008-000751',
                      projectDescription:
                        'Infrastructure upgrade project to provide improved internet speeds to eight communities.',
                      totalProjectBudget: 36920,
                      announcedByProvince: true,
                      dateAgreementSigned: '2020-06-26T00:00:00.000Z',
                      lastMileProjectType: 'Upgrade Wireless',
                      changeRequestPending: false,
                      currentOperatingName: 'Trout Lake BC Internet Society',
                      lastMileMinimumSpeed: 25,
                      secondaryNewsRelease:
                        'https://news.gov.bc.ca/releases/2020CITZ0038-001783',
                      indigenousCommunities: null,
                      otherFundingRequested: 12692,
                      proposedCompletionDate: '2020-06-30T00:00:00.000Z',
                      constructionCompletedOn: '2020-06-30T00:00:00.000Z',
                      dateApplicationReceived: '2020-05-08T00:00:00.000Z',
                      federalFundingRequested: null,
                      reportingCompletionDate: '2020-07-28T00:00:00.000Z',
                      applicantContractualName:
                        'Trout Lake BC Internet Society',
                      dateConditionallyApproved: '2020-05-20T00:00:00.000Z',
                      eightThirtyMillionFunding: false,
                      projectMilestoneCompleted: 100,
                      communitiesAndLocalesCount: 4,
                      conditionalApprovalLetterSent: true,
                      connectedCoastNetworkDependant: false,
                    },
                    created_at: '2024-05-24T17:39:54.556828+00:00',
                    created_by: null,
                    updated_at: '2025-02-26T22:37:15.138305+00:00',
                    updated_by: null,
                    archived_at: null,
                    archived_by: null,
                    change_reason: 'Initial upload of zones from data team',
                    project_number: 6870,
                    sharepoint_timestamp: '2024-05-24T17:22:54+00:00',
                  },
                  tableName: 'cbc_data',
                  ccbcUserByCreatedBy: {
                    givenName: 'Rumesha',
                    familyName: 'Ranathunga',
                    id: 'WyJjY2JjX3VzZXJzIiwzMzZd',
                  },
                },
              ],
            },
            id: 'WyJjYmNzIiw1MF0=',
          },
        ],
      },
    };
  },
};

const mockShowTable: FeatureResult<JSONValue> = {
  value: true,
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'show_project_change_log_table',
};

jest.mock('@bcgov-cas/sso-express/dist/helpers');

jest.mock('js-cookie', () => ({
  get: jest.fn(),
  remove: jest.fn(),
  set: jest.fn(),
}));

const pageTestingHelper = new PageTestingHelper<changeLogQuery>({
  pageComponent: ChangeLog,
  compiledQuery: compiledchangelogQuery,
  defaultQueryResolver: mockQueryPayload,
});

describe('The index page', () => {
  beforeEach(() => {
    cookie.get.mockImplementation(() => null);
    pageTestingHelper.reinit();

    jest.spyOn(moduleApi, 'useFeature').mockImplementation(() => {
      return mockShowTable;
    });
  });

  it('should redirect a user logged in with IDIR but not assigned a role', async () => {
    mocked(isAuthenticated).mockReturnValue(true);

    const ctx = {
      req: {
        url: '/analyst/change-log',
        claims: {
          client_roles: [],
          identity_provider: 'idir',
        },
      },
    } as any;

    expect(await defaultRelayOptions.serverSideProps(ctx)).toEqual({
      redirect: {
        destination: '/analyst/request-access',
      },
    });
  });

  it('change log table headers are successfully loaded', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Date and Time')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Fields changed')).toBeInTheDocument();
    expect(screen.getByText('New Value')).toBeInTheDocument();
    expect(screen.queryByText('Old Value')).toBeInTheDocument();
  });

  it('displays the change log table with correct values', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('5070')).toBeInTheDocument();
    expect(screen.getByText('Feb 26, 2025, 2:37 p.m.')).toBeInTheDocument();
    expect(screen.getByText('The System')).toBeInTheDocument();
    expect(screen.getByText(/Project Zone/)).toBeInTheDocument();
    expect(screen.getByText('11')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();

    expect(screen.getByText('6036')).toBeInTheDocument();
    expect(screen.getByText('Dec 3, 2024, 9:51 a.m.')).toBeInTheDocument();
    expect(screen.getByText('Leslie Chiu')).toBeInTheDocument();
    expect(screen.getByText(/BC Funding Requested/)).toBeInTheDocument();
    expect(screen.getByText('$412,385')).toBeInTheDocument();
    expect(screen.getByText('$250,189')).toBeInTheDocument();

    expect(screen.getByText(/Total Project Budget/)).toBeInTheDocument();
    expect(screen.getByText('$824,771')).toBeInTheDocument();
    expect(screen.getByText('$662,575')).toBeInTheDocument();
  });

  it('communities location data gets loaded correctly', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('6870')).toBeInTheDocument();
    expect(screen.getByText('May 22, 2025, 9:14 a.m.')).toBeInTheDocument();
    expect(screen.getByText('Communities Added')).toBeInTheDocument();
    expect(screen.getByText('Communities Removed')).toBeInTheDocument();
    expect(screen.getByText(/North Coast/)).toBeInTheDocument();
    expect(
      screen.getByText(/Regional District of Kitimat-Stikine/)
    ).toBeInTheDocument();
    expect(screen.getByText('40 Mile Flats')).toBeInTheDocument();
  });

  it('correctly filters field changed', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('6036')).toBeInTheDocument();
    expect(screen.getByText('5070')).toBeInTheDocument();
    expect(screen.getByText('Project Zone')).toBeInTheDocument();
    expect(screen.getByText('BC Funding Requested')).toBeInTheDocument();
    const input = screen.getByPlaceholderText('Filter by Fields changed');
    await userEvent.type(input, 'Project Zone');
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText('Project Zone')).toBeInTheDocument();
      expect(
        screen.queryByText('BC Funding Requested')
      ).not.toBeInTheDocument();
      expect(screen.getByText('5070')).toBeInTheDocument();
      expect(screen.queryByText('6036')).not.toBeInTheDocument();
    });
  });

  it('shows global filter and filters results based on input', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('6036')).toBeInTheDocument();
    expect(screen.getByText('5070')).toBeInTheDocument();

    const globalSearch = screen.getByPlaceholderText('Search');
    expect(globalSearch).toBeInTheDocument();

    fireEvent.change(globalSearch, {
      target: { value: 'Leslie' },
    });

    await waitFor(() => {
      expect(screen.getByText('6036')).toBeInTheDocument();
      expect(screen.queryByText('5070')).not.toBeInTheDocument();
    });
  });
});
