/**
 * @jest-environment node
 */
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import {
  uploadFileToS3,
  getFileFromS3,
  checkFileExists,
  getFileTagging,
  getSignedUrlPromise,
  getByteArrayFromS3,
} from '../../../backend/lib/s3client';

const mockRequestedAt = '2021-09-01T00:00:00.000Z';

jest.mock('@aws-sdk/middleware-apply-body-checksum');
jest.mock('../../../backend/lib/awsCommon', () => {
  return {
    region: 'AWS_S3_REGION',
    logger: console,
    requestHandler: jest.fn(),
    credentials: () => {
      return {
        params: {
          RoleArn: 'AWS_ROLE_ARN',
          RoleSessionName: `s3-v3-role-session-${Date.now()}`,
          DurationSeconds: 3600,
        },
        clientConfig: { region: 'AWS_S3_REGION' },
      };
    },
  };
});

jest.mock('@aws-sdk/s3-request-presigner', () => {
  return {
    getSignedUrl: () => {
      return new Promise((resolve) => {
        resolve('fake_signed_url');
      });
    },
  };
});

jest.mock('@aws-sdk/client-s3', () => {
  const mockByteArray = new Uint8Array([65, 66, 67]);
  return {
    S3Client: jest.fn().mockImplementation(() => {
      return {
        middlewareStack: { use: jest.fn() },
        config: {},
        send: () => {
          return new Promise((resolve) => {
            resolve({
              $metadata: {
                httpStatusCode: 200,
              },
              TagSet: [{ Key: 'av-status', Value: 'clean' }],
              Metadata: {
                'requested-at': mockRequestedAt,
              },
              Body: {
                transformToByteArray: jest
                  .fn()
                  .mockResolvedValue(mockByteArray),
              },
            });
          });
        },
      };
    }),

    GetObjectCommand: jest.fn().mockImplementation(() => {}),
    GetObjectTaggingCommand: jest.fn().mockImplementation(() => {}),
    HeadObjectCommand: jest.fn().mockImplementation(() => {}),
    PutObjectCommand: jest.fn().mockImplementation(() => {}),
  };
});

jest.mock('../../../backend/lib/graphql');
jest.mock('../../../utils/getAuthRole');

jest.setTimeout(1000);

describe('S3 client', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
  });

  it('should receive the correct response for file upload', async () => {
    const params = {
      Bucket: 'bucket',
      Key: 'file',
      Body: 'filebody',
    };
    const response = await uploadFileToS3(params);
    expect(response).toBe(true);
  });

  it('should receive the correct response for file download', async () => {
    const mockJson = jest.fn();
    const fakeResponse = {
      json: mockJson,
    };

    await getFileFromS3('uuid', 'filename', fakeResponse);
    expect(mockJson).toHaveBeenCalled();
  });

  it('should receive the correct response for file byte array download', async () => {
    const response = await getByteArrayFromS3('uuid');

    expect(response).toEqual(new Uint8Array([65, 66, 67]));
  });

  it('should receive the correct response to user checking if file exists', async () => {
    const params = {
      Bucket: 'bucket',
      Key: 'file',
      Body: 'filebody',
    };
    const response = await checkFileExists(params);
    expect(response.alreadyExists).toBe(true);
    expect(response.requestedAt).toBe(mockRequestedAt);
  });

  it('should receive the correct response to user checking file tags', async () => {
    const params = {
      Bucket: 'bucket',
      Key: 'file',
      Body: 'filebody',
    };
    const expected = {
      $metadata: { httpStatusCode: 200 },
      TagSet: [{ Key: 'av-status', Value: 'clean' }],
      Metadata: { 'requested-at': '2021-09-01T00:00:00.000Z' },
      Body: expect.anything(),
    };
    const response = await getFileTagging(params);
    expect(response).toEqual(expected);
  });

  it('should receive the correct response for signed url', async () => {
    const params = {
      Bucket: 'bucket',
      Key: 'file',
      Body: 'filebody',
    };
    const reply = await getSignedUrlPromise(params);
    expect(reply).toBe('fake_signed_url');
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
