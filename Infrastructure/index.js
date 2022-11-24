const { execSync } = require("child_process");
const { writeFileSync, readFileSync, unlinkSync, existsSync, mkdirSync } = require("fs");
const AWS = require("aws-sdk");

const s3 = new AWS.S3();

exports.handler = async (event) => {
  if (!event.Records) {
    console.log("Not an S3 event invocation!");
    return;
  }
  await getDefinitions();
  for (const record of event.Records) {
    if (!record.s3) {
      console.log("Not an S3 Record!");
      continue;
    }

    // get the file
    const s3Object = await s3
      .getObject({
        Bucket: record.s3.bucket.name,
        Key: record.s3.object.key
      })
      .promise();

    // write file to disk
    writeFileSync(`/tmp/${record.s3.object.key}`, s3Object.Body);
    
    try {  
      // scan it
      console.log(`ready to run clamscan --database=/tmp/clamav /tmp/${record.s3.object.key}`);
      execSync(`LD_LIBRARY_PATH=/opt/lib clamscan -v --database=/tmp/clamav /tmp/${record.s3.object.key}`,{stdio: 'inherit'});

      await s3
        .putObjectTagging({
          Bucket: record.s3.bucket.name,
          Key: record.s3.object.key,
          Tagging: {
            TagSet: [
              {
                Key: 'av-status',
                Value: 'clean'
              }
            ]
          }
        })
        .promise()
        .then(()=>{
          
        console.log(`${record.s3.object.key} scanned`);
        });
    } catch(err) {
      console.log("---- got error ---");
      console.log(err);
      if (err.status === 1) {
        // tag as dirty, OR you can delete it
        await s3
          .putObjectTagging({
            Bucket: record.s3.bucket.name,
            Key: record.s3.object.key,
            Tagging: {
              TagSet: [
                {
                  Key: 'av-status',
                  Value: 'dirty'
                }
              ]
            }
          })
          .promise();
      }
    }

    // delete the temp file
    unlinkSync(`/tmp/${record.s3.object.key}`);
  }
};
async function getDefinitions(){
  var files=['bytecode.cvd','daily.cvd','freshclam.dat','main.cvd'];
  if (!existsSync('/tmp/clamav')){
    mkdirSync('/tmp/clamav');
    console.log(`created /tmp/clamav folder`);
  }
  await Promise.all(files.map(async (x) => {
    var params = {
      Bucket: process.env.AV_DEFINITION_S3_BUCKET,  
      Key:  x
    };
    var fileData = await fetchDataFromS3(params);
    writeFileSync(`/tmp/clamav/${x}`, fileData.Body);
    console.log(`saved ${x}`);
  }));
  console.log(`got all definition files`);
}

async function fetchDataFromS3(params)
{
    try {
        return  s3.getObject(params).promise();
    }
    catch (ex) {
        console.error(ex);
    }	
    return;
}

async function updateDefinitions(){
  var files=['bytecode.cvd','daily.cvd','freshclam.dat','main.cvd'];

  await Promise.all(files.map(async (x) => {
    const blob = readFileSync(`/tmp/clamav/${x}`);
    var params = {
      Bucket: process.env.AV_DEFINITION_S3_BUCKET,  
      Key:  x,
      Body: blob
    };
     await uploadFileToS3(params); 
    console.log(`uploaded ${x} to s3`);
  }));
  console.log(`got all definition files`);
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

exports.updateDb = async (event, context) => {
  if (!existsSync('/tmp/clamav')){
    mkdirSync('/tmp/clamav');
    console.log(`created /tmp/clamav folder`);
  }
  
  try { 
    // update db
    execSync('freshclam --config-file=/opt/bin/freshclam.conf --datadir=/tmp/clamav',{stdio: 'inherit'}); 
    await updateDefinitions();

  } catch(err) {
    console.log(err);
  }
};