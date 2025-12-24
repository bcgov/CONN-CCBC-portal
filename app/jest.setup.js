// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock useFeature globally to fix issues with GrowthBook 1.6.2
// When components import useFeature directly, jest.spyOn doesn't intercept
// This global mock allows tests to override it per-test using jest.spyOn
jest.mock('@growthbook/growthbook-react', () => {
  const actual = jest.requireActual('@growthbook/growthbook-react');
  return {
    ...actual,
    useFeature: jest.fn((id) => {
      // Default return value when not explicitly mocked
      return {
        value: null,
        source: 'unknownFeature',
        on: false,
        off: true,
        ruleId: '',
      };
    }),
  };
});
