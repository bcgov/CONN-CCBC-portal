import formatMoney from '../../../utils/formatMoney';

export const handleCbcCommunities = (cbcCommunities) => {
  const economicRegions = new Set<string>();
  const regionalDistricts = new Set<string>();
  const bcGeographicNames = new Set<string>();

  cbcCommunities.forEach((community) => {
    const sourceData = community.communitiesSourceDataByCommunitiesSourceDataId;
    if (sourceData) {
      economicRegions.add(sourceData.economicRegion);
      regionalDistricts.add(sourceData.regionalDistrict);
      bcGeographicNames.add(sourceData.bcGeographicName);
    }
  });

  return {
    economicRegions: Array.from(economicRegions),
    regionalDistricts: Array.from(regionalDistricts),
    bcGeographicNames: Array.from(bcGeographicNames),
    totalCount: cbcCommunities.length,
  };
};

export const handleCcbcCommunities = (ccbcCommunities) => {
  if (!ccbcCommunities) {
    return null;
  }
  return ccbcCommunities.map((community) => community.name);
};

export const convertStatus = (status: string): string => {
  switch (status) {
    case 'analyst_withdrawn':
      return 'Withdrawn';
    case 'applicant_approved':
      return 'Agreement Signed';
    case 'applicant_cancelled':
      return 'Cancelled';
    case 'applicant_closed':
      return 'Closed';
    case 'applicant_complete':
      return 'Complete';
    case 'applicant_conditionally_approved':
      return 'Conditionally Approved';
    case 'applicant_on_hold':
      return 'On Hold';
    case 'applicant_received':
      return 'Received';
    case 'assessment':
      return 'Assessment';
    case 'cancelled':
      return 'Cancelled';
    case 'received':
      return 'Received';
    case 'submitted':
      return 'Submitted';
    case 'withdrawn':
      return 'Withdrawn';
    case 'conditionally_approved':
      return 'Conditionally Approved';
    case 'approved':
      return 'Approved';
    case 'on_hold':
      return 'On Hold';
    case 'closed':
      return 'Closed';
    case 'recommendation':
      return 'Recommendation';
    case 'complete':
      return 'Complete';
    default:
      return status;
  }
};

export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) {
    return '';
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return '';
  }

  return formatMoney(numberValue);
};
