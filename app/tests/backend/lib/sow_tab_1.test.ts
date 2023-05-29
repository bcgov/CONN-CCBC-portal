/**
 * @jest-environment node
 */
import {
  hasDataInRow,
  readRowData,
  TAB_ONE_CONSTANTS,
} from '../../../backend/lib/sow_import/tab_1';

const { COLUMN_KEYS } = TAB_ONE_CONSTANTS;

describe('sow_tab_1 parsing tests', () => {
  it('the hasDataInRow function returns correctly', () => {
    const successObject = {};
    successObject[COLUMN_KEYS[0]] = 'Some Value';
    const failObject = {};
    const secondFailObject = {};
    secondFailObject[COLUMN_KEYS[0]] = undefined;

    const thirdFailObject = {};
    thirdFailObject[COLUMN_KEYS[0]] = '';

    expect(hasDataInRow(successObject)).toBeTrue();
    expect(hasDataInRow(failObject)).toBeFalse();
    expect(hasDataInRow(secondFailObject)).toBeFalse();
    expect(hasDataInRow(thirdFailObject)).toBeFalse();
  });

  it('the readRowData function returns only the relevant row data', () => {
    const rowData = {};
    // build successful row data
    const BOOLEAN_KEYS = [
      TAB_ONE_CONSTANTS.IS_DIRECT_TO_HOME_SATELITE,
      TAB_ONE_CONSTANTS.IS_IMPACTED_BY_MOBILE_WIRELESS_SERVICE,
      TAB_ONE_CONSTANTS.IS_INDIGENOUS_COMMUNITY_COLUMN,
      TAB_ONE_CONSTANTS.IS_WIRED,
      TAB_ONE_CONSTANTS.IS_WIRELESS,
    ];
    COLUMN_KEYS.forEach((key, index) => {
      if (BOOLEAN_KEYS.includes(key)) {
        rowData[key] = 'Yes';
      } else {
        rowData[key] = `Value_${index}`;
      }
    });

    const dataRead = readRowData(rowData);

    expect(dataRead.communityId).toBe(rowData[COLUMN_KEYS[0]]);
    expect(dataRead.provincesTerritories).toBe(rowData[COLUMN_KEYS[1]]);
    expect(dataRead.communityName).toBe(rowData[COLUMN_KEYS[2]]);
    expect(dataRead.latitude).toBe(rowData[COLUMN_KEYS[3]]);
    expect(dataRead.longitude).toBe(rowData[COLUMN_KEYS[4]]);
    expect(dataRead.isIndigenousCommunity).toBeTrue();
    expect(dataRead.householdsImpactedIndigenous).toBe(rowData[COLUMN_KEYS[6]]);
    expect(dataRead.numberOfHouseholds).toBe(rowData[COLUMN_KEYS[7]]);
    expect(dataRead.isWired).toBeTrue();
    expect(dataRead.isWireless).toBeTrue();
    expect(dataRead.isImpactedByMobileWirelessService).toBeTrue();
  });
});
