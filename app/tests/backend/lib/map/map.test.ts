/**
 * @jest-environment node
 */
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { mocked } from 'jest-mock';
import { getByteArrayFromS3 } from 'backend/lib/s3client';
import path from 'path';
import fs from 'fs';
import { performQuery } from '../../../../backend/lib/graphql';
import getAuthRole from '../../../../utils/getAuthRole';

import {
  parseKMZ,
  parseKMLFromBuffer,
} from '../../../../backend/lib/map/utils';
import map from '../../../../backend/lib/map/map';
import { fakeParsedKML } from './fakeData';

jest.mock('../../../../backend/lib/map/utils');
jest.mock('../../../../backend/lib/graphql');
jest.mock('../../../../backend/lib/s3client');
jest.mock('../../../../utils/getAuthRole');

const queryResult = {
  data: {
    applicationByRowId: {
      applicationRfiDataByApplicationId: {
        nodes: [
          {
            rfiDataByRfiDataId: {
              jsonData: {
                rfiType: ['Missing files or information', 'Technical'],
                rfiDueBy: '2024-04-22',
                rfiAdditionalFiles: {
                  geographicCoverageMap: [
                    {
                      id: 3198,
                      name: 'OTHER.kmz',
                      size: 91873,
                      type: 'application/vnd.google-earth.kmz',
                      uuid: '0d806c15-7b64-4a87-ffff-ffffffffff',
                      uploadedAt: '2024-04-11T13:15:55.586-07:00',
                    },
                    {
                      id: 3229,
                      name: 'My ISED Coverage.KMZ',
                      size: 98297,
                      type: 'application/vnd.google-earth.kmz',
                      uuid: '87130d7c-3f73-49c7-fffff-ffffffffff',
                      uploadedAt: '2024-04-18T11:45:32.209-07:00',
                    },
                  ],
                  geographicCoverageMapRfi: true,

                  otherSupportingMaterialsRfi: true,

                  coverageAssessmentStatisticsRfi: true,

                  supportingConnectivityEvidenceRfi: true,
                  eligibilityAndImpactsCalculatorRfi: true,
                },
              },
              rfiNumber: 'CCBC-010001-1',
            },
          },
          {
            rfiDataByRfiDataId: {
              jsonData: {
                rfiType: ['Missing files or information'],
                rfiDueBy: '2024-05-24',
                rfiAdditionalFiles: {
                  currentNetworkInfastructure: [
                    {
                      id: 3277,
                      name: 'CURR.kmz',
                      size: 207349,
                      type: 'application/vnd.google-earth.kmz',
                      uuid: 'ac0a9d4b-0d12-4828-ffff-ffffffff',
                      uploadedAt: '2024-05-15T15:17:14.198-07:00',
                    },
                  ],
                  otherSupportingMaterialsRfi: true,
                  currentNetworkInfastructureRfi: true,
                },
              },
              rfiNumber: 'CCBC-010001-2',
            },
          },
        ],
      },
      formData: {
        jsonData: {
          coverage: {
            geographicCoverageMap: [
              {
                id: 3133,
                name: 'GEO.kmz',
                size: 91873,
                type: 'application/vnd.google-earth.kmz',
                uuid: '59d30e66-0bb9-4ca8-ffff-ffffffffff',
                uploadedAt: '2024-03-14T13:24:48.939-07:00',
              },
            ],
            currentNetworkInfastructure: [
              {
                id: 3135,
                name: 'CURR.kmz',
                size: 91873,
                type: 'application/vnd.google-earth.kmz',
                uuid: '69271059-9070-42fe-ffff-ffffffffff',
                uploadedAt: '2024-03-14T13:24:57.995-07:00',
              },
            ],
            upgradedNetworkInfrastructure: [
              {
                id: 3134,
                name: 'UPGRADED.kmz',
                size: 91873,
                type: 'application/vnd.google-earth.kmz',
                uuid: '69271059-9070-42fe-ffff-ffffffffff',
                uploadedAt: '2024-03-14T13:24:57.995-07:00',
              },
            ],
          },
        },
      },
      projectInformationDataByApplicationId: {
        nodes: [
          {
            jsonData: {
              finalizedMapUpload: [
                {
                  id: 3275,
                  name: 'FINAL.kmz',
                  size: 229428,
                  type: 'application/vnd.google-earth.kmz',
                  uuid: 'eb10e2bb-ba03-ffff-ffffffffffff',
                  uploadedAt: '2024-05-13T09:16:33.980-07:00',
                },
              ],
              dateFundingAgreementSigned: '2024-01-01',
              hasFundingAgreementBeenSigned: true,
            },
            updatedAt: '2024-06-10T15:03:59.543813+00:00',
          },
        ],
      },
      status: 'applicant_conditionally_approved',
    },
  },
};

