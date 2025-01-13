import { Router } from 'express';
import RateLimit from 'express-rate-limit';
import { getByteArrayFromS3 } from '../s3client';
import { parseKMLFromBuffer, parseKMZ } from './utils';
import { performQuery } from '../graphql';

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
      filter: { jsonData: { contains: { finalizedMapUpload: [] } } }
      orderBy: UPDATED_AT_DESC
      first: 1
    ) {
      nodes {
        jsonData
        updatedAt
      }
    }
    status
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
          files.map((file) => ({ ...file, source: rfiNumber }))
        );
      }
    };

    updateFiles('geographicCoverageMap');
    updateFiles('currentNetworkInfrastructure');
    updateFiles('upgradedNetworkInfrastructure');
  });

  return result;
};

const handleQueryResult = (rfiData, formData, projectInformationData) => {
  const geographicCoverageMap = [];
  const currentNetworkInfrastructure = [];
  const upgradedNetworkInfrastructure = [];
  const finalizedMapUpload = [
    {
      ...projectInformationData?.nodes[0]?.jsonData?.finalizedMapUpload?.[0],
      source: 'SOW',
    },
  ];

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
  if (rfiMapFiles?.geographicCoverageMap.length > 0) {
    geographicCoverageMap.push(...rfiMapFiles.geographicCoverageMap);
  } else {
    geographicCoverageMap.push(...formMapFiles.geographicCoverageMap);
  }
  if (rfiMapFiles?.currentNetworkInfrastructure.length > 0) {
    currentNetworkInfrastructure.push(
      ...rfiMapFiles.currentNetworkInfrastructure
    );
  } else {
    currentNetworkInfrastructure.push(
      ...formMapFiles.currentNetworkInfrastructure
    );
  }
  if (rfiMapFiles?.upgradedNetworkInfrastructure.length > 0) {
    upgradedNetworkInfrastructure.push(
      ...rfiMapFiles.upgradedNetworkInfrastructure
    );
  } else {
    upgradedNetworkInfrastructure.push(
      ...formMapFiles.upgradedNetworkInfrastructure
    );
  }

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
  if (!applicationId) {
    return res.status(400).end();
  }
  const queryResult = await performQuery(
    getAppDataQuery,
    { rowId: applicationId },
    req
  );

  const {
    applicationRfiDataByApplicationId,
    formData,
    projectInformationDataByApplicationId,
  } = queryResult.data.applicationByRowId;

  const files = handleQueryResult(
    applicationRfiDataByApplicationId,
    formData,
    projectInformationDataByApplicationId
  );

  const response = {
    geographicCoverageMap: [],
    currentNetworkInfrastructure: [],
    upgradedNetworkInfrastructure: [],
    finalizedMapUpload: [],
  };
  const processGeographicCoverageMap = files.geographicCoverageMap.map(
    async (geographicCoverageMap) => {
      const fileName =
        geographicCoverageMap?.fileName || geographicCoverageMap?.name;
      if (geographicCoverageMap.uuid && fileName) {
        const geoMapByteArray = await getByteArrayFromS3(
          geographicCoverageMap.uuid
        );
        let data = null;
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
      }
    }
  );

  const processCurrentNetworkInfrastructure =
    files.currentNetworkInfrastructure.map(
      async (currentNetworkInfrastructure) => {
        const fileName =
          currentNetworkInfrastructure?.fileName ||
          currentNetworkInfrastructure?.name;
        if (currentNetworkInfrastructure.uuid && fileName) {
          const currentNetworkByteArray = await getByteArrayFromS3(
            currentNetworkInfrastructure.uuid
          );
          let data = null;
          if (fileName.toLowerCase().includes('.kmz')) {
            data = await parseKMZ(
              currentNetworkByteArray,
              fileName,
              currentNetworkInfrastructure.source
            );
          } else if (fileName.toLowerCase().includes('.kml')) {
            data = await parseKMLFromBuffer(
              currentNetworkByteArray,
              fileName,
              currentNetworkInfrastructure.source
            );
          }
          response.currentNetworkInfrastructure.push(data);
        }
      }
    );

  const processUpgradedNetworkInfrastructure =
    files.upgradedNetworkInfrastructure.map(
      async (upgradedNetworkInfrastructure) => {
        const fileName =
          upgradedNetworkInfrastructure?.fileName ||
          upgradedNetworkInfrastructure?.name;
        if (upgradedNetworkInfrastructure.uuid && fileName) {
          const upgradedNetworkByteArray = await getByteArrayFromS3(
            upgradedNetworkInfrastructure.uuid
          );
          let data = null;
          if (fileName.toLowerCase().includes('.kmz')) {
            data = await parseKMZ(
              upgradedNetworkByteArray,
              fileName,
              upgradedNetworkInfrastructure.source
            );
          } else if (fileName.toLowerCase().includes('.kml')) {
            data = await parseKMLFromBuffer(
              upgradedNetworkByteArray,
              fileName,
              upgradedNetworkInfrastructure.source
            );
          }
          response.upgradedNetworkInfrastructure.push(data);
        }
      }
    );

  const processFinalizedMapUpload = files.finalizedMapUpload.map(
    async (finalizedMapUpload) => {
      const fileName = finalizedMapUpload?.fileName || finalizedMapUpload?.name;
      if (finalizedMapUpload.uuid && fileName) {
        const finalizedMapByteArray = await getByteArrayFromS3(
          finalizedMapUpload.uuid
        );
        let data = null;
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
      }
    }
  );

  await Promise.all([
    ...processGeographicCoverageMap,
    ...processCurrentNetworkInfrastructure,
    ...processUpgradedNetworkInfrastructure,
    ...processFinalizedMapUpload,
  ]);

  res.send(response);
});

export default map;
