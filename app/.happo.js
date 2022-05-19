const { RemoteBrowserTarget } = require('happo.io');
const config = require('./config.js');

const VIEWPORT = '1366x768';

module.exports = {
  apiKey: config.get('HAPPO_API_KEY'),
  apiSecret: config.get('HAPPO_API_SECRET'),
  project: 'ccbc',
  targets: {
    chrome: new RemoteBrowserTarget('chrome', {
      viewport: VIEWPORT,
    }),
    edge: new RemoteBrowserTarget('edge', {
      viewport: VIEWPORT,
    }),
    firefox: new RemoteBrowserTarget('firefox', {
      viewport: VIEWPORT,
    }),
    safari: new RemoteBrowserTarget('safari', {
      viewport: VIEWPORT,
    }),
  },
};
