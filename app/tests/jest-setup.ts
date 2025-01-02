import crypto from 'crypto';
import '@testing-library/jest-dom';
import { Settings } from 'luxon';

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
