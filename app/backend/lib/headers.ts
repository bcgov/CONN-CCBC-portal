import helmet from 'helmet';
import config from '../../config';

const headersMiddleware = () => {
  const helmetMiddleware = helmet({
    contentSecurityPolicy: false,
  });
  return (req, res, next) => {
    // Tell search + crawlers not to index non-production environments:
    if (
      !config.get('OPENSHIFT_APP_NAMESPACE') ||
      !config.get('OPENSHIFT_APP_NAMESPACE').endsWith('-prod')
    ) {
      res.append('X-Robots-Tag', 'noindex, noimageindex, nofollow, noarchive');
    }

    // Structured Permissions-Policy syntax (not Feature-Policy `'none'` strings).
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy
    res.append('Permissions-Policy', 'display-capture=()');

    helmetMiddleware(req, res, next);
  };
};

export default headersMiddleware;
