/**
 * @jest-environment node
 */
import { pgPool } from 'backend/lib/setup-pg';
import { createLightship, Lightship } from 'lightship';
import type { Pool } from 'pg';
import readinessTests from '../../../backend/lib/readinessTests';

jest.mock('../../../backend/lib/s3client', () => {
  return {
    getSignedUrlPromise: () => {
      return new Promise((resolve) => {
        resolve('fake_signed_url');
      });
    },
  };
});

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

jest.mock('lightship', () => {
  return {
    createLightship: () => {
      return {
        signalReady: jest.fn(),
        signalNotReady: jest.fn(),
      } as unknown as Lightship;
    },
  };
});

// jest.setTimeout(1000);

describe('Readiness Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('gets query successfully', async () => {
    const lightship = createLightship();
    await readinessTests(pgPool, lightship);
    expect(pgPool.connect).toHaveBeenCalledOnce();
    expect(lightship.signalReady).toHaveBeenCalledOnce();
  });
  it('fails to get query', async () => {
    const lightship = createLightship();
    const asdf = {
      connect: jest.fn().mockRejectedValue('RejectedValue'),
    };
    await expect(readinessTests(asdf as unknown as Pool, lightship)).toReject();
    expect(lightship.signalReady).toHaveBeenCalledTimes(0);
    expect(lightship.signalNotReady).toHaveBeenCalledOnce();
  });
});
