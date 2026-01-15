/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import { postgraphile } from 'postgraphile';
import config from '../../../../config';

jest.mock('../../../../config');

jest.mock('postgraphile');

describe('the authenticationPgSettings function', () => {
  it('returns the hashFromPayload option', () => {
    mocked(config.get).mockImplementation((name: any) => {
      const mockConfig = {
        OPENSHIFT_APP_NAMESPACE: 'test-dev',
        PGSCHEMA: 'ccbc_public',
      };
      return mockConfig[name] as any;
    });

    let postgraphileMiddleware;
    jest.isolateModules(() => {
      // eslint-disable-next-line global-require
      postgraphileMiddleware = require('backend/lib/graphql').default;
    });

    postgraphileMiddleware();

    expect(mocked(postgraphile)).toHaveBeenCalledWith(
      expect.anything(),
      'ccbc_public',
      expect.objectContaining({
        hashFromPayload: expect.any(Function),
      })
    );
  });

  it('returns the correct options for non-production', () => {
    mocked(config.get).mockImplementation((name: any) => {
      const mockConfig = {
        OPENSHIFT_APP_NAMESPACE: 'test-dev',
        PGSCHEMA: 'ccbc_public',
      };
      return mockConfig[name] as any;
    });

    let postgraphileMiddleware;
    jest.isolateModules(() => {
      // eslint-disable-next-line global-require
      postgraphileMiddleware = require('backend/lib/graphql').default;
    });

    postgraphileMiddleware();

    expect(mocked(postgraphile)).toHaveBeenCalledWith(
      expect.anything(),
      'ccbc_public',
      expect.objectContaining({
        extendedErrors: ['hint', 'detail', 'errcode'],
        showErrorStack: 'json',
      })
    );
  });

  it('does not enable graphiql if NODE_ENV is set to production', () => {
    mocked(config.get).mockImplementation((name: any) => {
      const mockConfig = {
        OPENSHIFT_APP_NAMESPACE: 'test-prod',
        PGSCHEMA: 'ccbc_public',
        NODE_ENV: 'production',
      };
      return mockConfig[name] as any;
    });

    let postgraphileMiddleware;
    jest.isolateModules(() => {
      // eslint-disable-next-line global-require
      postgraphileMiddleware = require('backend/lib/graphql').default;
    });

    postgraphileMiddleware();

    expect(mocked(postgraphile)).toHaveBeenCalledWith(
      expect.anything(),
      'ccbc_public',
      expect.not.objectContaining({
        graphiql: true,
        enhanceGraphiql: true,
        allowExplain: true,
      })
    );
  });
});