describe('The Map API', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());
    app.use('/', map);

    mocked(parseKMZ).mockImplementation(async () => {
      return {
        fakeParsedKML,
      };
    });

    mocked(parseKMLFromBuffer).mockImplementation(async () => {
      return {
        fakeParsedKML,
      };
    });

    mocked(getByteArrayFromS3).mockImplementation(async () => {
      const filePath = path.resolve(__dirname, 'testKML.kml'); // Adjust path if needed
      const fileContent = fs.readFileSync(filePath);

      // Mock the function to return the file content
      return fileContent;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('processes query result with all kmz and sends response', async () => {
    mocked(performQuery).mockImplementation(async () => {
      return queryResult;
    });

    const response = await request(app).get('/api/map/1');

    expect(response.status).toBe(200);
  });

  it('processes query result with all kml and sends response', async () => {
    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          ...queryResult.data,
          applicationByRowId: {
            ...queryResult.data.applicationByRowId,
            applicationRfiDataByApplicationId: {
              ...queryResult.data.applicationByRowId
                .applicationRfiDataByApplicationId,
              nodes: [
                {
                  rfiDataByRfiDataId: {
                    jsonData: {
                      rfiType: ['Missing files or information', 'Technical'],
                      rfiDueBy: '2024-04-22',
                      rfiAdditionalFiles: {
                        geographicCoverageMap: [
                          {
                            id: 3198,
                            name: 'OTHER.kml',
                            size: 91873,
                            type: 'application/vnd.google-earth.kml',
                            uuid: '0d806c15-7b64-4a87-ffff-ffffffffff',
                            uploadedAt: '2024-04-11T13:15:55.586-07:00',
                          },
                          {
                            id: 3229,
                            name: 'My ISED Coverage.KML',
                            size: 98297,
                            type: 'application/vnd.google-earth.kml',
                            uuid: '87130d7c-3f73-49c7-fffff-ffffffffff',
                            uploadedAt: '2024-04-18T11:45:32.209-07:00',
                          },
                        ],
                        geographicCoverageMapRfi: true,

                        otherSupportingMaterialsRfi: true,

                        coverageAssessmentStatisticsRfi: true,

                        supportingConnectivityEvidenceRfi: true,
                        eligibilityAndImpactsCalculatorRfi: true,
                      },
                    },
                    rfiNumber: 'CCBC-010001-1',
                  },
                },
                {
                  rfiDataByRfiDataId: {
                    jsonData: {
                      rfiType: ['Missing files or information'],
                      rfiDueBy: '2024-05-24',
                      rfiAdditionalFiles: {
                        currentNetworkInfastructure: [
                          {
                            id: 3277,
                            name: 'CURR.kml',
                            size: 207349,
                            type: 'application/vnd.google-earth.kml',
                            uuid: 'ac0a9d4b-0d12-4828-ffff-ffffffff',
                            uploadedAt: '2024-05-15T15:17:14.198-07',
                          },
                        ],
                        otherSupportingMaterialsRfi: true,
                        currentNetworkInfastructureRfi: true,
                      },
                    },
                    rfiNumber: 'CCBC-010001-2',
                  },
                },
              ],
            },
          },
        },
      };
    });

    const response = await request(app).get('/api/map/1');

    expect(response.status).toBe(200);
  });

  it('processes query result when no files match', async () => {
    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          applicationByRowId: {
            ...queryResult.data.applicationByRowId,
            applicationMapDataByApplicationId: {
              nodes: [
                {
                  files: {},
                  mapData: {},
                  errors: {},
                  rowId: 1,
                },
              ],
            },
          },
        },
      };
    });

    const response = await request(app).get('/api/map/1');

    expect(response.status).toBe(200);
  });

  it('processes query result when files match', async () => {
    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          applicationByRowId: {
            ...queryResult.data.applicationByRowId,
            applicationMapDataByApplicationId: {
              nodes: [
                {
                  files: {
                    geographicCoverageMap: [
                      {
                        id: 3198,
                        name: 'OTHER.kmz',
                        size: 91873,
                        type: 'application/vnd.google-earth.kmz',
                        uuid: '0d806c15-7b64-4a87-ffff-ffffffffff',
                        uploadedAt: '2024-04-11T13:15:55.586-07:00',
                        source: 'CCBC-010001-1',
                      },
                      {
                        id: 3229,
                        name: 'My ISED Coverage.KMZ',
                        size: 98297,
                        type: 'application/vnd.google-earth.kmz',
                        uuid: '87130d7c-3f73-49c7-fffff-ffffffffff',
                        uploadedAt: '2024-04-18T11:45:32.209-07:00',
                        source: 'CCBC-010001-1',
                      },
                    ],
                    currentNetworkInfrastructure: [
                      {
                        uuid: '69271059-9070-42fe-ffff-ffffffffff',
                        fileName: 'CURR.kmz',
                        source: 'Application',
                      },
                    ],
                    upgradedNetworkInfrastructure: [
                      {
                        uuid: '69271059-9070-42fe-ffff-ffffffffff',
                        fileName: 'UPGRADED.kmz',
                        source: 'Application',
                      },
                    ],
                    finalizedMapUpload: [
                      {
                        id: 3275,
                        name: 'FINAL.kmz',
                        size: 229428,
                        type: 'application/vnd.google-earth.kmz',
                        uuid: 'eb10e2bb-ba03-ffff-ffffffffffff',
                        uploadedAt: '2024-05-13T09:16:33.980-07:00',
                        source: 'SOW',
                      },
                    ],
                  },
                  mapData: {},
                  errors: {},
                  rowId: 1,
                },
              ],
            },
          },
        },
      };
    });

    const response = await request(app).get('/api/map/1');

    expect(response.status).toBe(200);
  });

  it('processes query result when kmz throws error', async () => {
    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          applicationByRowId: {
            ...queryResult.data.applicationByRowId,
            applicationMapDataByApplicationId: {
              nodes: [
                {
                  files: {},
                  mapData: {},
                  errors: {},
                  rowId: 1,
                },
              ],
            },
          },
        },
      };
    });

    mocked(parseKMZ).mockImplementation(async () => {
      throw new Error('Error parsing KMZ');
    });

    const response = await request(app).get('/api/map/1');

    expect(response.status).toBe(200);
  });

  it('processes query result with all kml but kml sends error', async () => {
    mocked(performQuery).mockImplementation(async () => {
      return {
        data: {
          ...queryResult.data,
          applicationByRowId: {
            ...queryResult.data.applicationByRowId,
            applicationRfiDataByApplicationId: {
              ...queryResult.data.applicationByRowId
                .applicationRfiDataByApplicationId,
              nodes: [
                {
                  rfiDataByRfiDataId: {
                    jsonData: {
                      rfiType: ['Missing files or information', 'Technical'],
                      rfiDueBy: '2024-04-22',
                      rfiAdditionalFiles: {
                        geographicCoverageMap: [
                          {
                            id: 3198,
                            name: 'OTHER.kml',
                            size: 91873,
                            type: 'application/vnd.google-earth.kml',
                            uuid: '0d806c15-7b64-4a87-ffff-ffffffffff',
                            uploadedAt: '2024-04-11T13:15:55.586-07:00',
                          },
                          {
                            id: 3229,
                            name: 'My ISED Coverage.KML',
                            size: 98297,
                            type: 'application/vnd.google-earth.kml',
                            uuid: '87130d7c-3f73-49c7-fffff-ffffffffff',
                            uploadedAt: '2024-04-18T11:45:32.209-07:00',
                          },
                        ],
                        geographicCoverageMapRfi: true,

                        otherSupportingMaterialsRfi: true,

                        coverageAssessmentStatisticsRfi: true,

                        supportingConnectivityEvidenceRfi: true,
                        eligibilityAndImpactsCalculatorRfi: true,
                      },
                    },
                    rfiNumber: 'CCBC-010001-1',
                  },
                },
                {
                  rfiDataByRfiDataId: {
                    jsonData: {
                      rfiType: ['Missing files or information'],
                      rfiDueBy: '2024-05-24',
                      rfiAdditionalFiles: {
                        currentNetworkInfastructure: [
                          {
                            id: 3277,
                            name: 'CURR.kml',
                            size: 207349,
                            type: 'application/vnd.google-earth.kml',
                            uuid: 'ac0a9d4b-0d12-4828-ffff-ffffffff',
                            uploadedAt: '2024-05-15T15:17:14.198-07',
                          },
                        ],
                        otherSupportingMaterialsRfi: true,
                        currentNetworkInfastructureRfi: true,
                      },
                    },
                    rfiNumber: 'CCBC-010001-2',
                  },
                },
              ],
            },
          },
        },
      };
    });

    mocked(parseKMLFromBuffer).mockImplementation(async () => {
      throw new Error('Error parsing KML');
    });

    const response = await request(app).get('/api/map/1');

    expect(response.status).toBe(200);
  });

  it('should return 404 if the user is not authorized', async () => {
    (getAuthRole as jest.Mock).mockReturnValue({ pgRole: 'user' });

    const response = await request(app).get('/api/all/map');

    expect(response.status).toBe(404);
  });

  it('should return an array of objects with rowId and responseCode', async () => {
    (getAuthRole as jest.Mock).mockReturnValue({ pgRole: 'ccbc_admin' });

    (performQuery as jest.Mock).mockResolvedValue({
      data: {
        allApplications: {
          nodes: [
            { rowId: 1, ccbcNumber: 'CCBC-001' },
            { rowId: 2, ccbcNumber: 'CCBC-002' },
          ],
        },
      },
    });

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 200 });

    const response = await request(app).get('/api/all/map');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { rowId: 1, responseCode: 200 },
      { rowId: 2, responseCode: 200 },
    ]);
  });

  it('should handle errors and return 500 if fetch fails', async () => {
    (getAuthRole as jest.Mock).mockReturnValue({ pgRole: 'ccbc_admin' });

    (performQuery as jest.Mock).mockResolvedValue({
      data: {
        allApplications: {
          nodes: [
            { rowId: 1, ccbcNumber: 'CCBC-001' },
            { rowId: 2, ccbcNumber: 'CCBC-002' },
          ],
        },
      },
    });

    global.fetch = jest.fn().mockRejectedValue(new Error('Fetch failed'));

    const response = await request(app).get('/api/all/map');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { rowId: 1, responseCode: 500 },
      { rowId: 2, responseCode: 500 },
    ]);
  });
});
