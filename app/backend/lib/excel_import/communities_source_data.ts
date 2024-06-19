import * as XLSX from 'xlsx';
import { performQuery } from '../graphql';

const findCommunitiesSourceDataQuery = `
  query findCommunitiesSourceData($geographicNameId: Int!) {
    communitiesSourceDataByGeographicNameId(geographicNameId: $geographicNameId) {
      id
      geographicNameId
    }
  }
`;

const createCommunitiesSourceDataMutation = `
  mutation createCommunitiesSourceDataMutation($input: CreateCommunitiesSourceDataInput!) {
    createCommunitiesSourceData(input: $input) {
      clientMutationId
      communitiesSourceData {
        id
      }
    }
  }
`;

const updateCommunitiesSourceDataMutation = `
  mutation updateCommunitiesSourceDataMutation($input: UpdateCommunitiesSourceDataInput!) {
    updateCommunitiesSourceData(input: $input) {
      clientMutationId
      communitiesSourceData {
        id
      }
    }
  }
`;

const communitiesSourceDataErrorList = [];

const readCommunitiesSourceDataSummary = async (wb, sheet) => {
  const communitiesSourceDataSheet = XLSX.utils.sheet_to_json(
    wb.Sheets[sheet],
    {
      header: 'A',
    }
  );
  const communitiesSourceDataList = [];

  communitiesSourceDataSheet.forEach((communityRecord) => {
    const errorLog = [];

    // filter values from community which are 'NULL'
    const community = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(communityRecord).filter(([_, v]) => v !== 'NULL')
    );

    // trim all data
    Object.keys(community).forEach((key) => {
      if (typeof community[key] === 'string') {
        community[key] = community[key].trim();
      }
    });

    const geoNameId = community['A'];
    // filter out rows with no geoId or geoId is not a number
    if (
      Object.keys(community).length <= 2 ||
      typeof geoNameId !== 'number' ||
      !geoNameId
    ) {
      return;
    }

    const communitiesData = {
      geographicNameId: community['A'],
      bcGeographicName: community['B'],
      geographicType: community['C'],
      regionalDistrict: community['D'],
      economicRegion: community['E'],
      latitude: community['F'],
      longitude: community['G'],
      csduid: null,
      mapLink: community['I'],
      errorLog,
    };

    communitiesSourceDataErrorList.push(...errorLog);

    communitiesSourceDataList.push(communitiesData);
  });

  const communitiesDataData = {
    _jsonData: communitiesSourceDataList,
  };

  return communitiesDataData;
};

const ValidateData = async (wb, sheet) => {
  const communitiesDataSheet = XLSX.utils.sheet_to_json(wb.Sheets[sheet], {
    header: 'A',
  });

  const columnList = communitiesDataSheet[0];

  const columnMap = {
    'Geographic Name ID': 'A',
    'BC Geographic Name': 'B',
    Type: 'C',
    'Regional District': 'D',
    'Economic Region': 'E',
    Latitude: 'F',
    Longitude: 'G',
    CSDUID: 'H',
    'Map Link (for verifying)': 'I',
  };

  const errors = [];
  Object.entries(columnMap).forEach(([key, value]) => {
    if (columnList[value] !== key) {
      errors.push(
        `Column heading "${columnList[value]}" in column ${value} does not match expected name: "${key}"`
      );
    }
  });

  return errors;
};

const LoadCommunitiesSourceData = async (wb, sheet, req) => {
  const data = await readCommunitiesSourceDataSummary(wb, sheet);
  const communitiesSourceDataList = [];

  const errorList = await ValidateData(wb, sheet);

  if (errorList.length > 0) {
    return { error: errorList };
  }

  // persist in DB
  await Promise.all(
    data._jsonData.map(async (community) => {
      const existingCommunityRecord = await performQuery(
        findCommunitiesSourceDataQuery,
        {
          geographicNameId: community.geographicNameId,
        },
        req
      );
      // format data to be persisted
      const communityInputData = community;
      delete communityInputData.errorLog;
      if (
        existingCommunityRecord.data?.communitiesSourceDataByGeographicNameId
          ?.geographicNameId === community.geographicNameId
      ) {
        // update community data
        await performQuery(
          updateCommunitiesSourceDataMutation,
          {
            input: {
              communitiesSourceDataPatch: communityInputData,
              id: existingCommunityRecord.data
                ?.communitiesSourceDataByGeographicNameId?.id,
            },
          },
          req
        );
      } else {
        // create community
        const result = await performQuery(
          createCommunitiesSourceDataMutation,
          {
            input: {
              communitiesSourceData: communityInputData,
            },
          },
          req
        );
        communitiesSourceDataList.push(result);
      }
    })
  );

  return {
    ...communitiesSourceDataList,
    errorLog: communitiesSourceDataErrorList,
  };
};

export default LoadCommunitiesSourceData;
