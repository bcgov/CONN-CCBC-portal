import * as XLSX from 'xlsx';
import { performQuery } from '../graphql';
import {
  convertExcelDropdownToBoolean,
  convertExcelDateToJSDate,
} from './util';

const createSowMutation = `
  mutation sowUploadMutation($input: CreateApplicationSowDataInput!) {
    createApplicationSowData(input:   $input) {
        applicationSowData {
        id
        rowId
      }
      clientMutationId
    }
  }
`;

const readSummary = async (wb, sheet_name, applicationId, amendmentNumber) => {
  const summary = XLSX.utils.sheet_to_json(wb.Sheets[sheet_name], {
    header: 'A',
  });

  const cellRefs: any = [];
  const cellValues: any = [];
  const jsonData = {
    organizationName: '',
    projectTitle: '',
    province: '',
    ccbc_number: '',
    effectiveStartDate: null,
    projectStartDate: null,
    projectCompletionDate: null,
    backboneFibre: false,
    backboneMicrowave: false,
    backboneSatellite: false,
    lastMileFibre: false,
    lastMileCable: false,
    lastMileDSL: false,
    lastMileMobileWireless: false,
    lastMileFixedWireless: false,
    lastMileSatellite: false,
  };

  const getRowNumber = (rowData, fallbackIndex) => {
    if (rowData && typeof rowData.__rowNum__ === 'number') {
      return rowData.__rowNum__ + 1;
    }
    return fallbackIndex + 1;
  };

  // hardcoded summary table position: rows from 6 to 20
  // first pass - columns C and D
  for (let row = 6; row < 20; row++) {
    const value = summary[row]['C'];
    if (value === undefined) continue;
    if (typeof value !== 'string') continue;
    const input = summary[row]['D'];

    // Cell reference
    const rowNumber = getRowNumber(summary[row], row);
    const cellNumber = `D${rowNumber}`;

    const extractData = (field: string, conversion = null) => {
      cellRefs[field] = cellNumber;
      cellValues[field] = input;
      if (input !== undefined) {
        jsonData[field] = conversion ? conversion(input) : input;
      }
    };

    if (value.indexOf('Applicant Name') > -1) {
      extractData('organizationName');
    }
    if (value.indexOf('Project Title') > -1) {
      extractData('projectTitle');
    }
    if (value.indexOf('Province') > -1) {
      extractData('province');
    }
    if (value.indexOf('Application Number') > -1) {
      extractData('ccbc_number');
    }
    if (value.indexOf('Effective Start Date') > -1) {
      extractData('effectiveStartDate', convertExcelDateToJSDate);
    }
    if (value.indexOf('Project Start Date') > -1) {
      extractData('projectStartDate', convertExcelDateToJSDate);
    }
    if (value.indexOf('Project Completion Date') > -1) {
      extractData('projectCompletionDate', convertExcelDateToJSDate);
    }
  }

  // second pass - columns F and G
  let backbone = false;
  let lastMile = false;
  for (let row = 5; row < 20; row++) {
    const value = summary[row]['F'];
    if (value === undefined) continue;
    if (typeof value !== 'string') continue;
    if (value.indexOf('Backbone Technologies') > -1) {
      backbone = true;
    }
    if (value.indexOf('Last Mile Technologies') > -1) {
      lastMile = true;
    }
    const input = summary[row]['G'];

    // Cell reference
    const rowNumber = getRowNumber(summary[row], row);
    const cellNumber = `G${rowNumber}`;

    const extractData = (field: string) => {
      cellRefs[field] = cellNumber;
      cellValues[field] = input;
      if (input !== undefined && input !== '') {
        jsonData[field] = convertExcelDropdownToBoolean(input);
      }
    };

    if (backbone && value.indexOf('Fibre') > -1) {
      extractData('backboneFibre');
    }
    if (backbone && value.indexOf('Microwave') > -1) {
      extractData('backboneMicrowave');
    }
    if (backbone && value.indexOf('Satellite') > -1) {
      extractData('backboneSatellite');
    }
    if (lastMile && value.indexOf('Fibre') > -1) {
      extractData('lastMileFibre');
    }
    if (lastMile && value.indexOf('Cable') > -1) {
      extractData('lastMileCable');
    }
    if (lastMile && value.indexOf('DSL') > -1) {
      extractData('lastMileDSL');
    }
    if (lastMile && value.indexOf('Mobile') > -1) {
      extractData('lastMileMobileWireless');
    }
    if (lastMile && value.indexOf('Fixed') > -1) {
      extractData('lastMileFixedWireless');
    }
    if (lastMile && value.indexOf('Satellite') > -1) {
      extractData('lastMileSatellite');
    }
  }

  const sowData = {
    _applicationId: parseInt(applicationId, 10),
    _amendmentNumber: parseInt(amendmentNumber, 10),
    _jsonData: jsonData,
  };

  return { ...sowData, cellRefs, cellValues };
};

