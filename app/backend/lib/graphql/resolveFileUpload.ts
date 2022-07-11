import crypto from 'crypto';
import s3Client from '../s3client';
import config from '../../../config';

const AWS_S3_BUCKET = config.get('AWS_S3_BUCKET');
const AWS_S3_REGION = config.get('AWS_S3_REGION');
const AWS_S3_KEY = config.get('AWS_S3_KEY');
const AWS_S3_SECRET_KEY = config.get('AWS_S3_SECRET_KEY');
const OPENSHIFT_APP_NAMESPACE = config.get('OPENSHIFT_APP_NAMESPACE');

const isLocalDevelopment =
  !OPENSHIFT_APP_NAMESPACE ||
  !AWS_S3_BUCKET ||
  !AWS_S3_REGION ||
  !AWS_S3_KEY ||
  !AWS_S3_SECRET_KEY;

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

const saveLocalFile = async (upload) => {
  const uuid = crypto.randomUUID();

  // Todo: save to local filesystem

  return uuid;
};

export default async function resolveFileUpload(upload) {
  if (isLocalDevelopment) {
    return saveLocalFile(upload);
  } else {
    const { createReadStream } = upload;
    const stream = createReadStream();
    // Save tile to remote storage system
    const uuid = await saveRemoteFile(stream);

    return uuid;
  }
}
