/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import { PassThrough } from 'stream';
import s3adminArchive from '../../../backend/lib/s3admin-archive';
import { performQuery } from '../../../backend/lib/graphql';
import getAuthRole from '../../../utils/getAuthRole';

jest.mock('../../../backend/lib/graphql');
jest.mock('../../../utils/getAuthRole');

jest.setTimeout(10000000);

const mockStream = new PassThrough();

let mockObjectExists;

jest.mock('../../../backend/lib/s3client', () => {
  return { 
    checkFileExists: () => mockObjectExists,
    getFileFromS3: (uuid, filename, res) => {
      mockStream.emit('data', 'hello world');
      mockStream.end();
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-disposition', `attachment; filename=${filename}`);
      res.send(mockStream);
    },
    uploadFileToS3: () => {
      return new Promise((resolve) => {
        resolve({});
      });
    }
  }
});

describe('The attachments archive', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    app.use('/', s3adminArchive);
  });

  it('should receive the correct response for unauthorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_guest',
        landingRoute: '/',
      };
    });

    const response = await request(app).get('/api/analyst/admin-archive/1');
    expect(response.status).toBe(404);
  });

  it('should receive prepared archive for authorized user', async () => {
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
    mockObjectExists = true;
    const response = await request(app).get('/api/analyst/admin-archive/1');

    expect(response.status).toBe(200);
    expect(response.headers['content-disposition']).toMatch(
      /attachment; filename=Intake_1_attachments.zip/
    );

    expect(response.headers['content-type']).toBe('application/zip; charset=utf-8');
  });

  it('should receive the correct response when archive is not ready', async () => {
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
    mockObjectExists = false;
    const response = await request(app).get('/api/analyst/admin-archive/1');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
  });

  jest.resetAllMocks();
});
