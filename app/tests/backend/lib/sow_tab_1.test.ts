import {
  hasDataInRow,
  readRowData,
  COLUMN_KEYS,
} from '../../../backend/lib/sow_import/tab_1';

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
    COLUMN_KEYS.forEach((key, index) => {
      rowData[key] = `Value_${index}`;
    });

    const dataRead = readRowData(rowData);

    expect(dataRead.communityId).toBe(rowData[COLUMN_KEYS[0]]);
    expect(dataRead.provincesTerritories).toBe(rowData[COLUMN_KEYS[1]]);
    expect(dataRead.communityName).toBe(rowData[COLUMN_KEYS[2]]);
    expect(dataRead.latitude).toBe(rowData[COLUMN_KEYS[3]]);
    expect(dataRead.longitude).toBe(rowData[COLUMN_KEYS[4]]);
    expect(dataRead.isIndigenousCommunity).toBe(rowData[COLUMN_KEYS[5]]);
    expect(dataRead.householdsImpactedIndigenous).toBe(rowData[COLUMN_KEYS[6]]);
    expect(dataRead.numberOfHouseholds).toBe(rowData[COLUMN_KEYS[7]]);
    expect(dataRead.isWired).toBe(rowData[COLUMN_KEYS[7]]);
  });
});
