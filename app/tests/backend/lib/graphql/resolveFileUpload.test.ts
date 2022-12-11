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
      'Error: Choose a file to upload first.'
    );
  });
  it('Should throw error if data does not return key', async () => {
    Upload.mockImplementation(() => {
      return {
        done: jest.fn(() => ({})),
        on: jest.fn(() => {}),
      };
    });
    await expect(saveRemoteFile(fakeStreamOfUnknownlength)).rejects.toThrow(
      'Data does not contain a key'
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
