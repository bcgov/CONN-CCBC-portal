import crypto from 'crypto';
import '@testing-library/jest-dom';
import { Settings } from 'luxon';

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

// Some rjsf features require window.crypto, which isn't provided by jsdom
if (global.self) {
  Object.defineProperty(global.self, 'crypto', {
    value: {
      getRandomValues: (arr) => crypto.randomBytes(arr.length),
    },
  });
}

if (typeof SubmitEvent === 'undefined') {
  global.SubmitEvent = class SubmitEvent extends Event {
    submitter: HTMLElement | null;

    constructor() {
      super('submit');
      this.submitter = null;
    }
  };
}

Settings.defaultLocale = 'en-CA';
Settings.defaultZone = 'America/Vancouver';