const ValidateData = (data, cellRefs: any = {}, cellValues: any = {}) => {
  const errors = [];
  const addError = (key, error, expected = 'Yes/No value') => {
    const cell = cellRefs[key];
    const received = cellValues[key] ?? 'null';
    errors.push({
      level: 'cell',
      cell,
      error,
      received,
      expected,
    });
  };

  if (data.backboneFibre === undefined)
    addError('backboneFibre', 'Invalid data: Backbone Technologies - Fibre');
  if (data.backboneMicrowave === undefined) {
    addError(
      'backboneMicrowave',
      'Invalid data: Backbone Technologies - Microwave'
    );
  }

  if (data.backboneSatellite === undefined)
    addError(
      'backboneSatellite',
      'Invalid data: Backbone Technologies - Satellite'
    );
  if (data.lastMileFibre === undefined)
    addError('lastMileFibre', 'Invalid data: Last Mile Technologies - Fibre');
  if (data.lastMileCable === undefined)
    addError('lastMileCable', 'Invalid data: Last Mile Technologies - Cable');
  if (data.lastMileDSL === undefined)
    addError('lastMileDSL', 'Invalid data: Last Mile Technologies - DSL');
  if (data.lastMileMobileWireless === undefined)
    addError(
      'lastMileMobileWireless',
      'Invalid data: Last Mile Technologies - Mobile Wireless'
    );
  if (data.lastMileFixedWireless === undefined)
    addError(
      'lastMileFixedWireless',
      'Invalid data: Last Mile Technologies - Fixed Wireless'
    );
  if (data.lastMileSatellite === undefined)
    addError(
      'lastMileSatellite',
      'Invalid data: Last Mile Technologies - Satellite'
    );

  if (data.effectiveStartDate === null)
    addError(
      'effectiveStartDate',
      'Invalid data: Effective Start Date',
      'Valid date'
    );
  if (data.projectStartDate === null)
    addError(
      'projectStartDate',
      'Invalid data: Project Start Date',
      'Valid date'
    );
  if (data.projectCompletionDate === null)
    addError(
      'projectCompletionDate',
      'Invalid data: Project Completion Date',
      'Valid date'
    );

  if (data.organizationName === '')
    addError(
      'organizationName',
      'Invalid data: Applicant Name',
      'Non-empty value'
    );
  if (data.projectTitle === '')
    addError('projectTitle', 'Invalid data: Project Title', 'Non-empty value');
  if (data.province === '')
    addError('province', 'Invalid data: Province', 'Non-empty value');
  return errors;
};

const LoadSummaryData = async (wb, sheet_name, req) => {
  const { applicationId, ccbcNumber, amendmentNumber } = req.params;
  const validate = req.query?.validate === 'true';
  const operation = req.query?.operation || 'UPDATE';

  const { cellRefs, cellValues, ...data } = await readSummary(
    wb,
    sheet_name,
    applicationId,
    amendmentNumber
  );

  const uploadedNumber = data._jsonData.ccbc_number;
  if (uploadedNumber !== ccbcNumber) {
    return {
      error: [
        {
          cell: cellRefs.ccbc_number,
          error: 'CCBC Number mismatch',
          expected: ccbcNumber,
          received: uploadedNumber,
        },
      ],
    };
  }
  const errorList = ValidateData(data._jsonData, cellRefs, cellValues);

  if (errorList.length > 0) {
    return { error: errorList };
  }
  if (validate) {
    return data;
  }
  // time to persist in DB
  const result = await performQuery(
    createSowMutation,
    {
      input: {
        _applicationId: data._applicationId,
        _jsonData: data._jsonData,
        _amendmentNumber: data._amendmentNumber,
        _historyOperation: operation,
      },
    },
    req
  ).catch((e) => {
    return { error: e };
  });

  return result;
};

export default LoadSummaryData;
