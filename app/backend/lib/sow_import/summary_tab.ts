import * as XLSX from 'xlsx';
import { performQuery } from '../graphql';
import {
  convertExcelDropdownToBoolean,
  convertExcelDateToJSDate,
} from './util';

const createSowMutation = `
  mutation sowUploadMutation($input: ApplicationSowDataInput!) {
    createApplicationSowData(input: {applicationSowData:  $input}) {
        applicationSowData {
        id
        rowId
      }
      clientMutationId
    }
  }
`;

const readSummary = async (wb, sheet_name, applicationId) => {
  const summary = XLSX.utils.sheet_to_json(wb.Sheets[sheet_name], {
    header: 'A',
  });

  const sowData = {
    applicationId: +applicationId,
    jsonData: {
      organizationName: '',
      projectTitle: '',
      province: '',
      ccbc_number: '',
      effectiveStartDate: '',
      projectStartDate: '',
      projectCompletionDate: '',
      backboneFibre: false,
      backboneMicrowave: false,
      backboneSatellite: false,
      lastMileFibre: false,
      lastMileCable: false,
      lastMileDSL: false,
      lastMileMobileWireless: false,
      lastMileFixedWireless: false,
      lastMileSatellite: false,
    },
  };
  // hardcoded summary table position: rows from 6 to 20
  // first pass - columns C and D
  for (let row = 6; row < 20; row++) {
    const value = summary[row]['C'];
    if (value === undefined) continue;
    if (typeof value !== 'string') continue;
    const input = summary[row]['D'];
    if (input === undefined) continue;

    if (value.indexOf('Applicant Name') > -1) {
      sowData.jsonData.organizationName = input;
    }
    if (value.indexOf('Project Title') > -1) {
      sowData.jsonData.projectTitle = input;
    }
    if (value.indexOf('Province') > -1) {
      sowData.jsonData.province = input;
    }
    if (value.indexOf('Application Number') > -1) {
      sowData.jsonData.ccbc_number = input;
    }
    if (value.indexOf('Effective Start Date') > -1) {
      sowData.jsonData.effectiveStartDate = convertExcelDateToJSDate(input);
    }
    if (value.indexOf('Project Start Date') > -1) {
      sowData.jsonData.projectStartDate = convertExcelDateToJSDate(input);
    }
    if (value.indexOf('Project Completion Date') > -1) {
      sowData.jsonData.projectCompletionDate = convertExcelDateToJSDate(input);
    }
  }

  // second pass - columns F and G
  let backbone = false;
  let lastMile = false;
  for (let row = 6; row < 20; row++) {
    const value = summary[row]['F'];
    if (value === undefined) continue;
    if (typeof value !== 'string') continue;
    if (value.indexOf('Backbone Technologies') > -1) {
      backbone = true;
    }
    if (value.indexOf('Last Mile Technologies') > -1) {
      backbone = false;
      lastMile = true;
    }
    const input = summary[row]['G'];
    if (input === undefined) continue;
    if (backbone && value.indexOf('Fibre') > -1) {
      sowData.jsonData.backboneFibre = convertExcelDropdownToBoolean(input);
    }
    if (backbone && value.indexOf('Microwave') > -1) {
      sowData.jsonData.backboneMicrowave = convertExcelDropdownToBoolean(input);
    }
    if (backbone && value.indexOf('Satellite') > -1) {
      sowData.jsonData.backboneSatellite = convertExcelDropdownToBoolean(input);
    }
    if (lastMile && value.indexOf('Fibre') > -1) {
      sowData.jsonData.lastMileFibre = convertExcelDropdownToBoolean(input);
    }
    if (lastMile && value.indexOf('Cable') > -1) {
      sowData.jsonData.lastMileCable = convertExcelDropdownToBoolean(input);
    }
    if (lastMile && value.indexOf('DSL') > -1) {
      sowData.jsonData.lastMileDSL = convertExcelDropdownToBoolean(input);
    }
    if (lastMile && value.indexOf('Mobile') > -1) {
      sowData.jsonData.lastMileMobileWireless =
        convertExcelDropdownToBoolean(input);
    }
    if (lastMile && value.indexOf('Fixed') > -1) {
      sowData.jsonData.lastMileFixedWireless =
        convertExcelDropdownToBoolean(input);
    }
    if (lastMile && value.indexOf('Satellite') > -1) {
      sowData.jsonData.lastMileSatellite = convertExcelDropdownToBoolean(input);
    }
  }

  return sowData;
};

const ValidateData = (data) => {
  const errors = [];
  if (data.backboneFibre === undefined)
    errors.push({
      level: 'cell',
      error: 'Invalid data: Backbone Technologies - Fibre',
    });
  if (data.backboneMicrowave === undefined)
    errors.push({
      level: 'cell',
      error: 'Invalid data: Backbone Technologies - Microwave',
    });
  if (data.backboneSatellite === undefined)
    errors.push({
      level: 'cell',
      error: 'Invalid data: Backbone Technologies - Satellite',
    });
  if (data.lastMileFibre === undefined)
    errors.push({
      level: 'cell',
      error: 'Invalid data: Last Mile Technologies - Fibre',
    });
  if (data.lastMileCable === undefined)
    errors.push({
      level: 'cell',
      error: 'Invalid data: Last Mile Technologies - Cable',
    });
  if (data.lastMileDSL === undefined)
    errors.push({
      level: 'cell',
      error: 'Invalid data: Last Mile Technologies - DSL',
    });
  if (data.lastMileMobileWireless === undefined)
    errors.push({
      level: 'cell',
      error: 'Invalid data: Last Mile Technologies - Mobile Wireless',
    });
  if (data.lastMileFixedWireless === undefined)
    errors.push({
      level: 'cell',
      error: 'Invalid data: Last Mile Technologies - Fixed Wireless',
    });
  if (data.lastMileSatellite === undefined)
    errors.push({
      level: 'cell',
      error: 'Invalid data: Last Mile Technologies - Satellite',
    });

  if (data.effectiveStartDate === null)
    errors.push({ level: 'cell', error: 'Invalid data: Effective Start Date' });
  if (data.projectStartDate === null)
    errors.push({ level: 'cell', error: 'Invalid data: Project Start Date' });
  if (data.projectCompletionDate === null)
    errors.push({
      level: 'cell',
      error: 'Invalid data: Project Completion Date',
    });

  if (data.organizationName === '')
    errors.push({ level: 'cell', error: 'Invalid data: Applicant Name' });
  if (data.projectTitle === '')
    errors.push({ level: 'cell', error: 'Invalid data: Project Title' });
  if (data.province === '')
    errors.push({ level: 'cell', error: 'Invalid data: Province' });
  return errors;
};

const LoadSummaryData = async (wb, sheet_name, req) => {
  const { applicationId, ccbcNumber } = req.params;
  const { validate = false } = req.query || {};
  const data = await readSummary(wb, sheet_name, applicationId);

  const uploadedNumber = data.jsonData.ccbc_number;
  if (uploadedNumber !== ccbcNumber) {
    return {
      error: `CCBC Number mismatch: expected ${ccbcNumber}, received: ${uploadedNumber}`,
    };
  }
  const errorList = ValidateData(data.jsonData);

  if (errorList.length > 0) {
    return { error: errorList };
  }
  if (validate) {
    return data;
  }
  // time to persist in DB
  const result = await performQuery(
    createSowMutation,
    { input: data },
    req
  ).catch((e) => {
    return { error: e };
  });

  return result;
};

export default LoadSummaryData;
