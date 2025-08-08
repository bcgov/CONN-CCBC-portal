const { RemoteBrowserTarget } = require('happo.io');
const config = require('./config/index.js');

const VIEWPORT = '1366x768';
const MAXHEIGHT = 20000;

// Enhanced configuration for more deterministic screenshots
const baseTargetConfig = {
  viewport: VIEWPORT,
  maxHeight: MAXHEIGHT,
  freezeAnimations: 'last-frame',
  prefersReducedMotion: true,
  // Disable cursor to prevent it from appearing in screenshots
  cursor: 'none',
  // Wait for fonts to load
  waitForFonts: true,
  // Stabilization settings
  stabilizeWait: 500,
  // Disable smooth scrolling
  forcedCSS: `
    *, *::before, *::after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
      scroll-behavior: auto !important;
    }

    /* Remove focus outlines that might appear inconsistently */
    *:focus {
      outline: none !important;
    }

    /* Ensure hover states are cleared */
    *:hover {
      /* This will be overridden by the clearHoverStates command */
    }
  `,
};

module.exports = {
  apiKey: config.get('HAPPO_API_KEY'),
  apiSecret: config.get('HAPPO_API_SECRET'),
  project: 'ccbc',
  targets: {
    chrome: new RemoteBrowserTarget('chrome', baseTargetConfig),
    edge: new RemoteBrowserTarget('edge', baseTargetConfig),
    firefox: new RemoteBrowserTarget('firefox', baseTargetConfig),
    // safari: new RemoteBrowserTarget('safari', {
    //   ...baseTargetConfig,
    //   scrollStitch: true,
    // }),
  },
};
