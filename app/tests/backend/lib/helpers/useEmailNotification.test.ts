import { renderHook } from '@testing-library/react';
import useEmailNotification from 'lib/helpers/useEmailNotification';
import * as Sentry from '@sentry/nextjs';

jest.mock('@sentry/nextjs');
const mockResponse = {
  ok: true,
  json: async () => ({}),
};
global.fetch = jest.fn().mockResolvedValue(mockResponse);

describe('notifyHHCountUpdate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not call fetch if no fields changed', async () => {
    const { result } = renderHook(() => useEmailNotification());

    await result.current.notifyHHCountUpdate(
      { numberOfHouseholds: 10, householdsImpactedIndigenous: 5 },
      { numberOfHouseholds: 10, householdsImpactedIndigenous: 5 },
      '12345',
      {}
    );

    expect(fetch).not.toHaveBeenCalled();
  });

  it('should call email notification if fields have changed', async () => {
    const { result } = renderHook(() => useEmailNotification());

    await result.current.notifyHHCountUpdate(
      { numberOfHouseholds: 10, householdsImpactedIndigenous: 5 },
      { numberOfHouseholds: 8, householdsImpactedIndigenous: 4 },
      '12345',
      {}
    );

    expect(fetch).toHaveBeenCalledWith('/api/email/householdCountUpdate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationId: '12345',
        host: window.location.origin,
        params: {
          fieldsChanged: {
            'Eligible Households': { old: 8, new: 10 },
            'Households on Indigenous lands impacted': { old: 4, new: 5 },
          },
        },
      }),
    });
  });

  it('should call Sentry.captureException if fetch fails', async () => {
    const mockResponseFail = {
      ok: false,
      json: async () => ({}),
    };
    global.fetch = jest.fn().mockResolvedValueOnce(mockResponseFail);

    const { result } = renderHook(() => useEmailNotification());

    await result.current.notifyHHCountUpdate(
      { numberOfHouseholds: 10, householdsImpactedIndigenous: 5 },
      { numberOfHouseholds: 8, householdsImpactedIndigenous: 4 },
      '12345',
      {}
    );

    expect(Sentry.captureException).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Email sending failed',
        message: expect.anything(),
      })
    );
  });
});

describe('notifyDocumentUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call email notification when called', async () => {
    const mockResponseSuccess = {
      ok: true,
      json: async () => ({}),
    };
    global.fetch = jest.fn().mockResolvedValueOnce(mockResponseSuccess);

    const { result } = renderHook(() => useEmailNotification());

    await result.current.notifyDocumentUpload('12345', {
      ccbcNumber: 'CCBC-10001',
      documentType: 'Claim & Progress Report',
      documentNames: ['sow.xls'],
    });

    expect(fetch).toHaveBeenCalledWith('/api/email/notifyDocumentUpload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.anything(),
    });
  });

  it('should call Sentry.captureException if fetch fails', async () => {
    const mockResponseFail = {
      ok: false,
      json: jest.fn().mockResolvedValue({}),
    };
    global.fetch = jest.fn().mockResolvedValueOnce(mockResponseFail);

    const { result } = renderHook(() => useEmailNotification());

    await result.current.notifyDocumentUpload('12345', {
      ccbcNumber: 'CCBC-10001',
      documentType: 'Claim & Progress Report',
      documentNames: ['sow.xls'],
    });

    expect(Sentry.captureException).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Error sending email to notify Claim & Progress Report upload',
        message: expect.anything(),
      })
    );
  });
});
