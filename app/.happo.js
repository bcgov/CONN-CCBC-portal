const { RemoteBrowserTarget } = require('happo.io');
const config = require('./config/index.js');

const VIEWPORT = '1366x768';
const MAXHEIGHT = 20000;

module.exports = {
  apiKey: config.get('HAPPO_API_KEY'),
  apiSecret: config.get('HAPPO_API_SECRET'),
  project: 'ccbc',
  targets: {
    chrome: new RemoteBrowserTarget('chrome', {
      viewport: VIEWPORT,
      maxHeight: MAXHEIGHT,
      freezeAnimations: 'last-frame',
      prefersReducedMotion: true,
    }),
    edge: new RemoteBrowserTarget('edge', {
      viewport: VIEWPORT,
      maxHeight: MAXHEIGHT,
      freezeAnimations: 'last-frame',
      prefersReducedMotion: true,
    }),
    firefox: new RemoteBrowserTarget('firefox', {
      viewport: VIEWPORT,
      maxHeight: MAXHEIGHT,
      freezeAnimations: 'last-frame',
      prefersReducedMotion: true,
    }),
    // safari: new RemoteBrowserTarget('safari', {
    //   viewport: VIEWPORT,
    //   maxHeight: MAXHEIGHT,
    //   scrollStitch: true,
    // }),
  },
};
