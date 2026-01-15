import { Router } from 'express';
import RateLimit from 'express-rate-limit';
import getAuthRole from '../../../utils/getAuthRole';
import { getByteArrayFromS3 } from '../s3client';
import { parseKMLFromBuffer, parseKMZ } from './utils';
import { performQuery } from '../graphql';
import { reportServerError } from '../emails/errorNotification';

type RfiFile = {
  id: number;
  name: string;
  size: number;
  type: string;
  uuid: string;
  uploadedAt: string;
  rfiNumber: string;
};

type RfiAdditionalFiles = {
  geographicCoverageMap?: RfiFile[];
  currentNetworkInfastructure?: RfiFile[];
  upgradedNetworkInfrastructure?: RfiFile[];
};

type RfiData = {
  rfiDataByRfiDataId: {
    jsonData: {
      rfiAdditionalFiles: RfiAdditionalFiles;
    };
    rfiNumber: string;
  };
};

const map = Router();

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 2000,
});

const getAppDataQuery = `
query getAppDataQuery($rowId: Int!) {
  applicationByRowId(rowId: $rowId) {
    applicationRfiDataByApplicationId(
      filter: {
        and: [
          {
            or: [
              {
                rfiDataByRfiDataId: {
                  jsonData: {
                    contains: {
                      rfiAdditionalFiles: { geographicCoverageMap: [] }
                    }
                  }
                }
              }
              {
                rfiDataByRfiDataId: {
                  jsonData: {
                    contains: {
                      rfiAdditionalFiles: { upgradedNetworkInfrastructure: [] }
                    }
                  }
                }
              }
              {
                rfiDataByRfiDataId: {
                  jsonData: {
                    contains: {
                      rfiAdditionalFiles: { currentNetworkInfastructure: [] }
                    }
                  }
                }
              }
            ]
          }
        ]
        rfiDataByRfiDataId: { archivedAt: { isNull: true } }
      }
    ) {
      nodes {
        rfiDataByRfiDataId {
          jsonData
          rfiNumber
        }
      }
    }
    formData {
      jsonData
    }
    projectInformationDataByApplicationId(
      filter: { jsonData: { contains: { finalizedMapUpload: [] } }, archivedAt: {isNull: true} }
      orderBy: UPDATED_AT_DESC
      first: 1
    ) {
      nodes {
        jsonData
        updatedAt
      }
    }
    changeRequestDataByApplicationId(
      filter: { jsonData: { contains: { updatedMapUpload: [] } }, archivedAt: {isNull: true} }
      orderBy: AMENDMENT_NUMBER_DESC
    ) {
      nodes {
        amendmentNumber
        jsonData
        updatedAt
      }
    }
    applicationMapDataByApplicationId(last: 1) {
      nodes {
        files
        mapData
        errors
        rowId
      }
    }
    status
  }
}
`;

const createAppMapDataMutation = `
mutation createAppMapDataMutation($input: CreateApplicationMapDataInput!) {
  createApplicationMapData(input: $input) {
    clientMutationId
  }
}
`;

const updateMapDataMutation = `
mutation updateMapDataMutation($input: UpdateApplicationMapDataByRowIdInput!) {
  updateApplicationMapDataByRowId(input: $input) {
    clientMutationId
  }
}
`;

const allApplicationsQuery = `
  query allApplicationsQuery {
    allApplications(
      filter: { archivedAt: { isNull: true }, ccbcNumber: { isNull: false } }
    ) {
      nodes {
        rowId
        ccbcNumber
      }
      totalCount
    }
  }
`;

const extractAllRfiFiles = (data: RfiData[]): Record<string, RfiFile[]> => {
  const result: Record<string, RfiFile[]> = {
    geographicCoverageMap: [],
    currentNetworkInfrastructure: [],
    upgradedNetworkInfrastructure: [],
  };

  data.forEach((item) => {
    const additionalFiles =
      item?.rfiDataByRfiDataId?.jsonData?.rfiAdditionalFiles;
    const rfiNumber = item?.rfiDataByRfiDataId?.rfiNumber;

    const updateFiles = (key: keyof typeof result) => {
      const files = additionalFiles?.[key];
      if (files && files.length > 0) {
        result[key] = result[key].concat(
          files.map((file) => ({ ...file, source: `RFI: ${rfiNumber}` }))
        );
      }
    };

    updateFiles('geographicCoverageMap');
    updateFiles('currentNetworkInfrastructure');
    updateFiles('upgradedNetworkInfrastructure');
  });

  return result;
};

