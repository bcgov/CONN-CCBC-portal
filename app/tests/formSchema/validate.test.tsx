import validate from 'formSchema/validate';
import mockFormData from 'tests/utils/mockFormData';
import { schema } from 'formSchema';

describe('the validate function', () => {
  it('should not return errors for file upload fields', () => {
    const validation = validate(mockFormData, schema);

    expect(Object.keys(validation).length).toBe(0);
  });
});
