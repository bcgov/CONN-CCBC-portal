import { NextRouter } from 'next/router';

const createMockRouter = (routerOptions?: Partial<NextRouter>): NextRouter => {
  return {
    basePath: '',
    pathname: '/',
    route: '/',
    query: {},
    asPath: '/',
    back: jest.fn(),
    beforePopState: jest.fn(),
    prefetch: jest.fn().mockImplementation(() => new Promise(() => {})),
    push: jest.fn(),
    reload: jest.fn(),
    replace: jest.fn(),
    forward: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    defaultLocale: 'en',
    domainLocales: [],
    isPreview: false,
    ...routerOptions,
  };
};

export default createMockRouter;
