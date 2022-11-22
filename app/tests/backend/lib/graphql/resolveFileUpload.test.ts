import resolveFileUpload, {
  saveLocalFile,
  saveRemoteFile,
} from 'backend/lib/graphql/resolveFileUpload';

describe('The saveRemoteFile function', () => {
  it('should throw an error when no file is present', async () => {
    await expect(saveRemoteFile(null)).rejects.toThrow(
      'Choose a file to upload first.'
    );
  });

  it('should throw an error with unsupported payload', async () => {
    await expect(saveRemoteFile({})).rejects.toThrow(
      'Error, unable to upload to S3: Error: Unsupported body payload object'
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