const extractFinalizedMapUploads = (
  projectInformationData,
  changeRequestData
) => {
  const mapUploads = [];
  // Amendment uploads
  changeRequestData?.nodes?.forEach((changeRequest) => {
    const updatedUploads = changeRequest?.jsonData?.updatedMapUpload || [];
    updatedUploads.forEach((file) => {
      mapUploads.push({
        ...file,
        source: `Amendment #${changeRequest.amendmentNumber}`,
      });
    });
  });
  // Original SOW uploads
  const finalizedUploads =
    projectInformationData?.nodes?.[0]?.jsonData?.finalizedMapUpload || [];
  finalizedUploads.forEach((file) => {
    mapUploads.push({
      ...file,
      source: 'Original SOW',
    });
  });
  return mapUploads;
};

const handleQueryResult = (
  rfiData,
  formData,
  projectInformationData,
  changeRequestData
) => {
  const geographicCoverageMap = [];
  const currentNetworkInfrastructure = [];
  const upgradedNetworkInfrastructure = [];
  const finalizedMapUpload = extractFinalizedMapUploads(
    projectInformationData,
    changeRequestData
  );

  const formMapFiles = {
    geographicCoverageMap: [],
    currentNetworkInfrastructure: [],
    upgradedNetworkInfrastructure: [],
  };
  let rfiMapFiles = null;
  if (formData) {
    const coverage = formData?.jsonData?.coverage;
    if (coverage?.geographicCoverageMap) {
      formMapFiles.geographicCoverageMap.push({
        uuid: coverage?.geographicCoverageMap?.[0]?.uuid,
        fileName: coverage?.geographicCoverageMap?.[0]?.name,
        source: 'Application',
      });
    }
    // typo is part of existing data/schema
    if (coverage?.currentNetworkInfastructure) {
      formMapFiles.currentNetworkInfrastructure.push({
        uuid: coverage?.currentNetworkInfastructure?.[0]?.uuid,
        fileName: coverage?.currentNetworkInfastructure?.[0]?.name,
        source: 'Application',
      });
    }
    if (coverage?.upgradedNetworkInfrastructure) {
      formMapFiles.upgradedNetworkInfrastructure.push({
        uuid: coverage?.upgradedNetworkInfrastructure?.[0]?.uuid,
        fileName: coverage?.upgradedNetworkInfrastructure?.[0]?.name,
        source: 'Application',
      });
    }
  }
  if (rfiData && rfiData?.nodes?.length > 0) {
    rfiMapFiles = extractAllRfiFiles(rfiData.nodes);
  }

  // return both RFI and Application files
  geographicCoverageMap.push(
    ...(rfiMapFiles?.geographicCoverageMap || []),
    ...(formMapFiles.geographicCoverageMap || [])
  );

  currentNetworkInfrastructure.push(
    ...(rfiMapFiles?.currentNetworkInfrastructure || []),
    ...(formMapFiles.currentNetworkInfrastructure || [])
  );

  upgradedNetworkInfrastructure.push(
    ...(rfiMapFiles?.upgradedNetworkInfrastructure || []),
    ...(formMapFiles.upgradedNetworkInfrastructure || [])
  );

  return {
    geographicCoverageMap,
    currentNetworkInfrastructure,
    upgradedNetworkInfrastructure,
    finalizedMapUpload,
  };
};

