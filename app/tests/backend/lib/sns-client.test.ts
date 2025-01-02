/**
 * @jest-environment node
 */
import { mocked } from 'jest-mock';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import { mockClient } from 'aws-sdk-client-mock';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { pushMessage } from '../../../backend/lib/sns-client';
import getAuthRole from '../../../utils/getAuthRole';

jest.mock('../../../backend/lib/graphql');
jest.mock('../../../utils/getAuthRole');

const snsMock = mockClient(SNSClient);
jest.setTimeout(1000);

describe('SNS client', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(session({ secret: crypto.randomUUID(), cookie: { secure: true } }));
  });

  it('should receive the correct response for authorized user', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_gccbc_adminuest',
        landingRoute: '/',
      };
    });
    snsMock.on(PublishCommand).resolves({
      MessageId: '12345678-1111-2222-3333-111122223333',
    });
    const response = await pushMessage(
      'topic_arn',
      'archive_uuid',
      '[{name:"oops"}]'
    );
    expect(response.result).toBe('Success');
  });

  it('should receive the return error details', async () => {
    mocked(getAuthRole).mockImplementation(() => {
      return {
        pgRole: 'ccbc_admin',
        landingRoute: '/',
      };
    });
    snsMock.rejects('mocked rejection');

    const response = await pushMessage(
      'topic_arn',
      'archive_uuid',
      '[{name:"oops"}]'
    );
    expect(response.result.indexOf('Error') > -1).toBeTruthy();
  });

  jest.resetAllMocks();
});
