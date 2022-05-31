import type { Request } from 'express';
// import { getUserGroups } from '../helpers/userGroupAuthentication';
import { performQuery } from './graphql';

// This middleware calls the createUserFromSession mutation.

const UNAUTHORIZED_IDIR_USER = 'UNAUTHORIZED_IDIR_USER';

const createUserMutation = `
mutation {
  createUserFromSession(input: {}) {
    __typename
  }
}
`;

const createUserMiddleware = () => {
  return async (req: Request) => {
    // if (getUserGroups(req).includes(UNAUTHORIZED_IDIR_USER)) {
    //   return;
    // }

    const response = await performQuery(createUserMutation, {}, req);
    console.log('response', response);
    if (response.errors) {
      throw new Error(
        `Failed to create user from session:\n${response.errors.join('\n')}`
      );
    }
  };
};

export default createUserMiddleware;
