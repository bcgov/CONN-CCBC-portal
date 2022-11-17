import validate from 'formSchema/validate';
import mockFormData from 'tests/utils/mockFormData';

describe('the validate function', () => {
  it('should not return errors for file upload fields', () => {
    const validation = validate(mockFormData);

    expect(Object.keys(validation).length).toBe(0);
  });
});
