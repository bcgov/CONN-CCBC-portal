/**
 * @jest-environment node
 */
import {
  recordEmailRecord,
  getDelayedAndNonCancelledEmailRecord,
  setIsCancelledEmailRecord,
} from 'backend/lib/emails/utils/emailRecord';
import { performQuery } from 'backend/lib/graphql';

jest.mock('backend/lib/graphql');

describe('email record utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    (performQuery as jest.Mock).mockReset();
    (performQuery as jest.Mock).mockResolvedValue({});
  });

  it('should record email with input and req', async () => {
    const input = {
      emailRecord: {
        toEmail: 'test@example.com',
        subject: 'Test Email',
        body: 'This is a test email.',
      },
    };
    await recordEmailRecord(input, {} as any);
    expect(performQuery).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        input: {
          emailRecord: input.emailRecord,
        },
      }),
      expect.anything()
    );
  });

  it('should throw an error if performQuery fails', async () => {
    (performQuery as jest.Mock).mockRejectedValue(new Error('Query failed'));
    const input = {
      emailRecord: {
        toEmail: 'test@example.com',
        subject: 'Test Email',
        body: 'This is a test email.',
      },
    };
    await expect(recordEmailRecord(input, {} as any)).rejects.toThrow(
      'Query failed'
    );
  });

  it('should get email records by JSON data filter', async () => {
    await getDelayedAndNonCancelledEmailRecord(1, 'test-tag', {} as any);
    expect(performQuery).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        jsonDataFilter: {
          applicationId: 1,
          tag: 'test-tag',
          isDelayed: true,
          isCancelled: false,
        },
      }),
      expect.anything()
    );
  });
  it('should throw an error if performQuery fails for getDelayedAndNonCancelledEmailRecord', async () => {
    (performQuery as jest.Mock).mockRejectedValue(new Error('Query failed'));
    await expect(
      getDelayedAndNonCancelledEmailRecord(1, 'test-tag', {} as any)
    ).rejects.toThrow('Query failed');
  });

  it('should set isCancelled for email record', async () => {
    const rowId = 1;
    const jsonData = { isCancelled: true };
    await setIsCancelledEmailRecord(rowId, jsonData, {} as any);
    expect(performQuery).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        rowId,
        jsonData,
      }),
      expect.anything()
    );
  });
  it('should throw an error if performQuery fails for setIsCancelledEmailRecord', async () => {
    (performQuery as jest.Mock).mockRejectedValue(new Error('Query failed'));
    await expect(
      setIsCancelledEmailRecord(1, { isCancelled: true }, {} as any)
    ).rejects.toThrow('Query failed');
  });
});
