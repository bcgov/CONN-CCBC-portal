/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import getAuthRole from '../../../utils/getAuthRole';
import { uploadFileToS3 } from '../../../backend/lib/s3client';

let mockUpload = () => {};

jest.mock("aws-sdk", () => {
  return {
    config: {
      update() {
        return {};
      },
    },
    Credentials:jest.fn(() => {}),
    ChainableTemporaryCredentials:jest.fn(() => {}),
    S3:jest.fn(()=>({
      GetObject: jest.fn(),
      upload: ()=>{
        return {
          promise: jest.fn(() => {
          return new Promise((resolve) => {
            resolve(mockUpload());
          });
        })}
      }
    }))
  };
});
jest.mock('../../../backend/lib/graphql');
jest.mock('../../../utils/getAuthRole');

jest.setTimeout(10000000);

describe('S3 client', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
  });

  it('should receive the correct response for authorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_gccbc_adminuest',
        landingRoute: '/',
      };
    });

    const params = {
      Bucket: 'bucket',
      Key: 'file',
      Body:  'filebody',
    };
    const response = await uploadFileToS3(params);
    expect(response).toBe(true);
  });

  it('should receive the return error details', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });
    mockUpload = () => {throw Error('oops')};

    const params = {
      Bucket: 'bucket',
      Key: 'file',
      Body:  'filebody',
    };
    const response = await uploadFileToS3(params);
    expect(response).toBe(false);
  });

  jest.resetAllMocks();
});
