import { RJSFSchema } from '@rjsf/utils';
/**
 * @param schema A valid JSON schema
 * @returns an array of the the schema properties with the following structure:
 * [ [<section title>, <section schema>] ]
 */
export const schemaToSubschemasArray = (
  schema: RJSFSchema
): [string, unknown][] => {
  return Object.entries(schema.properties as any);
};

/**
 *
 * @param schema Any json schema
 * @param uiSchema The uiSchema that could apply to the schema, can contain more fields than the schema
 */
export const getFilteredSchemaOrderFromUiSchema = (
  schema: any,
  uiSchema: any
) => {
  return uiSchema['ui:order'].filter((formName) => {
    return Object.hasOwn(schema.properties, formName);
  });
};

export const getSectionNameFromPageNumber = (
  uiSchema,
  pageNumber: number
): keyof typeof uiSchema => {
  return uiSchema['ui:order'][pageNumber - 1] as keyof typeof uiSchema;
};

export const createCbcSchemaData = (jsonData) => {
  if (jsonData === null || jsonData === undefined) {
    return {
      tombstone: null,
      projectType: null,
      locationsAndCounts: null,
      funding: null,
      eventsAndDates: null,
      miscellaneous: null,
      projectDataReviews: null,
    };
  }

  const tombstone = {
    projectNumber: jsonData.projectNumber,
    originalProjectNumber: jsonData.originalProjectNumber,
    phase: jsonData.phase,
    intake: jsonData.intake,
    projectStatus: jsonData.projectStatus,
    changeRequestPending: jsonData.changeRequestPending,
    projectTitle: jsonData.projectTitle,
    projectDescription: jsonData.projectDescription,
    applicantContractualName: jsonData.applicantContractualName,
    currentOperatingName: jsonData.currentOperatingName,
    eightThirtyMillionFunding: jsonData.eightThirtyMillionFunding,
    federalFundingSource: jsonData.federalFundingSource,
    federalProjectNumber: jsonData.federalProjectNumber,
  };

  const projectType = {
    projectType: jsonData.projectType,
    transportProjectType: jsonData.transportProjectType,
    highwayProjectType: jsonData.highwayProjectType,
    lastMileProjectType: jsonData.lastMileProjectType,
    lastMileMinimumSpeed: jsonData.lastMileMinimumSpeed,
    connectedCoastNetworkDependant: jsonData.connectedCoastNetworkDependant,
  };
  const locationsAndCounts = {
    projectLocations: jsonData.projectLocations,
    communitiesAndLocalesCount: jsonData.communitiesAndLocalesCount,
    indigenousCommunities: jsonData.indigenousCommunities,
    householdCount: jsonData.householdCount,
    transportKm: jsonData.transportKm,
    highwayKm: jsonData.highwayKm,
    restAreas: jsonData.restAreas,
  };

  const funding = {
    bcFundingRequest: jsonData.bcFundingRequest,
    federalFunding: jsonData.federalFunding,
    applicantAmount: jsonData.applicantAmount,
    otherFunding: jsonData.otherFunding,
    totalProjectBudget: jsonData.totalProjectBudget,
  };

  const eventsAndDates = {
    nditConditionalApprovalLetterSent:
      jsonData.nditConditionalApprovalLetterSent,
    bindingAgreementSignedNditRecipient:
      jsonData.bindingAgreementSignedNditRecipient,
    announcedByProvince: jsonData.announcedByProvince,
    dateApplicationReceived: jsonData.dateApplicationReceived,
    dateConditionallyApproved: jsonData.dateConditionallyApproved,
    dateAgreementSigned: jsonData.dateAgreementSigned,
    proposedStartDate: jsonData.proposedStartDate,
    proposedCompletionDate: jsonData.proposedCompletionDate,
    reportingCompletionDate: jsonData.reportingCompletionDate,
    dateAnnounced: jsonData.dateAnnounced,
  };

  const miscellaneous = {
    projectMilestoneCompleted: jsonData.projectMilestoneCompleted,
    constructionCompletedOn: jsonData.constructionCompletedOn,
    milestoneComments: jsonData.milestoneComments,
    primaryNewsRelease: jsonData.primaryNewsRelease,
    secondaryNewsRelease: jsonData.secondaryNewsRelease,
    notes: jsonData.notes,
  };

  const projectDataReviews = {
    locked: jsonData.locked,
    lastReviewed: jsonData.lastReviewed,
    reviewNotes: jsonData.reviewNotes,
  };

  const dataBySection = {
    tombstone,
    projectType,
    locationsAndCounts,
    funding,
    eventsAndDates,
    miscellaneous,
    projectDataReviews,
  };

  return dataBySection;
};
