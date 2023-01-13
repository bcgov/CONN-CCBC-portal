import removeFalseyValuesFromObject from 'utils/removeFalseValuesFromObject';

const mockObject = {
  key1: true,
  key2: false,
  key3: 100,
  key4: 'test',
  key5: false,
  key6: false,
};

describe('The removeFalseyValuesFromObject function', () => {
  it('returns the correct object', () => {
    expect(removeFalseyValuesFromObject(mockObject)).toStrictEqual({
      key1: true,
      key3: 100,
      key4: 'test',
    });
  });

  it('handles an empty object', () => {
    expect(removeFalseyValuesFromObject({})).toStrictEqual({});
  });
});
