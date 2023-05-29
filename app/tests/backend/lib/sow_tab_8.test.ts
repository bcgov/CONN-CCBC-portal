/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import request from 'supertest';
import * as XLSX from 'xlsx'; 
import fs from 'fs';
import { performQuery } from '../../../backend/lib/graphql';
import LoadTab8ata from '../../../backend/lib/sow_import/tab_8'

jest.mock('../../../backend/lib/graphql');

describe('sow_tab_8', () => {
  // it('Should read file', ()=>{
  //   const filepath = __dirname + '/UBF_SoW4.xlsx';
  //   if (fs.existsSync(filepath) === false) {
  //     console.log('oops');
  //   }
  //   const buf = fs.readFileSync(filepath);
  //   const wbs = XLSX.read(buf); 
  //   const sheet = XLSX.utils.sheet_to_json(wbs.Sheets['8'], { header: "A" });
  //   console.log(sheet);
  //   expect(sheet.length).toBeGreaterThan(100);
  // });

  beforeEach(() => {
    mocked(performQuery).mockImplementation(async () => {
      return {}
    });
    jest.spyOn(XLSX, 'read').mockReturnValue({
      Sheets: { Sheet1:{ } },
      SheetNames: ["8"]
    });
  })
  it('should parse worksheet and return error if no data found', async ()  => { 
    jest.spyOn(XLSX.utils, 'sheet_to_json').mockReturnValue([
      { a: 1, b: 2, c: 3 }
    ]);
    const wb = XLSX.read(null); 

    const data = await LoadTab8ata(1,wb,'8', request);

    expect(data).toEqual(
      {
        error:
        [
          'Wrong number of rows on Tab 8'
        ]
      }
    );
  });
  
  it('should parse worksheet and return error if no complete rows found', async ()  => { 
    const fakeTab8 = [
      {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
      {
        B: 'Number of Communities Impacted',
        E: 3
      },
      {
        B: 'Number of Indigenous Communities Impacted',
        E: 2
      },
      {},
      {
        A: 'Project Zone'
      },
      {
        A: 1,
        B: 1892,
        C: 'Lindeman',
        D: 'Locality',
        E: 59.7831,
        F: -135.085451,
        G: 'Open Map',
        I: 'Open Map',
        J: 'https://apps.gov.bc.ca/pub/bcgnws/names/1892.html',
        K: 'N',
        M: 'Incomplete'
      },      
      {}
    ];

    jest.spyOn(XLSX.utils, 'sheet_to_json').mockReturnValue(fakeTab8);
    const wb = XLSX.read(null); 

    const data = await LoadTab8ata(1,wb,'8', request);

    expect(data).toEqual(
      {
        error: 'no data found for Tab 8'
      }
    );
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should parse worksheet and submit expected mutation', async ()  => { 
    const fakeTab8 = [
      {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
      {
        B: 'Number of Communities Impacted',
        E: 3
      },
      {
        B: 'Number of Indigenous Communities Impacted',
        E: 2
      },
      {},
      {
        A: 'Project Zone'
      },
      {
        A: 1,
        B: 1892,
        C: 'Lindeman',
        D: 'Locality',
        E: 59.7831,
        F: -135.085451,
        G: 'Open Map',
        I: 'Open Map',
        J: 'https://apps.gov.bc.ca/pub/bcgnws/names/1892.html',
        K: 'N',
        M: 'Complete'
      },
      // {
      //   A: 1,
      //   B: 65680,
      //   C: 'McDonald Lake 1',
      //   D: 'Indian Reserve',
      //   E: 59.733123,
      //   F: -133.552063,
      //   G: 'Open Map',
      //   I: 'Open Map',
      //   J: 'https://apps.gov.bc.ca/pub/bcgnws/names/65680.html',
      //   K: 'Y',
      //   M: 'Complete'
      // },
      // {
      //   A: 1,
      //   B: 20302,
      //   C: 'Pleasant Camp',
      //   D: 'Locality',
      //   E: 59.505,
      //   F: -136.463056,
      //   G: 'Open Map',
      //   I: 'Open Map',
      //   J: 'https://apps.gov.bc.ca/pub/bcgnws/names/20302.html',
      //   K: 'N',
      //   M: ''
      // }
    ];

    const expectedInput ={
      input: {
        jsonData: {
          communitiesNumber: 3,
          indigenousCommunitiesNumber: 2,
          geoNames: [
            {
              projectZone: 1,
              geoNameId: 1892,
              bcGeoName: 'Lindeman',
              geoType: 'Locality',
              latitude: 59.7831,
              longitude: -135.085451,
              impacted: undefined, 
              mapLink: 'https://apps.gov.bc.ca/pub/bcgnws/names/1892.html',
              indigenous:'N',
            }
          ]
        },
        sowId: 1
      }
    };

    jest.spyOn(XLSX.utils, 'sheet_to_json').mockReturnValue(fakeTab8);
    const wb = XLSX.read(null); 

    await LoadTab8ata(1,wb,'8', request);
    expect(performQuery).toHaveBeenCalledWith( expect.anything(), expectedInput, expect.anything());
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
});