import {generateDatabaseMockOptions} from '../../backend/lib/graphql/helpers';

const fields = ["mocks.mocked_timestamp"];
 
describe("Database mock options", () => {
    it("should include mocks in path if config values are set ", async () => {  
        const cookies = {};
        const options = generateDatabaseMockOptions(cookies, fields);

        expect(options).toEqual({"search_path": "mocks,pg_catalog,public"}); 
    });

    it("should include cookie if config values are set and cookie passed", async () => {  
        const cookies = {"mocks.mocked_timestamp":1654041600};        
        const options = generateDatabaseMockOptions(cookies, fields);
        const mockOptions = {...cookies, search_path: "mocks,pg_catalog,public"}

        expect(options).toEqual(mockOptions); 
    });

});

