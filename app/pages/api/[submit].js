import { postMiddleware } from '../../form-schema';
import { withSession } from 'next-session';

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};
function handler(req, res) {
  runMiddleware(req, res, postMiddleware);
};

export default withSession(handler);
