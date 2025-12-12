import { Router } from 'express';
import getAuthRole from '../../../utils/getAuthRole';
import createCbcProject from './create';

const cbc = Router();

// eslint-disable-next-line consistent-return
cbc.post('/api/cbc', async (req, res) => {
  const authRole = getAuthRole(req);
  const isRoleAuthorized =
    authRole?.pgRole === 'cbc_admin' || authRole?.pgRole === 'super_admin';
  if (!isRoleAuthorized) {
    return res.status(404).end();
  }
  const { projectId, projectTitle, externalStatus, projectType } = req.body;
  const projectNumber = projectId.trim();

  const createResult = await createCbcProject(
    projectNumber,
    projectTitle,
    externalStatus,
    projectType,
    req
  );
  return res.status(200).json(createResult);
});

export default cbc;
