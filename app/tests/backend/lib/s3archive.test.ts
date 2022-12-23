/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import AdmZip from 'adm-zip';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import { PassThrough } from 'stream';
import s3archive from '../../../backend/lib/s3archive';
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

const binaryParser = (res, callback) => {
  res.setEncoding('binary');
  res.data = '';
  res.on('data', (chunk) => {
    res.data += chunk;
  });
  res.on('end', () => {
    callback(null, Buffer.from(res.data, 'binary'));
  });
};

describe('The s3 archive', () => {
  let app;

  beforeEach(async () => {
    mockObjectTagging = null;
    app = express();
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    app.use('/', s3archive);
  });

  it('should receive the correct response for unauthorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_guest',
        landingRoute: '/',
      };
    });

    const response = await request(app).get('/api/analyst/archive');
    expect(response.status).toBe(404);
  });

  it('should receive the correct response for authorized user', async () => {
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
                  jsonData: {},
                },
                ccbcNumber: 'CCBC-100001',
              },
            ],
          },
        },
      };
    });

    const response = await request(app).get('/api/analyst/archive');

    expect(response.status).toBe(200);
    expect(response.headers['content-disposition']).toMatch(
      /attachment; filename=CCBC applications/
    );

    expect(response.headers['content-type']).toBe('application/zip');
  });

  it('should receive the archive with correct file', async () => {
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
    const response = await request(app)
      .get('/api/analyst/archive')
      .set('Accept', 'application/zip')
      .buffer()
      .parse(binaryParser);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('application/zip');

    expect(Buffer.isBuffer(response.body)).toBeTrue();

    const zip = new AdmZip(response.body);

    const zipEntries = zip.getEntries();
    expect(zipEntries.length).toBe(1);

    zipEntries.forEach((zipEntry) => {
      // check that file exists
      expect(zipEntry.entryName.indexOf('Template 2')).not.toBe(-1);

      // check that infected file was renamed
      expect(zipEntry.entryName.indexOf(INFECTED_FILE_PREFIX)).not.toBe(-1);
    });
  });

  it('should finish with empty detailedBudget', async () => {
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
                      detailedBudget: null,
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

    const response = await request(app)
      .get('/api/analyst/archive')
      .set('Accept', 'application/zip')
      .buffer()
      .parse(binaryParser);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('application/zip');

    expect(Buffer.isBuffer(response.body)).toBeTrue();

    const zip = new AdmZip(response.body);

    const zipEntries = zip.getEntries();
    expect(zipEntries.length).toBe(0);
  });

  it('should finish with empty detailedBudget and continue if non-array data stored', async () => {
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
                      detailedBudget: null,
                      asdf: { ja: 'asdf' },
                      financialForecast :[
                        {
                          uuid: 'd56a8477-b4d8-43c7-bd75-75d376ddeca4',
                          name: 'File.pdf',
                          size: 35,
                          type: 'text/plain',
                        }
                      ]
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

    const response = await request(app)
      .get('/api/analyst/archive')
      .set('Accept', 'application/zip')
      .buffer()
      .parse(binaryParser);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('application/zip');

    expect(Buffer.isBuffer(response.body)).toBeTrue();

    const zip = new AdmZip(response.body);

    const zipEntries = zip.getEntries();
    expect(zipEntries.length).toBe(1);  // financialForecast should be included
  });

  jest.resetAllMocks();
});
