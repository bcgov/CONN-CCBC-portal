import crypto from 'crypto';

// Some rjsf features require window.crypto, which isn't provided by jsdom
Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: (arr) => crypto.randomBytes(arr.length),
  },
});
