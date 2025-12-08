// Function to map CBC record keys to their sections based on createCbcSchemaData structure
const getCbcSectionFromKey = (key: string): string => {
  // Mapping based on createCbcSchemaData function in utils/schemaUtils.ts
  const sectionMapping = {
    // Tombstone section
    projectNumber: 'Tombstone',
    originalProjectNumber: 'Tombstone',
    phase: 'Tombstone',
    intake: 'Tombstone',
    projectStatus: 'Tombstone',
    changeRequestPending: 'Tombstone',
    projectTitle: 'Tombstone',
    projectDescription: 'Tombstone',
    applicantContractualName: 'Tombstone',
    currentOperatingName: 'Tombstone',
    eightThirtyMillionFunding: 'Tombstone',
    federalFundingSource: 'Tombstone',
    federalProjectNumber: 'Tombstone',

    // Project Type section
    projectType: 'Project Type',
    transportProjectType: 'Project Type',
    highwayProjectType: 'Project Type',
    lastMileProjectType: 'Project Type',
    lastMileMinimumSpeed: 'Project Type',
    connectedCoastNetworkDependant: 'Project Type',

    // Locations section
    projectLocations: 'Locations',
    zones: 'Locations',
    communitySourceData: 'Locations',
    geographicNames: 'Locations',
    regionalDistricts: 'Locations',
    economicRegions: 'Locations',
    cbcCommunitiesData: 'Locations',

    // Locations and Counts section
    communitiesAndLocalesCount: 'Locations and Counts',
    indigenousCommunities: 'Locations and Counts',
    householdCount: 'Locations and Counts',
    transportKm: 'Locations and Counts',
    highwayKm: 'Locations and Counts',
    restAreas: 'Locations and Counts',

    // Funding section
    bcFundingRequested: 'Funding',
    federalFundingRequested: 'Funding',
    applicantAmount: 'Funding',
    otherFundingRequested: 'Funding',
    totalProjectBudget: 'Funding',

    // Events and Dates section
    conditionalApprovalLetterSent: 'Events and Dates',
    agreementSigned: 'Events and Dates',
    announcedByProvince: 'Events and Dates',
    dateApplicationReceived: 'Events and Dates',
    dateConditionallyApproved: 'Events and Dates',
    dateAgreementSigned: 'Events and Dates',
    proposedStartDate: 'Events and Dates',
    proposedCompletionDate: 'Events and Dates',
    reportingCompletionDate: 'Events and Dates',
    dateAnnounced: 'Events and Dates',

    // Miscellaneous section
    projectMilestoneCompleted: 'Miscellaneous',
    constructionCompletedOn: 'Miscellaneous',
    milestoneComments: 'Miscellaneous',
    primaryNewsRelease: 'Miscellaneous',
    secondaryNewsRelease: 'Miscellaneous',
    childProjects: 'Miscellaneous',
    notes: 'Miscellaneous',

    // Project Data Reviews section
    locked: 'Project Data Reviews',
    lastReviewed: 'Project Data Reviews',
    reviewNotes: 'Project Data Reviews',

    // Community data (for added/removed communities)
    added_communities: 'Locations',
    deleted_communities: 'Locations',
  };

  return sectionMapping[key] || 'General';
};

export default getCbcSectionFromKey;
