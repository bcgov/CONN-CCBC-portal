/**
 * @jest-environment node
 */

import { Upload } from '@aws-sdk/lib-storage';
import resolveFileUpload, {
  saveLocalFile,
  saveRemoteFile,
} from 'backend/lib/graphql/resolveFileUpload';
import { Readable } from 'stream';

jest.mock('@aws-sdk/lib-storage');

const mockSignedUrl = {
  url: 'https://s3.eu-central-1.amazonaws.com/example-bucket',
  fields: {
    bucket: 'example-bucket',
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential':
      'SOMETHINGSOMETHING/123456/eu-central-1/s3/aws4_request',
    'X-Amz-Date': '20210704T104027Z',
    key: 'public/SOME-GUID-KEY',
    Policy: 'AREALLYLONGPOLICYSTRING',
    'X-Amz-Signature': 'SIGNATURESTRING',
  },
};

jest.mock('../../../../backend/lib/s3client', () => {
  return {
    upload: jest.fn().mockReturnThis(),
    listObjects: jest.fn().mockReturnThis(),
    createPresignedPost: () => {
      return new Promise((resolve) => {
        resolve(mockSignedUrl);
      });
    },
    getSignedUrlPromise: () => {
      return new Promise((resolve) => {
        resolve(mockSignedUrl);
      });
    },
  };
});

async function* generateContents() {
  for (let index = 0; index < 8; index += 1) {
    yield `[Part ${index}] ${'#'.repeat(2000000)}`;
  }
}
const fakeStreamOfUnknownlength = Readable.from(generateContents());

describe('The saveRemoteFile function', () => {
  it('should throw an error when no file is present', async () => {
    await expect(saveRemoteFile(null)).rejects.toThrow(
      'Choose a file to upload first.'
    );
  });

  it('should throw an error with unsupported payload', async () => {
    await expect(saveRemoteFile({ foo: 'bar' })).rejects.toThrow(
      'Choose a file to upload first.'
    );
  });

  it('Should throw error if data does not return key', async () => {
    (Upload as unknown as jest.Mock).mockImplementation(() => {
      return {
        done: jest.fn(() => ({})),
        on: jest.fn(() => {}),
      };
    });
    delete mockSignedUrl.fields.key;

    await expect(saveRemoteFile(fakeStreamOfUnknownlength)).rejects.toThrow(
      'Data does not contain a key'
    );
  });

  it('Should complete the upload and return the key', async () => {
    const mockDone = jest.fn().mockResolvedValue({
      Key: 'mocked-key',
    });

    (Upload as unknown as jest.Mock).mockImplementation(() => ({
      done: mockDone,
      on: jest.fn(),
    }));

    await expect(saveRemoteFile(fakeStreamOfUnknownlength)).resolves.toBe(
      'mocked-key'
    );
  });
});

describe('The saveLocalFile function', () => {
  it('should throw an error with unsupported payload', async () => {
    await expect(saveLocalFile({})).rejects.toThrow(
      'createReadStream is not a function'
    );
  });
});

describe('The resolveFileUpload function', () => {
  it('should throw an error when no file is present', async () => {
    await expect(resolveFileUpload({})).rejects.toThrow(
      'createReadStream is not a function'
    );
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
