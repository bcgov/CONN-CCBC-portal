import { renderHook } from '@testing-library/react-hooks';
import useEmailNotification from 'lib/helpers/useEmailNotification';
import reportClientError from 'lib/helpers/reportClientError';

jest.mock('lib/helpers/reportClientError');
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

  it('should call reportClientError if fetch fails', async () => {
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

    expect(reportClientError).toHaveBeenCalled();
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

  it('should call reportClientError if fetch fails', async () => {
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

    expect(reportClientError).toHaveBeenCalled();
  });
});
