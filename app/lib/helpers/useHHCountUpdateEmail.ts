import * as Sentry from '@sentry/nextjs';

const useHHCountUpdateEmail = () => {
  const notifyHHCountUpdate = async (
    newData: any,
    oldData: any,
    applicationId: string,
    params: any
  ) => {
    const fieldsChanged = {
      ...(oldData?.numberOfHouseholds !== newData?.numberOfHouseholds && {
        'Eligible Households': {
          old: oldData?.numberOfHouseholds,
          new: newData?.numberOfHouseholds,
        },
      }),
      ...(oldData?.householdsImpactedIndigenous !==
        newData?.householdsImpactedIndigenous && {
        'Households on Indigenous lands impacted': {
          old: oldData?.householdsImpactedIndigenous,
          new: newData?.householdsImpactedIndigenous,
        },
      }),
    };

    if (Object.keys(fieldsChanged).length === 0) return;
    fetch('/api/email/householdCountUpdate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        applicationId,
        host: window.location.origin,
        params: {
          ...params,
          fieldsChanged,
        },
      }),
    }).then((response) => {
      if (!response.ok) {
        Sentry.captureException({
          name: 'Email sending failed',
          message: response,
        });
      }
      return response.json();
    });
  };

  return { notifyHHCountUpdate };
};

export default useHHCountUpdateEmail;
