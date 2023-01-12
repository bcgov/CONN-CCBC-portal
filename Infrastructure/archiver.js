const { execSync } = require("child_process");
const { writeFileSync, readFileSync, unlinkSync, existsSync, mkdirSync } = require("fs");
const { randomUUID } = require("crypto");
const { archiver } = require('archiver');
const AWS = require("aws-sdk");

const INFECTED_FILE_PREFIX = 'BROKEN';
const s3 = new AWS.S3();

exports.handler = async(event, context, callback) => {
  const message = event.Records[0].Sns.Message;
  console.log('Message received from SNS:', message);
  const list = JSON.parse(message);
  const key = randomUUID();
  const currentDate = DateTime.now().toFormat('yyyyMMdd');
  const fileName = `CCBC applications ${currentDate}.zip`;

  if (list && Array.isArray(list)) {  
    const output = fs.createWriteStream(`/tmp/${fileName}`);  
    const archive = archiver('zip', { zlib: { level: 0 } });
    archive.pipe(output);
    for (const record of list) {
      // each record: { path, name, uuid }
      if (record.name.indexOf(INFECTED_FILE_PREFIX) > -1) {
        archive.append('', {
          name: `${INFECTED_FILE_PREFIX}_${path}`,
        });
      }
      else {
        const objectSrc = s3Client
          .getObject({
            Bucket: process.env.AWS_S3_BUCKET,  
            Key: record.uuid
          })
          .createReadStream();
  
        archive.append(objectSrc, {
          name: record.path,
        });
      }
    };
    archive.finalize();
    const blob = readFileSync(`/tmp/${fileName}`);
    var params = {
      Bucket: process.env.AWS_S3_BUCKET,  
      Key:  key,
      Body: blob
    };
    await uploadFileToS3(params); 
    console.log(`uploaded ${key} to s3`);
    return {key};
  };
  return;
}

async function uploadFileToS3(params)
{
    try {
      await s3.upload({
        Bucket: params.Bucket,
        Key: params.Key,
        Body: params.Body,
      }).promise()
    }
    catch (ex) {
        console.error(ex);
    }	
    return;
}
