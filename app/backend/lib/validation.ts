import { Router } from 'express';
import RateLimit from 'express-rate-limit';
import getAuthRole from '../../utils/getAuthRole';
import { performQuery } from './graphql';

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 2000,
});

const validation = Router();

const getProjectNumberQuery = `
  query GetProjectNumber($projectNumber: String!) {
    cbcByProjectNumber(projectNumber: $projectNumber) {
      rowId
      projectNumber
    }
  }
`;

validation.post(
  '/api/validation/project-number-unique',
  limiter,
  async (req, res) => {
    const authRole = getAuthRole(req);
    const isRoleAuthorized =
      authRole?.pgRole === 'cbc_admin' || authRole?.pgRole === 'super_admin';
    if (!isRoleAuthorized) {
      return res.status(404).end();
    }
    const { projectNumber } = req.body;
    const getProjectNumber = await performQuery(
      getProjectNumberQuery,
      {
        projectNumber: String(projectNumber ?? ''),
      },
      req
    );
    if (getProjectNumber.data.cbcByProjectNumber) {
      return res.send(false);
    }
    return res.send(true);
  }
);

export default validation;
