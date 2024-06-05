import useRfiCoverageMapKmzUploadedEmail from 'lib/helpers/useRfiCoverageMapKmzUploadedEmail';

// Mock the fetch API
global.fetch = jest.fn() as jest.Mock;

describe('useRfiCoverageMapKmzUploadedEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockData = {
    rfiDataByRowId: {
      jsonData: {
        rfiAdditionalFiles: {
          geographicCoverageMap: [{ uuid: '1' }, { uuid: '2' }],
        },
      },
    },
    rfiFormData: {
      rfiAdditionalFiles: {
        geographicCoverageMap: [{ uuid: '1' }, { uuid: '3' }],
      },
    },
    applicationId: '1',
    ccbcNumber: 'CCBC-123',
    rfiNumber: 'RFI-123',
    organizationName: 'Test Organization',
  };

  it('should send an email if the geographic coverage map has changed', async () => {
    const { notifyRfiCoverageMapKmzUploaded } =
      useRfiCoverageMapKmzUploadedEmail();

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({}),
    });

    await notifyRfiCoverageMapKmzUploaded(
      mockData.rfiDataByRowId,
      mockData.rfiFormData,
      mockData.applicationId,
      mockData.ccbcNumber,
      mockData.rfiNumber,
      mockData.organizationName
    );

    expect(fetch).toHaveBeenCalledWith(
      '/api/email/notifyRfiCoverageMapKmzUploaded',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.any(String),
      })
    );
    const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
    expect(body).toMatchObject({
      applicationId: mockData.applicationId,
      host: window.location.origin,
      ccbcNumber: mockData.ccbcNumber,
      rfiFormData: mockData.rfiFormData,
      rfiNumber: mockData.rfiNumber,
      changes: [{ uuid: '3' }],
      organizationName: mockData.organizationName,
    });
  });

  it('should not send an email if the geographic coverage map has not changed', async () => {
    const { notifyRfiCoverageMapKmzUploaded } =
      useRfiCoverageMapKmzUploadedEmail();

    const rfiFormDataNoChange = {
      ...mockData.rfiFormData,
      rfiAdditionalFiles: {
        geographicCoverageMap: [{ uuid: '1' }, { uuid: '2' }],
      },
    };

    await notifyRfiCoverageMapKmzUploaded(
      mockData.rfiDataByRowId,
      rfiFormDataNoChange,
      mockData.applicationId,
      mockData.ccbcNumber,
      mockData.rfiNumber,
      mockData.organizationName
    );

    expect(fetch).not.toHaveBeenCalled();
  });
});
