const { readFileSync, createWriteStream, existsSync,mkdirSync,statSync } = require("fs");
const { DateTime } = require('luxon');
const AdmZip = require('adm-zip');
const AWS = require("aws-sdk");

const INFECTED_FILE_PREFIX = 'BROKEN';
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET; // || 'fapi7b-dev-ccbc-data';
const s3 = new AWS.S3();

exports.handler = async(event, context, callback) => {
  if (!event.Records) {
    console.log("Not an S3 event invocation!");
    return;
  }
  const record = event.Records[0];
  if (record.s3.object.key.indexOf('Intake_')>-1) {
    const s3Object = await s3
    .getObject({
      Bucket: record.s3.bucket.name,
      Key: record.s3.object.key
    })
    .promise();
    const message = s3Object.Body
    console.log(`Got list of attachments from S3; file size: ${message.length}`);
    const list = JSON.parse(message);
    const key = record.s3.object.key.replace('.json','.zip');
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
        // each record: { name, uuid }
        if (record.name.indexOf(INFECTED_FILE_PREFIX) > -1) {
          archive.addFile(`${INFECTED_FILE_PREFIX}_${record.name}`, '');
        }
        else {
          const objectSrc = await s3.getObject({
              Bucket: AWS_S3_BUCKET,  
              Key: record.uuid
            }).promise();
          console.log(`downloaded ${record.name} from s3, key: ${record.uuid}`);
          archive.addFile(record.name, objectSrc.Body);
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