// eslint-disable-next-line consistent-return
map.get('/api/map/:id', limiter, async (req, res) => {
  const { id } = req.params;
  const applicationId = parseInt(id, 10);
  let files;
  let exists = false;
  let mapDataRowId;
  if (!applicationId) {
    return res.status(400).end();
  }
  try {
    const force = req?.query?.force === 'true';
    const queryResult = await performQuery(
      getAppDataQuery,
      { rowId: applicationId },
      req
    );

    const {
      applicationRfiDataByApplicationId,
      formData,
      projectInformationDataByApplicationId,
      applicationMapDataByApplicationId,
      changeRequestDataByApplicationId,
    } = queryResult.data.applicationByRowId;

    files = handleQueryResult(
      applicationRfiDataByApplicationId,
      formData,
      projectInformationDataByApplicationId,
      changeRequestDataByApplicationId
    );

    // check if there is any data for application map data
    if (
      applicationMapDataByApplicationId?.nodes?.length > 0 ||
      applicationMapDataByApplicationId?.nodes?.errors != null
    ) {
      exists = true;
      mapDataRowId = applicationMapDataByApplicationId.nodes[0].rowId;
      // there is data, check if the files are the same
      if (!force) {
        const { files: filesData } = applicationMapDataByApplicationId.nodes[0];
        const { mapData, errors } = applicationMapDataByApplicationId.nodes[0];
        // compare filesData against files by uuid
        const filesDataKeys = Object.keys(filesData);
        const filesKeys = Object.keys(files);
        if (filesDataKeys.length === filesKeys.length) {
          const isSame = filesDataKeys.every((key) => {
            const filesDataArray = filesData[key];
            const filesArray = files[key];
            if (filesDataArray.length !== filesArray.length) {
              return false;
            }
            return filesDataArray.every((fileData) => {
              const file = filesArray.find((f) => f.uuid === fileData.uuid);
              if (!file) {
                return false;
              }
              return true;
            });
          });
          if (isSame) {
            return res.send(mapData || errors);
          }
        }
      }
    }

    const response = {
      geographicCoverageMap: [],
      currentNetworkInfrastructure: [],
      upgradedNetworkInfrastructure: [],
      finalizedMapUpload: [],
    };

    const errors = [];
    const processGeographicCoverageMap = files.geographicCoverageMap.map(
      async (geographicCoverageMap) => {
        const fileName =
          geographicCoverageMap?.fileName || geographicCoverageMap?.name;
        if (geographicCoverageMap.uuid && fileName) {
          const geoMapByteArray = await getByteArrayFromS3(
            geographicCoverageMap.uuid
          );
          let data = null;
          try {
            if (fileName.toLowerCase().includes('.kmz')) {
              data = await parseKMZ(
                geoMapByteArray,
                fileName,
                geographicCoverageMap.source
              );
            } else if (fileName.toLowerCase().includes('.kml')) {
              data = await parseKMLFromBuffer(
                geoMapByteArray,
                fileName,
                geographicCoverageMap.source
              );
            }
            response.geographicCoverageMap.push(data);
          } catch (error) {
            reportServerError(error, {
              source: 'map-parse-geographic-coverage',
              metadata: { fileName },
            });
            errors.push({
              file: geographicCoverageMap,
              error: error.message,
            });
          }
        }
      }
    );

    const processFinalizedMapUpload = files.finalizedMapUpload.map(
      async (finalizedMapUpload) => {
        const fileName =
          finalizedMapUpload?.fileName || finalizedMapUpload?.name;
        if (finalizedMapUpload.uuid && fileName) {
          const finalizedMapByteArray = await getByteArrayFromS3(
            finalizedMapUpload.uuid
          );
          let data = null;
          try {
            if (fileName.toLowerCase().includes('.kmz')) {
              data = await parseKMZ(
                finalizedMapByteArray,
                fileName,
                finalizedMapUpload.source
              );
            } else if (fileName.toLowerCase().includes('.kml')) {
              data = await parseKMLFromBuffer(
                finalizedMapByteArray,
                fileName,
                finalizedMapUpload.source
              );
            }
            response.finalizedMapUpload.push(data);
          } catch (error) {
            reportServerError(error, {
              source: 'map-parse-finalized-upload',
              metadata: { fileName },
            });
            errors.push({
              file: finalizedMapUpload,
              error: error.message,
            });
          }
        }
      }
    );

    await Promise.all([
      ...processGeographicCoverageMap,
      ...processFinalizedMapUpload,
    ]);

    // store result for future use
    if (!exists) {
      await performQuery(
        createAppMapDataMutation,
        {
          input: {
            applicationMapData: {
              applicationId,
              files,
              errors,
              mapData: response,
            },
          },
        },
        req
      );
    } else {
      await performQuery(
        updateMapDataMutation,
        {
          input: {
            rowId: mapDataRowId,
            applicationMapDataPatch: {
              applicationId,
              files,
              errors,
              mapData: response,
            },
          },
        },
        req
      );
    }

    res.send(response);
  } catch (error) {
    reportServerError(error, { source: 'map-process', metadata: { exists } }, req);
    if (!exists) {
      await performQuery(
        createAppMapDataMutation,
        {
          input: {
            applicationMapData: {
              applicationId,
              files,
              errors: { errors: error.message },
            },
          },
        },
        req
      );
    } else {
      await performQuery(
        updateMapDataMutation,
        {
          input: {
            rowId: mapDataRowId,
            applicationMapDataPatch: {
              applicationId,
              files,
              errors: { errors: error.message },
            },
          },
        },
        req
      );
    }

    res.status(500).send({ error: error.message });
  }
});

map.get('/api/all/map', limiter, async (req, res) => {
  const authRole = getAuthRole(req);
  const isRoleAuthorized =
    authRole?.pgRole === 'ccbc_admin' || authRole?.pgRole === 'super_admin';
  if (!isRoleAuthorized) {
    return res.status(404).end();
  }

  const force = req?.query?.force === 'true';
  const queryResult = await performQuery(allApplicationsQuery, {}, req);
  const applications = queryResult.data.allApplications.nodes;

  const results = await Promise.all(
    applications.map(async (application) => {
      try {
        const response = await fetch(
          `${req.protocol}://${req.get('host')}/api/map/${application.rowId}?force=${force}`,
          {
            headers: {
              ...(req.headers as any),
              'Content-Type': 'application/json',
            },
          }
        );
        return { rowId: application.rowId, responseCode: response.status };
      } catch (error) {
        reportServerError(
          error,
          {
            source: 'map-fetch-application',
            metadata: { applicationId: application.rowId },
          },
          req
        );
        return {
          rowId: application.rowId,
          responseCode: error.response?.status || 500,
        };
      }
    })
  );

  return res.send(results);
});

export default map;
