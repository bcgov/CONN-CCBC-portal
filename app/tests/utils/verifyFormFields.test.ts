import verifyFormFields from 'utils/verifyFormFields';
import schema from 'formSchema/schema';

const mockObject = {
  copiesOfRegistration: null,
  otherSupportingMaterials: [
    {
      id: 29,
      uuid: 'abc0354b-c89f-45b3-9312-cf51615973af',
      name: 'file_20M.kmz',
      size: 20000000,
      type: '',
    },
  ],
  geographicCoverageMap: [
    {
      id: 28,
      uuid: 'abc0354b-c89f-45b3-9312-cf51615973ae',
      name: 'file_10M.kmz',
      size: 10000000,
      type: '',
    },
  ],
};

const schemaSection = schema.properties.supportingDocuments['properties'];

describe('The verifyFormFields function', () => {
  it('filters the incorrect field and returns the correct value', () => {
    expect(verifyFormFields(mockObject, schemaSection, () => {})).toStrictEqual(
      {
        copiesOfRegistration: null,
        otherSupportingMaterials: [
          {
            id: 29,
            uuid: 'abc0354b-c89f-45b3-9312-cf51615973af',
            name: 'file_20M.kmz',
            size: 20000000,
            type: '',
          },
        ],
      }
    );
  });

  it('handles an empty object', () => {
    expect(verifyFormFields({}, schemaSection, () => {})).toStrictEqual({});
  });
});
