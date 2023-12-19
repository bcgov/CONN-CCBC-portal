// import { mocked } from 'jest-mock';
import getIntakeId from '../../../backend/lib/intakeId';
import { performQuery } from '../../../backend/lib/graphql';

jest.mock('../../../backend/lib/graphql', () => ({
  performQuery: jest.fn(),
}));

describe('getIntakeId', () => {
  it('should return the correct intake ID', async () => {
    performQuery.mockResolvedValue({
      data: {
        allIntakes: {
          nodes: [
            {
              rowId: 1,
            },
          ],
        },
      },
    });

    const mockReq = {
      params: {
        intake: '1',
      },
    };

    const result = await getIntakeId(mockReq);

    expect(result).toBe(1);
  });

  it('should throw an error on failed query', async () => {
    // Set up the performQuery mock implementation
    performQuery.mockResolvedValue({
      errors: [
        {
          name: 'Test error',
          message: 'Test error',
          locations: [],
          path: [],
          nodes: [],
          source: null,
          positions: null,
          originalError: null,
          extensions: null,
        },
      ],
      data: null,
    });

    const mockReq = {
      params: {
        intake: '1',
      },
    };

    // Assertions for the thrown error
    await expect(getIntakeId(mockReq)).rejects.toThrow(
      'Failed to retrieve intake data:\n[object Object]'
    );
  });
});
