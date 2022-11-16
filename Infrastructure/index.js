const { execSync } = require("child_process");
const { writeFileSync, unlinkSync } = require("fs");
const AWS = require("aws-sdk");

const s3 = new AWS.S3();

exports.handler = async (event) => {
  if (!event.Records) {
    console.log("Not an S3 event invocation!");
    return;
  }

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
      execSync(`clamscan --database=/opt/var/lib/clamav /tmp/${record.s3.object.key}`);

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

exports.updateDb = async (event, context) => {
  
  try { 
    // update db
    execSync('freshclam --config-file=freshclam.conf --datadir=/opt/var/lib/clamav',{stdio: 'inherit'});

  } catch(err) {
    console.log(err);
  }
};