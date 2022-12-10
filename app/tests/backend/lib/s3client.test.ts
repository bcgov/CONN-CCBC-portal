/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock'; 
import { admZip} from 'adm-zip';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import { performQuery } from '../../../backend/lib/graphql';
import getAuthRole from '../../../utils/getAuthRole';
import { PassThrough } from 'stream';
 
jest.mock('../../../backend/lib/graphql');
jest.mock('../../../utils/getAuthRole');

const mockStream = new PassThrough();
mockStream.emit('data', 'hello world');
mockStream.end();   
jest.setTimeout(10000000);

const mockObjectTagging =  {
  promise:jest.fn(() => {
    return new Promise((resolve, reject) => {
      return resolve({
        TagSet:[{"Key":"av_status", "Value":"dirty"}],
      });
    });
  }),
  catch: jest.fn(),
};
const mockObject =  { 
  createReadStream: () => {
    return mockStream;
  },
  promise:jest.fn(() => {
    return new Promise((resolve, reject) => {
      return resolve({
        TagSet:[{"Key":"av_status", "Value":"dirty"}],
      });
    });
  }),
  catch: jest.fn(),
};

jest.mock('../../../backend/lib/s3client',()=>{
  return {
    upload: jest.fn().mockReturnThis(), 
    listObjects: jest.fn().mockReturnThis(),
    getObject: ()=>{
      return mockObject;
    },
    getObjectTagging: () => {
      return mockObjectTagging;
    }
  }
});
import s3archive from '../../../backend/lib/s3archive'; 

describe('The s3 archive', () => {
    let app;
  
    beforeEach(async () => {
      app = express();
      app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
      app.use('/', s3archive);
    });
  
    it('should receive the correct response for authorized user', async () => {
      mocked(getAuthRole).mockImplementation(() => {
        return {
          pgRole: 'ccbc_admin',
          landingRoute: '/',
        };
      });
  
      mocked(performQuery).mockImplementation(async () => {
        return {
          data: {
            allApplications: {
              nodes: [
                {
                  formData: {
                    jsonData: {
                        templateUploads: {
                            detailedBudget :[
                                {
                                uuid: 'd56a8477-b4d8-43c7-bd75-75d376ddeca4',
                                name: 'File.pdf',
                                size: 35,
                                type: 'text/plain',
                                },
                            ]
                        }
                    },
                  },
                  ccbcNumber: 'CCBC-100001',
                },
              ],
            },
          },
        };
      });
  
      const response = await request(app).get('/api/analyst/archive');
  
      expect(response.status).toBe(200);

      const body = response.body;
      const buffer = Buffer.from(body.data);
      var zip = new admZip(buffer);
      
      var zipEntries = zip.getEntries(); // an array of ZipEntry records
      
      zipEntries.forEach(function (zipEntry) {
          console.log(zipEntry.toString()); // outputs zip entries information
          expect(zipEntry.entryName.indexOf('_flagged_as_containing_virus')).not.toBe(-1); 
      });
 
    expect(response.headers['content-type']).toBe('application/zip');
  });

  jest.resetAllMocks();
});
