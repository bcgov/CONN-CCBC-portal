import * as Sentry from '@sentry/nextjs';

const useRfiCoverageMapKmzUploadedEmail = () => {
  const notifyRfiCoverageMapKmzUploaded = async (
    rfiDataByRowId,
    rfiFormData,
    applicationId,
    ccbcNumber,
    rfiNumber,
    organizationName = null
  ) => {
    const originalGeoCoverageMap =
      rfiDataByRowId?.jsonData?.rfiAdditionalFiles?.geographicCoverageMap || [];
    const newGeoCoverageMap =
      rfiFormData?.rfiAdditionalFiles?.geographicCoverageMap || [];
    const originalSet = new Set(originalGeoCoverageMap.map((k) => k.uuid));
    const changes = newGeoCoverageMap.filter((k) => !originalSet.has(k.uuid));
    // only send new emails if the actual coverage map has changed
    // as a save can occur without modification or only modification to other fields
    if (changes.length > 0) {
      const commonEmailObject = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId,
          host: window.location.origin,
          ccbcNumber,
          rfiFormData,
          rfiNumber,
          changes,
          organizationName,
        }),
      };
      fetch(
        '/api/email/notifyRfiCoverageMapKmzUploaded',
        commonEmailObject
      ).then((r) => {
        if (!r.ok) {
          Sentry.captureException({
            name: 'Email sending Agreement Signed Data Team failed',
            message: r,
          });
        }
        return r.json();
      });
    }
  };
  return { notifyRfiCoverageMapKmzUploaded };
};

export default useRfiCoverageMapKmzUploadedEmail;
