/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import { PassThrough } from 'stream';
import s3archive from '../../../backend/lib/s3archive';
import getAttachementList from '../../../backend/lib/attachements';
import { performQuery } from '../../../backend/lib/graphql';
import getAuthRole from '../../../utils/getAuthRole';

jest.mock('../../../backend/lib/graphql');
jest.mock('../../../utils/getAuthRole');

jest.setTimeout(10000000);

const INFECTED_FILE_PREFIX = 'BROKEN';
const mockStream = new PassThrough();

let mockObjectTagging;
const mockObjectTaggingDirty = {
  promise: () => {
    return new Promise((resolve) => {
      resolve({
        TagSet: [{ Key: 'av_status', Value: 'dirty' }],
      });
    });
  },
  catch: jest.fn(),
};

const mockObjectTaggingClean = {
  promise: () => {
    return new Promise((resolve) => {
      resolve({
        TagSet: [{ Key: 'av_status', Value: 'clean' }],
      });
    });
  },
  catch: jest.fn(),
};

jest.mock('../../../backend/lib/s3client', () => {
  return {
    upload: jest.fn().mockReturnThis(),
    listObjects: jest.fn().mockReturnThis(),
    getObject: () => {
      return {
        createReadStream: () => {
          mockStream.emit('data', 'hello world');
          mockStream.end();
          return mockStream;
        },
        promise: jest.fn(() => {
          return new Promise((resolve) => {
            resolve({
              TagSet: [{ Key: 'av_status', Value: 'dirty' }],
            });
          });
        }),
        catch: jest.fn(),
      };
    },
    getObjectTagging: () => {
      return mockObjectTagging;
    },
  };
});

describe('Attachment list', () => {
  let app;

  beforeEach(async () => {
    mockObjectTagging = null;
    app = express();
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    app.use('/', s3archive);
  });

  it('should produce correct list with clean file', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          allApplications: {
            nodes: [
              {
                formData: {
                  jsonData: {
                    templateUploads: {
                      detailedBudget: [
                        {
                          uuid: 'd56a8477-b4d8-43c7-bd75-75d376ddeca4',
                          name: 'File.pdf',
                          size: 35,
                          type: 'text/plain',
                        },
                      ],
                    },
                  },
                },
                ccbcNumber: 'CCBC-100001',
              },
            ],
          },
        },
      };
    });

    mockObjectTagging = mockObjectTaggingClean;
    const response = await getAttachementList(1,request);

    const expected =  [
      {
        uuid: 'd56a8477-b4d8-43c7-bd75-75d376ddeca4',
        name: '/CCBC-100001/Step 2 - Templates/CCBC-100001 - Template 2 - File.pdf'
      },
    ]
    expect(response).toEqual(expected);
  });

  it('should produce correct list with infected file', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          allApplications: {
            nodes: [
              {
                formData: {
                  jsonData: {
                    templateUploads: {
                      detailedBudget: [
                        {
                          uuid: 'd56a8477-b4d8-43c7-bd75-75d376ddeca4',
                          name: 'File.pdf',
                          size: 35,
                          type: 'text/plain',
                        },
                      ],
                    },
                  },
                },
                ccbcNumber: 'CCBC-100001',
              },
            ],
          },
        },
      };
    });

    mockObjectTagging = mockObjectTaggingDirty;
    const response = await getAttachementList(1,request);

    const expected =  [
      {
        uuid: 'd56a8477-b4d8-43c7-bd75-75d376ddeca4',
        name: `${INFECTED_FILE_PREFIX}_/CCBC-100001/Step 2 - Templates/CCBC-100001 - Template 2 - File.pdf`
      },
    ]
    expect(response).toEqual(expected);
  });

  jest.resetAllMocks();
});
