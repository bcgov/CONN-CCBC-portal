export interface PublicRuntimeConfig {
  ENABLE_MOCK_TIME: boolean;
  OPENSHIFT_APP_NAMESPACE: string;
  SITEMINDER_LOGOUT_URL: string;
  COVERAGES_FILE_NAME: string;
}

declare global {
  interface Window {
    __ENV__?: PublicRuntimeConfig;
  }
}

const emptyPublicRuntimeConfig: PublicRuntimeConfig = {
  ENABLE_MOCK_TIME: false,
  OPENSHIFT_APP_NAMESPACE: '',
  SITEMINDER_LOGOUT_URL: '',
  COVERAGES_FILE_NAME: '',
};

// Next.js 16 removed publicRuntimeConfig/next/config. This app builds a single
// image and injects environment-dependent values at container runtime, so
// NEXT_PUBLIC_* (inlined at build time) isn't a substitute. Server code reads
// convict config directly; browser code reads the window.__ENV__ snapshot
// that pages/_document.tsx serializes into the HTML on every request.
const getPublicRuntimeConfig = (): PublicRuntimeConfig => {
  if (typeof window !== 'undefined') {
    return window.__ENV__ ?? emptyPublicRuntimeConfig;
  }

  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  const config = require('../../config');
  return {
    ENABLE_MOCK_TIME: config.get('ENABLE_MOCK_TIME'),
    OPENSHIFT_APP_NAMESPACE: config.get('OPENSHIFT_APP_NAMESPACE'),
    SITEMINDER_LOGOUT_URL: config.get('SITEMINDER_LOGOUT_URL'),
    COVERAGES_FILE_NAME: config.get('COVERAGES_FILE_NAME'),
  };
};

export default getPublicRuntimeConfig;
