import type get from "convict";
import { getHeapStatistics } from "v8";

describe("Config tests", () => {
    it("should throw error if ENABLE_MOCK_TIME enabled in production ", () => {  
        const mockGet = jest.fn<typeof get>();
        mockGet.mockImplementation((key)=>{
            switch(key){
                case 'NODE_ENV': return 'dev';
                case 'OPENSHIFT_APP_NAMESPACE': return 'ff61fb-prod';
                case 'ENABLE_MOCK_TIME': return true;
            }
            return '';
        });
        const mockConvict = jest.fn().mockReturnValue(
            {
                get: mockGet,
                validate: jest.fn()
                // loadFile: jest.fn()  // commented out intentionally to cover lines 168,169
            }
        );
        jest.mock('convict', () =>  mockConvict);

        expect(() => { 
            const config = require('../../config'); 
            console.log(config.get("ENABLE_MOCK_TIME"));
        }).toThrow(new Error("ENABLE_MOCK_TIME cannot be true with a -prod namespace."));
    });
});

