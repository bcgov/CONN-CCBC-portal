import crypto from 'crypto';
import s3Client from '../s3client';
import config from '../../../config';

const AWS_S3_BUCKET = config.get('AWS_S3_BUCKET');

const saveRemoteFile = async (stream) => {
  const uuid = crypto.randomUUID();

  try {
    const uploadParams = {
      Bucket: AWS_S3_BUCKET,
      Key: uuid,
      Body: stream,
    };

    const options = { partSize: 10 * 1024 * 1024, queueSize: 1 };

    s3Client.upload(uploadParams, options, (err, data) => {
      if (err) {
        return console.log(err);
      } else {
        return console.log(data);
      }
    });
    return;
  } catch (err) {
    if (!stream) {
      throw 'Choose a file to upload first.';
    }
  }
};

export default async function resolveFileUpload(upload) {
  const { createReadStream } = upload;
  const stream = createReadStream();

  // Save tile to remote storage system
  const uuid = await saveRemoteFile(stream);

  return uuid;
}
