const { RemoteBrowserTarget } = require('happo.io');
const config = require('./config.js');

module.exports = {
  apiKey: config.get('HAPPO_API_KEY'),
  apiSecret: config.get('HAPPO_API_SECRET'),
  targets: {
    chrome: new RemoteBrowserTarget('chrome', {
      viewport: '1024x768',
    }),
  },
};
