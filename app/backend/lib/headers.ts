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

    // https://www.zaproxy.org/docs/alerts/10063-1/
    res.append('Permissions-Policy', "display-capture 'none'");

    helmetMiddleware(req, res, next);
  };
};

export default headersMiddleware;
