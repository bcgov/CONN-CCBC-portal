/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import express from 'express';
import session from 'express-session';
import request from 'supertest';
import { getByteArrayFromS3 } from 'backend/lib/s3client';
import path from 'path';
import fs from 'fs';
import templateNine from '../../../../backend/lib/excel_import/template_nine';
import { performQuery } from '../../../../backend/lib/graphql';
import getAuthRole from '../../../../utils/getAuthRole';

jest.mock('../../../../utils/getAuthRole');
jest.mock('../../../../backend/lib/graphql');
jest.mock('../../../../backend/lib/s3client');

function FormDataMock() {
  this.append = jest.fn();
}

global.FormData = jest.fn(() => {
  return FormDataMock();
}) as jest.Mock;

jest.setTimeout(10000);

describe('The Community Progress Report import', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
    app.use('/', templateNine);
  });

  it('should receive the correct response for unauthorized user for each endpoint', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_guest',
        landingRoute: '/',
      };
    });

    const all = await request(app).get('/api/template-nine/all');
    expect(all.status).toBe(404);

    const rfiAll = await request(app).get('/api/template-nine/rfi/all');
    expect(rfiAll.status).toBe(404);

    const uuid = await request(app).get('/api/template-nine/1/1234-abcde');
    expect(uuid.status).toBe(404);

    const rfi = await request(app).post(
      '/api/template-nine/rfi/1/CCBC-00001-1'
    );
    expect(rfi.status).toBe(404);

    const application = await request(app).get('/api/template-nine/1');
    expect(application.status).toBe(404);
  });

  it('should process all the past applications template 9 for authorized user', async () => {
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
                applicationFormDataByApplicationId: {
                  nodes: [
                    {
                      formDataByFormDataId: {
                        jsonData: {
                          templateUploads: {
                            detailedBudget: [
                              {
                                id: 999,
                                name: 'Some other non template 9.xlsx',
                                size: 55555,
                                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                uuid: 'c5155b84-ade5-4444-9999-111111',
                              },
                            ],
                            geographicNames: [
                              {
                                id: 888,
                                name: 'template_9-backbone_and_geographic_names.xlsx',
                                size: 77777,
                                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                uuid: '8a7d15e3-3333-1111-5555-4444444',
                              },
                            ],
                          },
                        },
                      },
                    },
                  ],
                },
                rowId: 1,
              },
            ],
          },
          allApplicationFormTemplate9Data: {
            totalCount: 0,
          },
        },
      };
    });

    mocked(getByteArrayFromS3).mockImplementation(async () => {
      const filePath = path.resolve(__dirname, 'template9-complete.xlsx'); // Adjust path if needed
      const fileContent = fs.readFileSync(filePath);

      // Mock the function to return the file content
      return fileContent;
    });

    const all = await request(app).get('/api/template-nine/all');
    expect(all.status).toBe(200);
  });

  it('should process all the rfis that have template 9 for authorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          allApplicationRfiData: {
            nodes: [
              {
                rfiDataByRfiDataId: {
                  jsonData: {
                    rfiType: ['Missing files or information'],
                    rfiDueBy: '2023-02-24',
                    rfiAdditionalFiles: {
                      geographicNames: [
                        {
                          id: 1000,
                          name: 'template_9-backbone_and_geographic_names-rfi.xlsx',
                          size: 9999,
                          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                          uuid: '93f09138-9e69-1238-abc-123456789',
                        },
                      ],
                      geographicNamesRfi: true,
                    },
                  },
                  rfiNumber: 'CCBC-00001-1',
                },
                applicationId: 1,
              },
            ],
          },
          allApplicationFormTemplate9Data: {
            totalCount: 0,
          },
        },
      };
    });

    mocked(getByteArrayFromS3).mockImplementation(async () => {
      const filePath = path.resolve(__dirname, 'template9-complete.xlsx'); // Adjust path if needed
      const fileContent = fs.readFileSync(filePath);

      // Mock the function to return the file content
      return fileContent;
    });

    const all = await request(app).get('/api/template-nine/rfi/all');
    expect(all.status).toBe(200);
  });

  it('should process all the rfis that have template 9 when they exist', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          allApplicationRfiData: {
            nodes: [
              {
                rfiDataByRfiDataId: {
                  jsonData: {
                    rfiType: ['Missing files or information'],
                    rfiDueBy: '2023-02-24',
                    rfiAdditionalFiles: {
                      geographicNames: [
                        {
                          id: 1000,
                          name: 'template_9-backbone_and_geographic_names-rfi.xlsx',
                          size: 9999,
                          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                          uuid: '93f09138-9e69-1238-abc-123456789',
                        },
                      ],
                      geographicNamesRfi: true,
                    },
                  },
                  rfiNumber: 'CCBC-00001-1',
                },
                applicationId: 1,
              },
            ],
          },
          allApplicationFormTemplate9Data: {
            totalCount: 1,
            nodes: [
              {
                rowId: 1,
              },
            ],
          },
        },
      };
    });

    mocked(getByteArrayFromS3).mockImplementation(async () => {
      const filePath = path.resolve(__dirname, 'template9-complete.xlsx'); // Adjust path if needed
      const fileContent = fs.readFileSync(filePath);

      // Mock the function to return the file content
      return fileContent;
    });

    const all = await request(app).get('/api/template-nine/rfi/all');
    expect(all.status).toBe(200);
  });

  it('should return correct responses for different combinations of applicationId and rfiNumber', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    const noParams = await request(app).get('/api/template-nine/1/');
    expect(noParams.status).toBe(404);

    const noSource = await request(app).get('/api/template-nine/1/1234-abcde/');
    expect(noSource.status).toBe(404);

    const wrongSource = await request(app).get(
      '/api/template-nine/1/1234-abcde/test'
    );
    expect(wrongSource.status).toBe(400);

    const noRfiNumber = await request(app).get(
      '/api/template-nine/1/1234-abcde/rfi/'
    );
    expect(noRfiNumber.status).toBe(400);

    const application = await request(app).get(
      '/api/template-nine/1/1234-abcde/application'
    );

    expect(application.status).toBe(200);

    mocked(getByteArrayFromS3).mockImplementation(async () => {
      const filePath = path.resolve(__dirname, 'template9-complete.xlsx'); // Adjust path if needed
      const fileContent = fs.readFileSync(filePath);

      // Mock the function to return the file content
      return fileContent;
    });

    const nonExistingApplication = await request(app).get(
      '/api/template-nine/1/1234-abcde/application'
    );
    expect(nonExistingApplication.status).toBe(200);

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          allApplicationFormTemplate9Data: {
            totalCount: 1,
            nodes: [
              {
                rowId: 1,
              },
            ],
          },
        },
      };
    });

    const existingApplication = await request(app).get(
      '/api/template-nine/1/1234-abcde/application'
    );

    expect(existingApplication.status).toBe(200);
  });

  it('should process the rfi for authorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    const response = await request(app)
      .post('/api/template-nine/rfi/1/CCBC-00001-1')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'form' }))
      .attach('template9', `${__dirname}/template9-complete.xlsx`);

    expect(response.status).toBe(200);
  });

  it('should process the rfi for applicant', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_auth_user',
        landingRoute: '/',
      };
    });

    const response = await request(app)
      .post('/api/template-nine/rfi/applicant/1/CCBC-00001-1')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'form' }))
      .attach('template9', `${__dirname}/template9-complete.xlsx`);

    expect(response.status).toBe(200);
  });

  it('should reject if a guest tries to process applicant rfi endpoint', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_guest',
        landingRoute: '/',
      };
    });

    const response = await request(app).post(
      '/api/template-nine/rfi/applicant/1/CCBC-00001-1'
    );

    expect(response.status).toBe(404);
  });

  it('should return 400 if an applicant tries to process bad file', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_auth_user',
        landingRoute: '/',
      };
    });

    const response = await request(app)
      .post('/api/template-nine/rfi/applicant/1/CCBC-00001-1')
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .field('data', JSON.stringify({ name: 'form' }))
      .attach('template9', null);

    expect(response.status).toBe(400);
  });

  it('should return 400 if an applicant tries to hit endpoint with bad parameters', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_auth_user',
        landingRoute: '/',
      };
    });

    const response = await request(app).post(
      '/api/template-nine/rfi/applicant/null/rfi'
    );

    expect(response.status).toBe(400);
  });

  it('should process rfis when they exist for a specific applicationId', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          applicationByRowId: {
            applicationRfiDataByApplicationId: {
              nodes: [
                {
                  rfiDataByRfiDataId: {
                    jsonData: {
                      rfiType: ['Missing files or information'],
                      rfiDueBy: '2023-02-24',
                      rfiAdditionalFiles: {
                        geographicNames: [
                          {
                            id: 1000,
                            name: 'template_9-backbone_and_geographic_names-rfi.xlsx',
                            size: 9999,
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            uuid: '93f09138-9e69-1238-abc-123456789',
                          },
                        ],
                        geographicNamesRfi: true,
                      },
                    },
                    rfiNumber: 'CCBC-00001-1',
                  },
                  applicationId: 1,
                },
              ],
              totalCount: 1,
            },
          },
          allApplicationFormTemplate9Data: {
            totalCount: 1,
            nodes: [
              {
                rowId: 1,
                source: {
                  uuid: 'fffff-ffff-ffff-ffff',
                },
              },
            ],
          },
        },
      };
    });

    mocked(getByteArrayFromS3).mockImplementation(async () => {
      const filePath = path.resolve(__dirname, 'template9-complete.xlsx'); // Adjust path if needed
      const fileContent = fs.readFileSync(filePath);

      // Mock the function to return the file content
      return fileContent;
    });
    const response = await request(app).post('/api/template-nine/1');

    expect(response.status).toBe(200);
  });

  it('should process rfis when they exist for a specific applicationId and no template 9 data exists', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          applicationByRowId: {
            applicationRfiDataByApplicationId: {
              nodes: [
                {
                  rfiDataByRfiDataId: {
                    jsonData: {
                      rfiType: ['Missing files or information'],
                      rfiDueBy: '2023-02-24',
                      rfiAdditionalFiles: {
                        geographicNames: [
                          {
                            id: 1000,
                            name: 'template_9-backbone_and_geographic_names-rfi.xlsx',
                            size: 9999,
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            uuid: '93f09138-9e69-1238-abc-123456789',
                          },
                        ],
                        geographicNamesRfi: true,
                      },
                    },
                    rfiNumber: 'CCBC-00001-1',
                  },
                  applicationId: 1,
                },
              ],
              totalCount: 1,
            },
          },
          allApplicationFormTemplate9Data: {
            totalCount: 0,
            nodes: [],
          },
        },
      };
    });

    mocked(getByteArrayFromS3).mockImplementation(async () => {
      const filePath = path.resolve(__dirname, 'template9-complete.xlsx'); // Adjust path if needed
      const fileContent = fs.readFileSync(filePath);

      // Mock the function to return the file content
      return fileContent;
    });
    const response = await request(app).post('/api/template-nine/1');

    expect(response.status).toBe(200);
  });

  it('should process application data when no rfi exist for a specific applicationId', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          applicationByRowId: {
            applicationRfiDataByApplicationId: {
              nodes: [],
              totalCount: 0,
            },
            applicationFormDataByApplicationId: {
              nodes: [
                {
                  formDataByFormDataId: {
                    jsonData: {
                      templateUploads: {
                        geographicNames: [
                          {
                            id: 888,
                            name: 'template_9-backbone_and_geographic_names.xlsx',
                            size: 77777,
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            uuid: '8a7d15e3-3333-1111-5555-4444444',
                          },
                        ],
                      },
                    },
                  },
                },
              ],
            },
          },
          allApplicationFormTemplate9Data: {
            totalCount: 1,
            nodes: [
              {
                rowId: 1,
                source: {
                  uuid: 'fffff-ffff-ffff-ffff',
                },
              },
            ],
          },
        },
      };
    });

    mocked(getByteArrayFromS3).mockImplementation(async () => {
      const filePath = path.resolve(__dirname, 'template9-complete.xlsx'); // Adjust path if needed
      const fileContent = fs.readFileSync(filePath);

      // Mock the function to return the file content
      return fileContent;
    });
    const response = await request(app).post('/api/template-nine/1');

    expect(response.status).toBe(200);
  });

  it('should process application data when no rfi exist for a specific applicationId and no template 9 data exists', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          applicationByRowId: {
            applicationRfiDataByApplicationId: {
              nodes: [],
              totalCount: 0,
            },
            applicationFormDataByApplicationId: {
              nodes: [
                {
                  formDataByFormDataId: {
                    jsonData: {
                      templateUploads: {
                        geographicNames: [
                          {
                            id: 888,
                            name: 'template_9-backbone_and_geographic_names.xlsx',
                            size: 77777,
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            uuid: '8a7d15e3-3333-1111-5555-4444444',
                          },
                        ],
                      },
                    },
                  },
                },
              ],
            },
          },
          allApplicationFormTemplate9Data: {
            totalCount: 0,
            nodes: [],
          },
        },
      };
    });

    mocked(getByteArrayFromS3).mockImplementation(async () => {
      const filePath = path.resolve(__dirname, 'template9-complete.xlsx'); // Adjust path if needed
      const fileContent = fs.readFileSync(filePath);

      // Mock the function to return the file content
      return fileContent;
    });
    const response = await request(app).post('/api/template-nine/1');

    expect(response.status).toBe(200);
  });

  it('should properly handle where there is no template 9 on rfi or application', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });

    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          applicationByRowId: {
            applicationRfiDataByApplicationId: {
              nodes: [],
              totalCount: 0,
            },
            applicationFormDataByApplicationId: {
              nodes: [],
            },
          },
          allApplicationFormTemplate9Data: {
            totalCount: 1,
            nodes: [
              {
                rowId: 1,
                source: {
                  uuid: 'fffff-ffff-ffff-ffff',
                },
              },
            ],
          },
        },
      };
    });

    const response = await request(app).post('/api/template-nine/1');

    expect(response.status).toBe(200);
  });
});
