/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import milestoneUpload from '../../../backend/lib/milestone-upload';
import { performQuery } from '../../../backend/lib/graphql';
import getAuthRole from '../../../utils/getAuthRole';

jest.mock('../../../backend/lib/graphql');
jest.mock('../../../utils/getAuthRole');

const expectedQueryInput = {
  input: {
    _applicationId: 1,
    _jsonData: {
      milestone1DateOfReception: '2023-01-01T00:00:00.000Z',
      milestone1Progress: 0.2,
      milestone1ProjectSites: [
        {
          isPOP: 'Y',
          isRequired: true,
          isSubmitted: true,
          isedComments: 'This is an ISED Comment',
          milestoneOneDueDate: 46388,
          projectSite: 'SiteName1',
          recipientComments: 'Milestone 1 Recipient Comment',
          siteId: 'SiteId1',
          status: 'Approved',
        },
      ],
      milestone2DateOfReception: '2023-01-01T00:00:00.000Z',
      milestone2Progress: 0.3,
      milestone2ProjectSites: [
        {
          detailedProgress: {
            landAccessPermitEvidence: {
              applicable: true,
              progress: 0,
            },
            photographsOfProjectSites: {
              applicable: true,
              progress: 0,
            },
            pointOfPresenceConfirmation: {
              applicable: true,
              progress: 0,
            },
            radioAndSpectrumLicenses: {
              applicable: false,
              progress: 0,
            },
          },
          isPOP: 'Y',
          isedComments: 'This is an ISED comment',
          landAccessPermitEvidenceIsRequired: true,
          landAccessPermitEvidenceIsSubmitted: true,
          landAccessPermitEvidenceStatus: 'Incomplete',
          milestoneTwoDueDate: 46420,
          photographsOfProjectSitesIsRequired: true,
          photographsOfProjectSitesIsSubmitted: false,
          photographsOfProjectSitesStatus: 'Incomplete',
          pointOfPresenceConfirmationIsRequired: false,
          pointOfPresenceConfirmationIsSubmitted: true,
          pointOfPresenceConfirmationStatus: 'Approved',
          projectSite: 'SiteName1',
          radioAndSpectrumLicensesIsRequired: false,
          radioAndSpectrumLicensesIsSubmitted: true,
          radioandspetrumLicensesStatus: 'Approved',
          recipientComments: 'This is a recipient comment',
          siteId: 'SiteId1',
        },
      ],
      milestone3Progress: 0.2,
      overallMilestoneProgress: 0.7,
      projectNumber: 'CCBC-010001',
    },
    _oldId: 1,
  },
};

function FormDataMock() {
  this.append = jest.fn();
}

global.FormData = jest.fn(() => {
  return FormDataMock();
}) as jest.Mock;

jest.setTimeout(100000);

describe('The Milestone excel import api route', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    app.use('/', milestoneUpload);
  });

  it('should receive the correct response for unauthorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_guest',
        landingRoute: '/',
      };
    });

    const response = await request(app).post(
      '/api/analyst/milestone/1/CCBC-010001/1'
    );
    expect(response.status).toBe(404);
  });

  it('should process uploaded file for authorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          createApplicationMilestoneData: {
            applicationMilestoneData: { rowId: 1 },
          },
        },
      };
    });

    const response = await request(app)
      .post('/api/analyst/milestone/10/CCBC-010001/1')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'milestone-data' }))
      // replace with milestone file once we receive it
      .attach('milestone-data', `${__dirname}/milestone.xlsx`)
      .expect(200);

    expect(response.status).toBe(200);
  });

  it('should return error if file does not have expected worksheets', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    const response = await request(app)
      .post('/api/analyst/milestone/1/CCBC-010001/1')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'milestone-data' }))
      .attach('milestone-data', `${__dirname}/sow_200.xlsx`)
      .expect(400);

    expect(response.status).toBe(400);
    expect(response.body).toEqual([
      {
        level: 'workbook',
        error: `missing required sheet "Project Updates Centre". Found: ["Summary_Sommaire","1","2","3","4","5","6","7","8","Change Log","Controls","Controls_E","Controls_F","Communities","Text"]`,
      },
      {
        level: 'workbook',
        error: `missing required sheet "Milestone 1". Found: ["Summary_Sommaire","1","2","3","4","5","6","7","8","Change Log","Controls","Controls_E","Controls_F","Communities","Text"]`,
      },
      {
        level: 'workbook',
        error: `missing required sheet "Milestone 2". Found: ["Summary_Sommaire","1","2","3","4","5","6","7","8","Change Log","Controls","Controls_E","Controls_F","Communities","Text"]`,
      },
    ]);
  });

  it('should return an error if the project number does not match', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    const response = await request(app)
      .post('/api/analyst/milestone/1/CCBC-010002/1')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'milestone-data' }))
      .attach('milestone-data', `${__dirname}/milestone.xlsx`)
      .expect(400);

    expect(response.status).toBe(400);

    expect(response.body).toEqual([
      {
        error:
          'CCBC Number mismatch: expected CCBC-010002, received: CCBC-010001',
      },
    ]);
  });

  it('receives and parses the excel file', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    let queryInput = null;

    mocked(performQuery).mockImplementation(async (_mutation, input) => {
      queryInput = input;
      return {
        data: {
          applicationByRowId: {
            applicationMilestoneExcelDataByApplicationId: {
              nodes: [
                {
                  jsonData: {
                    ...expectedQueryInput.input._jsonData,
                  },
                  rowId: 1,
                },
              ],
            },
          },
        },
      };
    });

    const response = await request(app)
      .post('/api/analyst/milestone/1/CCBC-010001/1')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'milestone-data' }))
      .attach('milestone-data', `${__dirname}/milestone.xlsx`)
      .expect(200);

    expect(response.status).toBe(200);

    expect(queryInput).toEqual(expectedQueryInput);
  });

  afterEach(async () => {
    // eslint-disable-next-line no-promise-executor-return
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  });
  jest.resetAllMocks();
});
