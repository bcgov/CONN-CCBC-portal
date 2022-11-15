/**
 * @jest-environment node
 */
import importJsonSchemasToDb from 'backend/lib/importJsonSchemasToDb';
import { pgPool } from 'backend/lib/setup-pg';

jest.mock('backend/lib/setup-pg', () => {
  const mockQuery = jest.fn();
  const mockRelease = jest.fn();
  const mockConnect = jest.fn().mockImplementation(() => {
    return {
      query: mockQuery,
      release: mockRelease,
    };
  });
  return {
    pgPool: {
      connect: mockConnect,
    },
  };
});

describe('Json  importer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('test everything runs at least once', async () => {
    expect(pgPool.connect).toHaveBeenCalledTimes(0);
    await importJsonSchemasToDb();
    expect(pgPool.connect).toHaveBeenCalledOnce();
    // get the client mock
    const client = await pgPool.connect();
    expect(client.query).toHaveBeenCalledWith('begin');
    expect(client.query).toHaveBeenCalledWith('commit');
    expect(client.query).toHaveBeenCalledTimes(4);
    expect(client.release).toHaveBeenCalledOnce();
  });
});
