import formatMoney from '../../../utils/formatMoney';
import statusStyles from '../../../data/statusStyles';

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
      return 'Reporting Complete';
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
      return 'Reporting Complete';
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

export const handleLastMileSpeed = (status: string, sowData: any): number => {
  if (!sowData) return null;

  const LAST_MILE_FIELDS = [
    'lastMileFibre',
    'lastMileCable',
    'lastMileDSL',
    'lastMileMobileWireless',
    'lastMileFixedWireless',
    'lastMileSatellite',
  ];

  const APPROVED_STATUSES = new Set([
    'conditionally_approved',
    'approved',
    'applicant_approved',
    'applicant_conditionally_approved',
    'applicant_complete',
    'complete',
  ]);

  const hasLastMileTechnology = LAST_MILE_FIELDS.some(
    (field) => sowData[field] === true
  );
  const isProjectApproved = APPROVED_STATUSES.has(status);

  return hasLastMileTechnology && isProjectApproved ? 50 : null;
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

export const normalizeStatusName = (status?: string) => {
  return statusStyles[status]?.description;
};

// Determine funding source based on status and funding data
export const getFundingSource = (application) => {
  const {
    analystStatus,
    externalStatus,
    applicationSowDataByApplicationId,
    program,
    bcFundingRequested,
    federalFundingRequested,
  } = application;

  if (program === 'CBC') {
    // CBC logic
    const internalStatus = normalizeStatusName(analystStatus || externalStatus);
    const bcFunding = bcFundingRequested || 0;
    const federalFunding = federalFundingRequested || 0;

    if (internalStatus === 'Withdrawn') {
      return 'N/A';
    }

    if (internalStatus === 'Conditionally Approved') {
      return 'TBD';
    }

    if (
      internalStatus === 'Agreement signed' ||
      internalStatus === 'Reporting complete'
    ) {
      if (bcFunding > 0 && (federalFunding === 0 || federalFunding == null)) {
        return 'BC';
      }
      if ((bcFunding === 0 || bcFunding == null) && federalFunding > 0) {
        return 'ISED';
      }
      if (bcFunding > 0 && federalFunding > 0) {
        return 'BC & ISED';
      }
      if (
        (bcFunding === 0 || bcFunding == null) &&
        (federalFunding === 0 || federalFunding == null)
      ) {
        return 'TBD';
      }
    }

    return 'TBD';
  }

  // CCBC logic
  const internalStatus = normalizeStatusName(analystStatus);

  if (internalStatus === 'Not selected' || internalStatus === 'Withdrawn') {
    return 'N/A';
  }

  const earlyStageStatuses = [
    'Received',
    'Screening',
    'Assessment',
    'Recommendation',
    'Conditionally approved',
    'Merged',
    'On Hold',
  ];

  if (earlyStageStatuses.includes(internalStatus)) {
    return 'TBD';
  }

  const postAgreementStatuses = [
    'Agreement signed',
    'Reporting complete',
    'Cancelled',
  ];

  if (postAgreementStatuses.includes(internalStatus)) {
    // Check if SOW is uploaded
    const hasSowData = applicationSowDataByApplicationId?.totalCount > 0;
    if (!hasSowData) {
      return 'TBD';
    }

    // Get BC and Federal funding from SOW data
    const sowData =
      applicationSowDataByApplicationId?.nodes[0]?.sowTab7SBySowId?.nodes[0]
        ?.jsonData?.summaryTable;
    const bcFunding = sowData?.amountRequestedFromProvince || 0;
    const federalFunding = sowData?.amountRequestedFromFederalGovernment || 0;

    if (bcFunding > 0 && (federalFunding === 0 || federalFunding == null)) {
      return 'BC';
    }
    if ((bcFunding === 0 || bcFunding == null) && federalFunding > 0) {
      return 'ISED';
    }
    if (bcFunding > 0 && federalFunding > 0) {
      return 'BC & ISED';
    }
    if (
      (bcFunding === 0 || bcFunding == null) &&
      (federalFunding === 0 || federalFunding == null)
    ) {
      return 'TBD';
    }
  }

  return 'TBD';
};
