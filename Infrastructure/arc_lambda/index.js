const { readFileSync, createWriteStream, existsSync,mkdirSync,statSync } = require("fs");
const { randomUUID } = require("crypto");
const { DateTime } = require('luxon');
const AdmZip = require('adm-zip');
const AWS = require("aws-sdk");

const INFECTED_FILE_PREFIX = 'BROKEN';
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET; // || 'fapi7b-dev-ccbc-data';
const s3 = new AWS.S3();

exports.handler = async(event, context, callback) => {
  const message = event.Records[0].Sns.Message;
  console.log('Message received from SNS:', message);
  const list = JSON.parse(message);
  const key = event.Records[0].Sns.Subject || randomUUID();
  const currentDate = DateTime.now().toFormat('yyyyMMdd');
  const fileName = `CCBC_applications_${currentDate}.zip`;

  if (list && Array.isArray(list)) {  
    if (!existsSync('/tmp')){
      mkdirSync('/tmp');
  }
    const output = createWriteStream(`/tmp/${fileName}`, { flags: 'w' });  
    const archive = new AdmZip();
    output.on("close", () => {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
    });
    output.on("finish", () => { 
      console.log('output stream finished.');
    });
    output.on('end', function() {
      console.log('Data has been drained');
    });
    
    for (const record of list) {
      // each record: { path, name, uuid }
      if (record.name.indexOf(INFECTED_FILE_PREFIX) > -1) {
        archive.append('', {
          name: `${INFECTED_FILE_PREFIX}_${record.path}`,
        });
      }
      else {
        const objectSrc = await s3.getObject({
            Bucket: AWS_S3_BUCKET,  
            Key: record.uuid
          }).promise();

        archive.addFile(record.path, objectSrc.Body);
      }
    }
    archive.writeZip(`/tmp/${fileName}`);
    const stats = statSync(`/tmp/${fileName}`);
    const fileSizeInBytes = stats.size;
    const blob = readFileSync(`/tmp/${fileName}`);
    var params = {
      Bucket: AWS_S3_BUCKET,  
      Key:  key,
      Body: blob
    };
    await uploadFileToS3(params); 
    console.log(`uploaded ${key} to s3, size on disk: ${fileSizeInBytes}, blob size ${blob.length}`);
    return {key};
  }
  return;
};

async function uploadFileToS3(params)
{
    try {
      await s3.upload({
        Bucket: params.Bucket,
        Key: params.Key,
        Body: params.Body,
      }).promise();
    }
    catch (ex) {
        console.error(ex);
    }	
    return;
}
