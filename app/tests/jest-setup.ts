import crypto from 'crypto';
import '@testing-library/jest-dom';
import { Settings } from 'luxon';

// Mock useFeatureFlagMap globally so tests can override flag values per-test
// using jest.spyOn/mockReturnValue, since jest.spyOn doesn't intercept a hook
// imported directly by the component under test.
jest.mock('components/FeatureFlagProvider', () => {
  const actual = jest.requireActual('components/FeatureFlagProvider');
  return {
    ...actual,
    // Default: no flags configured, so useDeferredFeature falls back to its defaultValue
    useFeatureFlagMap: jest.fn(() => ({})),
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
