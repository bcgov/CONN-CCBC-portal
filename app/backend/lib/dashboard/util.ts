import formatMoney from '../../../utils/formatMoney';

export const handleCbcCommunities = (cbcCommunities) => {
  const economicRegions = new Set<string>();
  const regionalDistricts = new Set<string>();
  const bcGeographicNames = new Set<string>();
  const bcGeographicIds = new Set<string>();

  cbcCommunities.forEach((community) => {
    const sourceData = community.communitiesSourceDataByCommunitiesSourceDataId;
    if (sourceData) {
      economicRegions.add(sourceData.economicRegion);
      regionalDistricts.add(sourceData.regionalDistrict);
      bcGeographicNames.add(sourceData.bcGeographicName);
      bcGeographicIds.add(sourceData.geographicNameId);
    }
  });

  return {
    economicRegions: Array.from(economicRegions),
    regionalDistricts: Array.from(regionalDistricts),
    bcGeographicNames: Array.from(bcGeographicNames),
    bcGeographicIds: Array.from(bcGeographicIds),
    totalCount: cbcCommunities.length,
  };
};

export const handleCcbcCommunities = (ccbcCommunities) => {
  if (!ccbcCommunities) {
    return null;
  }
  return ccbcCommunities.map((community) => ({
    name: community.name,
    id: community.id,
  }));
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
      return 'Not Selected';
    case 'applicant_complete':
      return 'Complete';
    case 'applicant_conditionally_approved':
      return 'Conditionally Approved';
    case 'applicant_on_hold':
      return 'On Hold';
    case 'applicant_received':
      return 'Received';
    case 'applicant_merged':
      return 'Merged';
    case 'assessment':
      return 'Assessment';
    case 'cancelled':
      return 'Cancelled';
    case 'received':
      return 'Received';
    case 'submitted':
      return 'Submitted';
    case 'screening':
      return 'Screening';
    case 'withdrawn':
      return 'Withdrawn';
    case 'conditionally_approved':
      return 'Conditionally Approved';
    case 'merged':
      return 'Merged';
    case 'approved':
      return 'Agreement Signed';
    case 'on_hold':
      return 'On Hold';
    case 'closed':
      return 'Not Selected';
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

export const handleLastMileSpeed = (status): number => {
  if (
    status === 'conditionally_approved' ||
    status === 'approved' ||
    status === 'applicant_approved' ||
    status === 'applicant_conditionally_approved' ||
    status === 'merged' ||
    status === 'applicant_merged' ||
    status === 'applicant_complete' ||
    status === 'complete'
  ) {
    return 50;
  }
  return null;
};

export const getFnhaValue = (data) => {
  if (data?.fnhaFunding && data.fnhaFunding !== 0) {
    return data.fnhaFunding;
  }
  if (data?.fnhaContribution && data.fnhaContribution !== '0') {
    return Number(data.fnhaContribution);
  }
  return null;
};

export const getSortedZones = (zones?: number[] | null) =>
  Array.isArray(zones) ? [...zones].sort((a, b) => a - b) : zones;
