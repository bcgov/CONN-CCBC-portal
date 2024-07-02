import * as XLSX from 'xlsx';
import { performQuery } from '../graphql';

const createCbcProjectCommunityMutation = `
  mutation createCbcProjectCommunityMutation(
    $input: CreateCbcProjectCommunityInput!
  ) {
    createCbcProjectCommunity(input: $input) {
      cbcProjectCommunity {
        cbcId
        communitiesSourceDataId
      }
    }
  }`;

const cbcCommunitiesDataErrorList = [];

const ValidateData = async (wb, sheet) => {
  const communitiesDataSheet = XLSX.utils.sheet_to_json(wb.Sheets[sheet], {
    header: 'A',
  });

  const columnList = communitiesDataSheet[0];

  const columnMap = {
    'Geographic Names ID': 'A',
    'Project Number': 'I',
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

const readCbcCommunitiesData = async (wb, sheet) => {
  const errorList = await ValidateData(wb, sheet);

  if (errorList.length > 0) {
    return { error: errorList };
  }
  const cbcCommunitiesDataSheet = XLSX.utils.sheet_to_json(wb.Sheets[sheet], {
    header: 'A',
  });
  const cbcCommunitiesDataListByProjectNumber = {};

  cbcCommunitiesDataSheet.forEach((cbcCommunityRecord) => {
    const errorLog = [];

    // filter values from community which are 'NULL'
    const cbcCommunity = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(cbcCommunityRecord).filter(([_, v]) => v !== 'NULL')
    );

    // trim all data
    Object.keys(cbcCommunity).forEach((key) => {
      if (typeof cbcCommunity[key] === 'string') {
        cbcCommunity[key] = cbcCommunity[key].trim();
      }
    });

    const geoNameId = cbcCommunity['A'];
    if (
      Object.keys(cbcCommunity).length <= 1 ||
      typeof geoNameId !== 'number' ||
      !geoNameId
    ) {
      return;
    }

    const cbcCommunitiesData = {
      communitiesSourceDataId: cbcCommunity['A'],
      cbcProjectNumber: cbcCommunity['I'],
      errorLog,
    };

    // add communities data by project number
    if (cbcCommunitiesDataListByProjectNumber[cbcCommunity['I']]) {
      cbcCommunitiesDataListByProjectNumber[cbcCommunity['I']].push(
        cbcCommunitiesData
      );
    } else {
      cbcCommunitiesDataListByProjectNumber[cbcCommunity['I']] = [
        cbcCommunitiesData,
      ];
    }
    cbcCommunitiesDataErrorList.push(...errorLog);
  });

  return cbcCommunitiesDataListByProjectNumber;
};

const persistCbcCommunities = async (
  cbcId,
  existingCbcCommunities,
  cbcProjectCommunitiesFromSheet,
  req
) => {
  // check if communities are already present for the cbc project
  const newCbcCommunities =
    cbcProjectCommunitiesFromSheet?.filter(
      (community) =>
        !existingCbcCommunities.includes(community.communitiesSourceDataId)
    ) || [];

  Promise.all(
    newCbcCommunities.map((community) =>
      performQuery(
        createCbcProjectCommunityMutation,
        {
          input: {
            cbcProjectCommunity: {
              cbcId,
              communitiesSourceDataId: community.communitiesSourceDataId,
            },
          },
        },
        req
      )
    )
  );
};

export { persistCbcCommunities, readCbcCommunitiesData };
