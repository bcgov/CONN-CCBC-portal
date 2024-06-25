import crypto from 'crypto';
import { Settings } from 'luxon';

// Some rjsf features require window.crypto, which isn't provided by jsdom
if (global.self) {
  Object.defineProperty(global.self, 'crypto', {
    value: {
      getRandomValues: (arr) => crypto.randomBytes(arr.length),
    },
  });
}

Settings.defaultLocale = 'en-CA';
Settings.defaultZone = 'America/Vancouver';
