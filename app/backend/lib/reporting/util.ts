export const convertStatus = (status: string): string => {
  switch (status) {
    case 'conditionally_approved':
      return 'Conditionally Approved';
    case 'approved':
      return 'Agreement Signed';
    case 'on_hold':
      return 'On Hold';
    case 'closed':
      return 'Not selected';
    case 'recommendation':
      return 'Recommendation';
    case 'complete':
      return 'Complete';
    default:
      return status;
  }
};

export const findPrimaryAnnouncement = (announcements: any): any => {
  const primaryAnnouncement = announcements.nodes.find(
    (announcement: any) => announcement.isPrimary
  );
  return (
    primaryAnnouncement?.announcementByAnnouncementId?.jsonData
      ?.announcementUrl || null
  );
};

export const findSecondaryAnnouncement = (announcements: any): any => {
  const secondaryAnnouncement = announcements.nodes.find(
    (announcement: any) => !announcement.isPrimary
  );
  return (
    secondaryAnnouncement?.announcementByAnnouncementId?.jsonData
      ?.announcementUrl || null
  );
};

export const findPrimaryAnnouncementDate = (announcements: any): any => {
  const primaryAnnouncement = announcements.nodes.find(
    (announcement: any) => announcement.isPrimary
  );
  return (
    primaryAnnouncement?.announcementByAnnouncementId?.jsonData
      ?.announcementDate || null
  );
};

export const handleProjectType = (projectType: string): string => {
  switch (projectType) {
    case 'lastMile':
      return 'Last Mile';
    case 'lastMileAndTransport':
      return 'Last Mile & Transport';
    default:
      return null;
  }
};

export const getHouseholdCount = (sowTab1: any, application: any): string => {
  if (sowTab1?.jsonData?.numberOfHouseholdsSow) {
    return sowTab1.jsonData.numberOfHouseholdsSow;
  }
  return application?.benefits?.numberOfHouseholds;
};

export const getTotalProjectBudget = (
  sowTab7: any,
  applicationTotalProjectBudget: any
): string => {
  if (sowTab7?.jsonData?.summaryTable?.totalProjectCost) {
    return sowTab7?.jsonData?.summaryTable?.totalProjectCost;
  }
  return applicationTotalProjectBudget;
};

export const convertBoolean = (value): string => {
  if (value === null || value === undefined) return null;
  return value ? 'YES' : 'NO';
};

export const cleanDateTime = (date: string): string => {
  if (!date) return null;
  const splitDate = date.split('T');
  return splitDate[0];
};

export const compareAndMarkArrays = (array1: any, array2: any) => {
  // Convert array2 to a map for quick look-up by ID
  const idToArray2Map = new Map();

  array2.forEach((row) => {
    const id = row[5]?.value;
    if (id !== undefined || id !== null) {
      idToArray2Map.set(id, row);
    }
  });

  // Create a new array with marked differences
  return array1.map((row, rowIndex) => {
    // Skip header rows
    if (rowIndex < 2) {
      return row;
    }

    const id = row[5].value;
    const matchingRowInArray2 = idToArray2Map.get(id);

    if (!matchingRowInArray2) {
      return row;
    }

    return row.map((item, colIndex) => {
      const item2 = matchingRowInArray2[colIndex];

      if (item?.value !== item2?.value) {
        return {
          ...item,
          backgroundColor: '#2FA7DD',
        };
      }

      return { ...item };
    });
  });
};

export const handleCcbcEconomicRegions = (
  applicationId: Number,
  economicRegionNodes: {
    applicationId: Number;
    er: string;
    ccbcNumber: string;
  }[]
): string | null => {
  const match = economicRegionNodes?.find(
    (node) => node.applicationId === applicationId
  );
  return match?.er || null;
};

export const handleCbcEconomicRegions = (communityNodes: any[]): string => {
  const regions = [];
  communityNodes?.forEach((node) => {
    if (node?.communitiesSourceDataByCommunitiesSourceDataId?.economicRegion) {
      if (
        !regions.includes(
          node?.communitiesSourceDataByCommunitiesSourceDataId?.economicRegion
        )
      ) {
        regions.push(
          node?.communitiesSourceDataByCommunitiesSourceDataId?.economicRegion
        );
      }
    }
  });
  if (regions.length === 0) {
    return null;
  }
  return regions.join(', ');
};

export const getCCBCIntakeNumber = (application): string => {
  if (application?.ccbcNumber?.includes('000074')) return '';
  return application?.intakeNumber;
};

export const getCCBCFederalFundingSource = (application: any): string => {
  const isedMinisterApproved =
    application?.conditionalApproval?.jsonData?.isedDecisionObj
      ?.isedDecision === 'Approved';
  const applicationApproved = [
    'conditionally_approved',
    'approved',
    'applicant_approved',
    'applicant_conditionally_approved',
    'applicant_complete',
    'complete',
  ].includes(application?.status);

  return applicationApproved && isedMinisterApproved ? 'ISED-UBF Core' : '';
};
