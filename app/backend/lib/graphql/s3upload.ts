import crypto from 'crypto';
import config from '../../../config';
import s3Client from '../s3client';

const AWS_S3_BUCKET = config.get('AWS_S3_BUCKET');

async function generateUploadUrl() {
    const name = crypto.randomUUID();
    const expiresInMinutes = 1;
    const params = {
        Bucket: AWS_S3_BUCKET,
        Key: name,
        Expires: expiresInMinutes * 60, // the url will only be valid for 1 minute 
      };
    return await s3Client.createPresignedPost(params);
}
  
export default generateUploadUrl;