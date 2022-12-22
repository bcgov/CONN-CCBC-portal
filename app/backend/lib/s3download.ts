import { Router } from 'express';
import config from '../../config';
import getAuthRole from '../../utils/getAuthRole';
import s3Client from './s3client';

const AWS_S3_BUCKET = config.get('AWS_S3_BUCKET');

const s3download = Router();
const detectInfected = async (uuid: string) => {
  const params = {
    Bucket: AWS_S3_BUCKET,
    Key: uuid,
  };
  const getTags = await s3Client.getObjectTagging(params).promise();
  console.log(getTags);
  //return getTags;
  return {TagSet:[{Key:'av_status', Value: 'dirty'}]};

};

s3download.get('/api/s3/download/:uuid/:fileName', async(req, res) => {
  const { uuid, fileName } = req.params;

  const authRole = getAuthRole(req);
  const isRoleAuthorized =
    authRole?.pgRole === 'ccbc_admin' ||
    authRole?.pgRole === 'ccbc_analyst' ||
    authRole?.pgRole === 'ccbc_auth_user';

  if (!isRoleAuthorized || !uuid || !fileName) {
    return res.status(404).end();
  }
  // first check AV tag
  const healthCheck = await detectInfected(uuid);
  const suspect = healthCheck.TagSet.find((x) => x.Key === 'av_status');
  if (suspect?.Value === 'dirty') {
    res.json({avstatus:'dirty'});
  }
  else {
    const signedUrl = s3Client.getSignedUrlPromise('getObject', {
      Bucket: AWS_S3_BUCKET,
      Key: uuid,
      Expires: 60,
      ResponseContentDisposition: `attachment; filename="${fileName}"`,
    });
  
    return signedUrl
      .then((url) => {
        res.json(url);
      })
      .catch(() => {
        res.status(500).end();
      });
  }
});

export default s3download;
