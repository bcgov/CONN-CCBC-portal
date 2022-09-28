import {
  chainMatch,
  isPageRequest,
  csp,
  strictDynamic,
} from '@next-safe/middleware';

// Next.js middleware. See https://nextjs.org/docs/advanced-features/middleware

const securityMiddleware = [
  csp({
    directives: {
      'default-src': ['self'],
      'script-src': ['self'],
      'connect-src': ['self'],
      'img-src': ['self'],
      'style-src': ['self'],
      'frame-ancestors': ['self'],
      'form-action': ['self'],
    },
  }),
  strictDynamic(),
];

export default chainMatch(isPageRequest)(...securityMiddleware);
