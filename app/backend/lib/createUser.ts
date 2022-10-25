import type { Request } from 'express';
import getAuthRole from '../../utils/getAuthRole';
import { performQuery } from './graphql';

const createUserMutation = `
mutation {
  createUserFromSession(input: {}) {
    __typename
  }
}
`;

const createUserMiddleware = () => {
  return async (req: Request) => {
    const authRole = getAuthRole(req);
    if (authRole.pgRole === 'ccbc_guest') return;

    const response = await performQuery(createUserMutation, {}, req);
    if (response.errors) {
      throw new Error(
        `Failed to create user from session:\n${response.errors.join('\n')}`
      );
    }
  };
};

export default createUserMiddleware;
