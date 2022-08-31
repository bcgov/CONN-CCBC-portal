import type { Request } from 'express';
import { performQuery } from './graphql';

const setCurrentDateMutation = `
mutation {
  setCurrentDate(input: {
      targetDate: "" 
  }) {
    __typename
  }
}
`;

const setCurrentDate = () => {
  return async (req: Request) => {
    const response = await performQuery(setCurrentDateMutation, {}, req);
    if (response.errors) {
      throw new Error(
        `Failed to set current date:\n${response.errors.join('\n')}`
      );
    }
  };
};

export default setCurrentDate;
