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
      return 'Reporting Complete';
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
    case 'transport':
      return 'Transport';
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
  // Column names mapping (index to name)
  const columnNames = [
    'Program',
    'Announced by BC/ISED',
    'Change Request Pending',
    'Project Complete',
    'Phase',
    'Project #',
    'Federal Project #',
    'Applicant',
    'Project Title',
    'Economic Region',
    'BC/ISED Funded',
    '$830M Funding',
    'Federal Funding Source',
    'Status',
    '% Project Milestone Complete',
    'Project Milestone Completion Date',
    'Project Description',
    'Conditional Approval Letter Sent to Applicant',
    'Binding Agreement Signed',
    'Project Type',
    'BC Funding Requested',
    'Federal Funding Requested',
    'FNHA Funding',
    'Applicant Amount',
    'Other Funding Requested',
    'Total Project Budget',
    'Communities and Locales Total Count',
    'Indigenous Communities',
    'Project Locations',
    'Household Count',
    'Transport km',
    'Highway km',
    'Rest Areas',
    'Connected Coast Network Dependent',
    'Proposed Start Date',
    'Date Conditionally Approved',
    'Proposed Completion Date',
    'Date Announced',
    'Primary News Release',
    'Secondary News Release',
  ];

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

    const changes = [];

    const updatedRow = row.map((item, colIndex) => {
      const item2 = matchingRowInArray2[colIndex];

      // Skip the changelog column itself (last column) from comparison
      if (colIndex === row.length - 1) {
        // Return placeholder for now, will be replaced with actual changelog
        return { ...item };
      }

      // Helper function to normalize values for comparison (remove all spaces)
      const normalizeValue = (val) => {
        if (val === null || val === undefined) return null;
        if (typeof val === 'string') return val.replace(/\s/g, '');
        return val;
      };

      const normalizedValue1 = normalizeValue(item?.value);
      const normalizedValue2 = normalizeValue(item2?.value);

      if (normalizedValue1 !== normalizedValue2) {
        // Track the change for the changelog
        const columnName = columnNames[colIndex] || `Column ${colIndex + 1}`;
        let oldValue =
          item2?.value === null || item2?.value === undefined
            ? 'Null'
            : item2.value;
        let newValue =
          item?.value === null || item?.value === undefined
            ? 'Null'
            : item.value;
        // Show "Blank" instead of empty string for clarity
        if (oldValue === '') {
          oldValue = 'Blank';
        }
        if (newValue === '') {
          newValue = 'Blank';
        }
        changes.push(`${columnName}: ${oldValue} -> ${newValue}`);

        return {
          ...item,
          backgroundColor: '#2FA7DD',
        };
      }

      return { ...item };
    });

    // Replace the last column with the generated changelog
    const changelogValue = changes.length > 0 ? changes.join('\n') : '';
    updatedRow[updatedRow.length - 1] = { value: changelogValue };

    return updatedRow;
  });
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

// Function to determine funding source based on the specified business logic
// Same logic as AllDashboard.tsx getFundingSource
export const getFundingSource = (application: any): string => {
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
    const cbcStatus = analystStatus || externalStatus;
    const status = cbcStatus.toLowerCase();
    const bcFunding = bcFundingRequested || 0;
    const federalFunding = federalFundingRequested || 0;

    if (status === 'withdrawn') {
      return 'N/A';
    }

    if (status === 'conditionally approved') {
      return 'TBD';
    }

    if (status === 'agreement signed' || status === 'reporting complete') {
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
  const status = analystStatus;

  if (status === 'closed' || status === 'withdrawn' || status === 'analyst_withdrawn') {
    return 'N/A';
  }

  const earlyStageStatuses = [
    'received',
    'screening',
    'assessment',
    'recommendation',
    'conditionally_approved',
    'merged',
    'on_hold',
  ];

  if (earlyStageStatuses.includes(status)) {
    return 'TBD';
  }

  const postAgreementStatuses = [
    'approved', // agreement signed
    'complete', // reporting complete
    'cancelled',
  ];

  if (postAgreementStatuses.includes(status)) {
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
