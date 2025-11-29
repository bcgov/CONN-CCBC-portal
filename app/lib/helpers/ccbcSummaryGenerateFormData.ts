import review from '../../formSchema/analyst/summary/review';
import customValidate from '../../utils/ccbcCustomValidator';

const getEconomicRegions = (economicRegions) => {
  if (!economicRegions) {
    return null;
  }
  const ers = [];
  economicRegions?.edges?.forEach((edge) => {
    ers.push(edge?.node?.er);
  });
  return ers;
};

const getRegionalDistricts = (regionalDistricts) => {
  if (!regionalDistricts) {
    return null;
  }
  const rds = [];
  regionalDistricts?.edges?.forEach((edge) => {
    rds.push(edge?.node?.rd);
  });
  return rds;
};

const handleApplicationDateReceived = (applicationData, allIntakes) => {
  // keep blank for hidden intakes
  // commenting out for now as per https://connectivitydivision.atlassian.net/browse/NDT-786
  // if (applicationData.intakeNumber === 99) {
  //   return null;
  // }
  // from intake 5 application is immediately submitted, use that date
  if (applicationData.intakeNumber >= 5) {
    return applicationData?.applicationStatusesByApplicationId?.nodes[0]
      ?.createdAt;
  }
  // otherwise find the intake matching and use the close timestamp
  const intake = allIntakes.nodes.find(
    (i) => i.ccbcIntakeNumber === applicationData.intakeNumber
  );
  return intake?.closeTimestamp;
};

const handleOtherFundingSourcesApplication = (otherFundingSources) => {
  if (!otherFundingSources) {
    return null;
  }
  let otherFundingSourcesTotal = 0;
  otherFundingSources?.otherFundingSourcesArray?.forEach((source) => {
    otherFundingSourcesTotal += source.totalRequestedFundingPartner;
  });
  // Not adding CIB funding to other funding at this time
  // if (otherFundingSources?.totalInfrastructureBankFunding) {
  //   otherFundingSourcesTotal +=
  //     otherFundingSources.totalInfrastructureBankFunding;
  // }
  return otherFundingSourcesTotal;
};

export const getConditionalApprovalDate = (conditionalApprovalData) => {
  // get the greater of the two dates
  const provincialDate = conditionalApprovalData?.decision?.ministerDate;
  const isedDate = conditionalApprovalData?.isedDecisionObj?.isedDate;
  if (!provincialDate && !isedDate) {
    return null;
  }
  if (!provincialDate) {
    if (conditionalApprovalData?.isedDecisionObj?.isedDecision === 'Approved')
      return isedDate;
  }
  if (!isedDate) {
    if (conditionalApprovalData?.decision?.ministerDecision === 'Approved')
      return provincialDate;
  }

  // if provincial date is greater than ised date
  if (new Date(provincialDate) > new Date(isedDate)) {
    // if provincial date is approved
    if (conditionalApprovalData?.decision?.ministerDecision === 'Approved') {
      return provincialDate;
    }
    // otherwise check if ised date is approved
    if (conditionalApprovalData?.isedDecisionObj?.isedDecision === 'Approved') {
      return isedDate;
    }
    // otherwise return null as none of them are approved
    return null;
  }
  // otherwise ised date is greater than provincial date
  // if ised date is approved
  if (conditionalApprovalData?.isedDecisionObj?.isedDecision === 'Approved') {
    return isedDate;
  }
  // otherwise check if provincial date is approved
  if (conditionalApprovalData?.decision?.ministerDecision === 'Approved') {
    return provincialDate;
  }
  // otherwise return null as none of them are approved
  return null;
};

const handleMilestone = (milestonePercent) => {
  if (!milestonePercent) {
    return null;
  }
  return `${Math.trunc(milestonePercent * 100)}%`;
};

const getCommunitiesTemplateNine = (communities) => {
  if (!communities) {
    return null;
  }
  const benefitingCommunities = [];
  const benefitingIndigenousCommunities = [];
  communities.forEach((community) => {
    if (community?.isIndigenous?.toUpperCase() === 'N') {
      if (community?.geoName) {
        benefitingCommunities.push({
          name: community?.geoName,
          link: community?.mapLink,
          id: community?.geoNameId,
        });
      }
    }
    if (community?.isIndigenous?.toUpperCase() === 'Y') {
      if (community?.geoName) {
        benefitingIndigenousCommunities.push({
          name: community?.geoName,
          link: community?.mapLink,
          id: community?.geoNameId,
        });
      }
    }
  });
  return {
    benefitingCommunities,
    benefitingIndigenousCommunities,
  };
};

const handleTemplateNineSource = (source) => {
  if (source?.source === 'application') {
    return 'Application - Template 9';
  }
  if (source?.source === 'rfi') {
    return `RFI ${source.rfiNumber}`;
  }
  return 'Application - Template 9';
};

const getCommunities = (communities) => {
  if (!communities) {
    return null;
  }
  const benefitingCommunities = [];
  let totalBenefitingCommunities = 0;
  const benefitingIndigenousCommunities = [];
  let totalBenefitingIndigenousCommunities = 0;
  communities.forEach((community) => {
    if (community?.indigenous?.toUpperCase() === 'N') {
      if (
        community?.bcGeoName &&
        community?.impacted?.toUpperCase() === 'YES'
      ) {
        totalBenefitingCommunities += 1;
        benefitingCommunities.push({
          name: community?.bcGeoName,
          link: community?.mapLink,
          id: community?.geoNameId,
        });
      }
    }
    if (community?.indigenous?.toUpperCase() === 'Y') {
      if (
        community?.bcGeoName &&
        community?.impacted?.toUpperCase() === 'YES'
      ) {
        totalBenefitingIndigenousCommunities += 1;
        benefitingIndigenousCommunities.push({
          name: community?.bcGeoName,
          link: community?.mapLink,
          id: community?.geoNameId,
        });
      }
    }
  });
  return {
    totalBenefitingCommunities,
    benefitingCommunities,
    totalBenefitingIndigenousCommunities,
    benefitingIndigenousCommunities,
  };
};

const getCommunitiesWithAmendmentNumber = (sowNodes: Array<any>) => {
  if (!sowNodes) {
    return null;
  }
  let communityData = null;

  sowNodes.forEach((node) => {
    if (!communityData && node) {
      const communityNames = getCommunities(
        node?.sowTab8SBySowId?.nodes[0]?.jsonData?.geoNames
      );
      communityData = {
        ...communityNames,
        amendmentNumber: node?.amendmentNumber,
      };
    }
  });
  return communityData;
};

const getFallBackFields = (applicationData, formData, communities) => {
  const template9Data =
    applicationData?.applicationFormTemplate9DataByApplicationId?.nodes[0];
  const template9MissingFallBackData = !template9Data && {
    benefitingIndigenousCommunities: 'N/A',
    benefitingCommunities: 'N/A',
    communities: 'N/A',
    indigenousCommunities: 'N/A',
    nonIndigenousCommunities: 'N/A',
  };

  const fallBackFields = {
    benefitingCommunities: !communities?.benefitingCommunities?.length
      ? 'None'
      : null,
    benefitingIndigenousCommunities: !communities
      ?.benefitingIndigenousCommunities?.length
      ? 'None'
      : null,
    economicRegions: !formData?.locations?.economicRegions?.length
      ? 'TBD'
      : null,
    regionalDistricts: !formData?.locations?.regionalDistricts?.length
      ? 'TBD'
      : null,
    // since we can get non-integers, check if it's a NaN
    totalHouseholdsImpacted: Number.isNaN(
      parseInt(formData?.counts?.totalHouseholdsImpacted, 10)
    )
      ? 'N/A'
      : null,
    numberOfIndigenousHouseholds: Number.isNaN(
      parseInt(formData?.counts?.numberOfIndigenousHouseholds, 10)
    )
      ? 'N/A'
      : null,
    ...template9MissingFallBackData,
  };

  return fallBackFields;
};

const getSowFallBackFields = (sowData, formData, communitiesData) => {
  const MissingSowFallBackData = !sowData?.length && {
    benefitingCommunities: 'TBD',
    benefitingIndigenousCommunities: 'TBD',
  };
  return {
    dateAgreementSigned: formData.eventsAndDates.dateAgreementSigned
      ? null
      : 'TBD',
    communities: Number.isInteger(formData.counts.communities) ? null : 'TBD',
    indigenousCommunities: Number.isInteger(
      formData.counts.indigenousCommunities
    )
      ? null
      : 'TBD',
    nonIndigenousCommunities: Number.isInteger(
      formData.counts.nonIndigenousCommunities
    )
      ? null
      : 'TBD',
    totalHouseholdsImpacted: Number.isInteger(
      formData.counts.totalHouseholdsImpacted
    )
      ? null
      : 'TBD',
    numberOfIndigenousHouseholds: Number.isInteger(
      formData.counts.numberOfIndigenousHouseholds
    )
      ? null
      : 'TBD',
    benefitingCommunities: !communitiesData?.benefitingCommunities?.length
      ? 'None'
      : null,
    benefitingIndigenousCommunities: !communitiesData
      ?.benefitingIndigenousCommunities?.length
      ? 'None'
      : null,
    ...MissingSowFallBackData,
  };
};
const getCommunitiesNumberWithAmendmentNumber = (sowNodes: Array<any>) => {
  if (!sowNodes) {
    return null;
  }
  let communitiesNumber = null;

  sowNodes.forEach((node) => {
    if (!communitiesNumber && node) {
      communitiesNumber = {
        communitiesNumber:
          node?.sowTab8SBySowId?.nodes[0]?.jsonData?.communitiesNumber,
        indigenousCommunitiesNumber:
          node?.sowTab8SBySowId?.nodes[0]?.jsonData
            ?.indigenousCommunitiesNumber,
        amendmentNumber: node?.amendmentNumber,
      };
    }
  });
  return communitiesNumber;
};

const getHouseholdsImpactedCountWithAmendmentNumber = (
  sowNodes: Array<any>
) => {
  if (!sowNodes) {
    return null;
  }
  let totalIndigenousHouseholds = null;

  sowNodes.forEach((node) => {
    if (!totalIndigenousHouseholds && node) {
      totalIndigenousHouseholds = {
        totalIndigenousHouseholds:
          node?.sowTab1SBySowId?.nodes[0]?.jsonData
            ?.householdsImpactedIndigenous,
        totalHouseholdsImpacted:
          node?.sowTab1SBySowId?.nodes[0]?.jsonData?.numberOfHouseholds,
        amendmentNumber: node?.amendmentNumber,
      };
    }
  });
  return totalIndigenousHouseholds;
};

const getSowErrors = (sowData, schema, formDataSource, formData) => {
  if (sowData?.length) return null;
  const errors: any = {};
  Object.entries(schema?.properties || {}).forEach(([parentKey, value]) => {
    const sectionSchema = value['properties'];
    Object.keys(sectionSchema || {}).forEach((key) => {
      if (formDataSource[key] === 'SOW') {
        errors[parentKey] = errors[parentKey] || {
          __errors: [
            'Highlighted cells are null because SOW Excel table has not been uploaded in the portal',
          ],
        };
        errors[parentKey][key] = {
          __errors: [
            'This value is informed by SOW tab 8, which has not been uploaded to the portal.',
          ],
        };
      }
    });
  });

  if (
    // undefined and a length of 0 will both be !falsy
    !formData.eventsAndDates.dateAgreementSigned?.length
  ) {
    errors.eventsAndDates = {
      dateAgreementSigned: {
        __errors: [
          'The date has not been selected on the Project page in the "Funding Agreement, Statement of Work and Map"',
        ],
      },
    };
  }

  // Custom errors for counts
  if (errors?.counts?.communities?.__errors?.length > 0) {
    errors.counts.communities.__errors = [
      'This value is informed from SOW tab 8 cell E15 which has not been uploaded to the portal.',
    ];
  }
  if (errors?.counts?.indigenousCommunities?.__errors?.length > 0) {
    errors.counts.indigenousCommunities.__errors = [
      'This value is informed from SOW tab 8 cell E16 which has not been uploaded to the portal.',
    ];
  }
  if (errors?.counts?.nonIndigenousCommunities?.__errors?.length > 0) {
    errors.counts.nonIndigenousCommunities.__errors = [
      'This value is informed from SOW tab 8 which has not been uploaded to the portal.',
    ];
  }
  if (errors?.counts?.totalHouseholdsImpacted?.__errors?.length > 0) {
    errors.counts.totalHouseholdsImpacted.__errors = [
      'This value is informed from SOW tab 1 cell H18  which has not been uploaded to the portal.',
    ];
  }
  if (errors?.counts?.numberOfIndigenousHouseholds?.__errors?.length > 0) {
    errors.counts.numberOfIndigenousHouseholds.__errors = [
      'This value is informed from SOW tab 1 cell H17  which has not been uploaded to the portal.',
    ];
  }
  return errors;
};

const validate = (data, schema) => {
  const errors: any = {};
  if (!schema?.properties) return errors;

  Object.entries(schema?.properties).forEach(
    ([key, property]: [string, any]) => {
      const fieldErrors = {};

      Object.keys(property.properties).forEach((fieldKey) => {
        // validate custom rules for fields
        const fieldErrorList = customValidate(data, key, fieldKey);

        if (fieldErrorList.length > 0) {
          fieldErrors[fieldKey] = {
            __errors: fieldErrorList,
          };
        }
      });

      if (Object.keys(fieldErrors).length > 0) {
        errors[key] = fieldErrors;
      }
    }
  );

  return errors;
};

const getApplicationErrors = (
  applicationData,
  allApplicationErs,
  allApplicationRds
) => {
  const template9Data =
    applicationData?.applicationFormTemplate9DataByApplicationId?.nodes[0];
  const formErrors = validate(
    { template9Data, applicationData, allApplicationErs, allApplicationRds },
    review
  );
  return formErrors;
};

const getFundingDataFromSow = (sowData) => {
  const summaryTable =
    sowData?.nodes[0]?.sowTab7SBySowId?.nodes[0]?.jsonData?.summaryTable;
  return {
    bcFundingRequested: summaryTable?.amountRequestedFromProvince,
    federalFunding: summaryTable?.amountRequestedFromFederalGovernment,
    fundingRequestedCcbc: summaryTable?.totalFundingRequestedCCBC,
    applicantAmount: summaryTable?.totalApplicantContribution,
    cibFunding: summaryTable?.totalInfrastructureBankFunding,
    fnhaFunding: summaryTable?.totalFNHAFunding,
    otherFunding: summaryTable?.fundingFromAllOtherSources,
    totalProjectBudget: summaryTable?.totalProjectCost,
  };
};

const handleSplitFunding = (requestedFunding) => {
  if (!requestedFunding) {
    return { bc: null, federal: null };
  }
  const halfAmount = requestedFunding / 2;

  // Rounding up for bc and down for federal
  const bc = Math.ceil(halfAmount);
  const federal = Math.floor(halfAmount);

  return { bc, federal };
};

const getFundingDataFromApplication = (applicationData) => {
  const splitFunding = handleSplitFunding(
    applicationData?.formData?.jsonData?.projectFunding
      ?.totalFundingRequestedCCBC
  );
  return {
    bcFundingRequested: splitFunding?.bc,
    federalFunding: splitFunding?.federal,
    fundingRequestedCcbc:
      applicationData?.formData?.jsonData?.projectFunding
        ?.totalFundingRequestedCCBC,
    applicantAmount:
      applicationData?.formData?.jsonData?.projectFunding
        ?.totalApplicantContribution,
    cibFunding:
      applicationData?.formData?.jsonData?.otherFundingSources
        ?.totalInfrastructureBankFunding,
    fnhaFunding: null,
    otherFunding: handleOtherFundingSourcesApplication(
      applicationData?.formData?.jsonData?.otherFundingSources
    ),
    totalProjectBudget:
      applicationData?.formData?.jsonData?.budgetDetails?.totalProjectCost,
    fnhaContribution:
      applicationData?.applicationFnhaContributionsByApplicationId?.edges[0]
        ?.node?.fnhaContribution || '0',
  };
};

const sumConditionalApprovalFunding = (
  bcFundingRequested,
  isedFundingRequested
) => {
  if (!bcFundingRequested && !isedFundingRequested) {
    return null;
  }
  if (!bcFundingRequested && isedFundingRequested) {
    return isedFundingRequested;
  }
  if (bcFundingRequested && !isedFundingRequested) {
    return bcFundingRequested;
  }
  return bcFundingRequested + isedFundingRequested;
};

const getFundingDataFromConditionalApproval = (applicationData) => {
  return {
    bcFundingRequested:
      applicationData?.conditionalApproval?.jsonData?.decision
        ?.provincialRequested,
    federalFunding:
      applicationData?.conditionalApproval?.jsonData?.isedDecisionObj
        ?.federalRequested,
    fundingRequestedCcbc: sumConditionalApprovalFunding(
      applicationData?.conditionalApproval?.jsonData?.decision
        ?.provincialRequested,
      applicationData?.conditionalApproval?.jsonData?.isedDecisionObj
        ?.federalRequested
    ),
    fnhaFunding: null,
    fnhaContribution:
      applicationData?.applicationFnhaContributionsByApplicationId?.edges[0]
        ?.node?.fnhaContribution || '0',
  };
};

export const getFundingData = (applicationData, sowData) => {
  if (
    applicationData.status === 'approved' ||
    applicationData.status === 'applicant_approved'
  ) {
    return {
      ...getFundingDataFromSow(sowData),
      fnhaContribution:
        applicationData?.applicationFnhaContributionsByApplicationId?.edges[0]
          ?.node?.fnhaContribution || '0',
    };
  }
  if (
    applicationData.status === 'conditionally_approved' ||
    applicationData.status === 'applicant_conditionally_approved' ||
    applicationData.status === 'merged' ||
    applicationData.status === 'applicant_merged' ||
    applicationData.status === 'closed' ||
    applicationData.status === 'applicant_on_hold' ||
    applicationData.status === 'on_hold'
  ) {
    return getFundingDataFromConditionalApproval(applicationData);
  }
  return getFundingDataFromApplication(applicationData);
};

const getSowData = (sowData, baseSowData) => {
  const communitiesData = getCommunitiesWithAmendmentNumber(sowData?.nodes);
  const communities = getCommunitiesNumberWithAmendmentNumber(sowData?.nodes);
  const communitiesNumber = communities?.communitiesNumber;
  const indigenousCommunities = communities?.indigenousCommunitiesNumber;
  const communityNumbersAmendmentNumber = communities?.amendmentNumber;
  const householdsImpacted = getHouseholdsImpactedCountWithAmendmentNumber(
    sowData?.nodes
  );
  let sowTextCommunityNumber;
  let sowTextHouseholdsImpacted;

  const counts: any = {};
  counts.communities = null;
  counts.indigenousCommunities = null;
  counts.nonIndigenousCommunities = null;
  counts.totalHouseholdsImpacted = null;
  counts.numberOfIndigenousHouseholds = null;
  // if there are communities add data
  if (communities) {
    counts.communities = communitiesNumber;
    counts.indigenousCommunities = indigenousCommunities;
    counts.nonIndigenousCommunities =
      communitiesNumber && indigenousCommunities
        ? communitiesNumber - indigenousCommunities
        : communitiesNumber;
  }
  // if there are  households impacted add data
  if (householdsImpacted) {
    counts.totalHouseholdsImpacted =
      householdsImpacted?.totalHouseholdsImpacted;
    counts.numberOfIndigenousHouseholds =
      householdsImpacted?.totalIndigenousHouseholds;
  }

  if (communityNumbersAmendmentNumber) {
    sowTextCommunityNumber =
      communityNumbersAmendmentNumber === 0
        ? 'SOW'
        : `SOW amendment ${communityNumbersAmendmentNumber}`;
  } else {
    sowTextCommunityNumber = 'SOW';
  }

  if (householdsImpacted?.amendmentNumber) {
    sowTextHouseholdsImpacted =
      householdsImpacted?.amendmentNumber === 0
        ? 'SOW'
        : `SOW amendment ${householdsImpacted?.amendmentNumber}`;
  } else {
    sowTextHouseholdsImpacted = 'SOW';
  }

  const formData = {
    counts: { ...counts },
    locations: {
      benefitingCommunities: communitiesData?.benefitingCommunities,
      benefitingIndigenousCommunities:
        communitiesData?.benefitingIndigenousCommunities,
    },
    funding: getFundingDataFromSow(sowData),
    eventsAndDates: {
      effectiveStartDate: sowData?.nodes[0]?.jsonData?.effectiveStartDate,
      proposedStartDate: sowData?.nodes[0]?.jsonData?.projectStartDate,
      proposedCompletionDate:
        sowData?.nodes[0]?.jsonData?.projectCompletionDate,
      dateAgreementSigned:
        baseSowData?.nodes[0]?.jsonData?.dateFundingAgreementSigned,
    },
  };
  const formDataSource = {
    benefitingCommunities: `SOW${communitiesData?.amendmentNumber ? ` amendment ${communitiesData.amendmentNumber}` : ''}`,
    benefitingIndigenousCommunities: `SOW${communitiesData?.amendmentNumber ? ` amendment ${communitiesData.amendmentNumber}` : ''}`,
    communities: sowTextCommunityNumber,
    indigenousCommunities: sowTextCommunityNumber,
    nonIndigenousCommunities: sowTextCommunityNumber,
    totalHouseholdsImpacted: sowTextHouseholdsImpacted,
    numberOfIndigenousHouseholds: sowTextHouseholdsImpacted,
    bcFundingRequested: 'SOW',
    federalFunding: 'SOW',
    fundingRequestedCcbc: 'SOW',
    applicantAmount: 'SOW',
    cibFunding: 'SOW',
    fnhaFunding: 'SOW',
    otherFunding: 'SOW',
    totalProjectBudget: 'SOW',
    effectiveStartDate: 'SOW',
    proposedStartDate: 'SOW',
    proposedCompletionDate: 'SOW',
    dateAgreementSigned: 'Funding Agreement',
  };
  const errors = getSowErrors(sowData?.nodes, review, formDataSource, formData);
  const fallBackFields = getSowFallBackFields(
    sowData?.nodes,
    formData,
    communitiesData
  );

  return {
    formData,
    formDataSource,
    errors,
    fallBackFields,
  };
};

const getFormDataNonSow = (applicationData) => {
  return {
    formData: {
      funding: getFundingDataFromConditionalApproval(applicationData),
      eventsAndDates: {
        dateConditionallyApproved: getConditionalApprovalDate(
          applicationData?.conditionalApproval?.jsonData
        ),
      },
    },
    formDataSource: {
      bcFundingRequested: 'Conditional Approval',
      federalFunding: 'Conditional Approval',
      fundingRequestedCcbc: 'Conditional Approval',
      dateConditionallyApproved: 'Conditional Approval',
    },
  };
};

const getFormDataFromApplication = (
  applicationData,
  allIntakes,
  economicRegions,
  regionalDistricts
) => {
  const splitFunding = handleSplitFunding(
    applicationData?.formData?.jsonData?.projectFunding
      ?.totalFundingRequestedCCBC
  );
  const communities = getCommunitiesTemplateNine(
    applicationData?.applicationFormTemplate9DataByApplicationId?.nodes[0]
      ?.jsonData?.geoNames
  );
  const templateNineSource = handleTemplateNineSource(
    applicationData?.applicationFormTemplate9DataByApplicationId?.nodes[0]
      ?.source
  );

  const generatedFormData = {
    counts: {
      communities:
        applicationData?.applicationFormTemplate9DataByApplicationId?.nodes[0]
          ?.jsonData?.communitiesToBeServed,
      nonIndigenousCommunities:
        applicationData?.applicationFormTemplate9DataByApplicationId?.nodes[0]
          ?.jsonData?.communitiesToBeServed &&
        applicationData?.applicationFormTemplate9DataByApplicationId?.nodes[0]
          ?.jsonData?.indigenousCommunitiesToBeServed
          ? (applicationData?.applicationFormTemplate9DataByApplicationId
              ?.nodes[0]?.jsonData?.communitiesToBeServed || 0) -
            (applicationData?.applicationFormTemplate9DataByApplicationId
              ?.nodes[0]?.jsonData?.indigenousCommunitiesToBeServed || 0)
          : applicationData?.applicationFormTemplate9DataByApplicationId
              ?.nodes[0]?.jsonData?.communitiesToBeServed,
      indigenousCommunities:
        applicationData?.applicationFormTemplate9DataByApplicationId?.nodes[0]
          ?.jsonData?.indigenousCommunitiesToBeServed,
      benefitingIndigenousCommunities: null,
      totalHouseholdsImpacted:
        applicationData?.formData?.jsonData?.benefits?.numberOfHouseholds,
      numberOfIndigenousHouseholds:
        applicationData?.formData?.jsonData?.benefits
          ?.householdsImpactedIndigenous,
    },
    locations: {
      benefitingCommunities: communities?.benefitingCommunities,
      benefitingIndigenousCommunities:
        communities?.benefitingIndigenousCommunities,
      economicRegions: getEconomicRegions(economicRegions),
      regionalDistricts: getRegionalDistricts(regionalDistricts),
    },
    funding: getFundingDataFromApplication(applicationData),
    eventsAndDates: {
      dateApplicationReceived: handleApplicationDateReceived(
        applicationData,
        allIntakes
      ),
      dateConditionalApproval: null,
      dateAgreementSigned: null,
      effectiveStartDate: null,
      proposedStartDate:
        applicationData?.formData?.jsonData?.projectPlan?.projectStartDate,
      proposedCompletionDate:
        applicationData?.formData?.jsonData?.projectPlan?.projectCompletionDate,
    },
  };
  const formData = {
    formData: generatedFormData,
    formDataSource: {
      bcFundingRequested:
        splitFunding?.bc && 'Calculated from Application, assuming 50:50 split',
      federalFunding:
        splitFunding?.federal &&
        'Calculated from Application, assuming 50:50 split',
      benefitingCommunities: templateNineSource,
      benefitingIndigenousCommunities: templateNineSource,
      nonIndigenousCommunities: templateNineSource,
      indigenousCommunities: templateNineSource,
      communities: templateNineSource,
      totalHouseholdsImpacted: 'Application',
      numberOfIndigenousHouseholds: 'Application',
      applicantAmount: 'Application',
      cibFunding: 'Application',
      otherFunding: 'Application',
      totalProjectBudget: 'Application',
      fundingRequestedCcbc: 'Application',
      proposedStartDate: 'Application',
      proposedCompletionDate: 'Application',
    },
    errors: getApplicationErrors(
      applicationData,
      economicRegions,
      regionalDistricts
    ),
    fallBackFields: getFallBackFields(
      applicationData,
      generatedFormData,
      communities
    ),
  };

  return formData;
};

const generateFormData = (
  applicationData,
  sowData,
  allIntakes,
  economicRegions,
  regionalDistricts
) => {
  const dependencyData =
    applicationData?.applicationDependenciesByApplicationId?.nodes[0]?.jsonData;
  const fnhaContribution =
    applicationData?.applicationFnhaContributionsByApplicationId?.edges[0]?.node
      ?.fnhaContribution || '0';
  let formData;
  let formDataSource;
  let errors = null;
  let fallBackFields = null;
  // received, screening, assessment
  // not selected, withdrawn will have bare data from application
  if (
    applicationData.status === 'received' ||
    applicationData.status === 'screening' ||
    applicationData.status === 'assessment' ||
    applicationData.status === 'recommendation' ||
    applicationData.status === 'closed' ||
    applicationData.status === 'analyst_withdrawn' ||
    applicationData.status === 'withdrawn' ||
    applicationData.status === 'applicant_received' ||
    applicationData.status === 'applicant_closed'
  ) {
    const applicationFormData = getFormDataFromApplication(
      applicationData,
      allIntakes,
      economicRegions,
      regionalDistricts
    );
    formData = applicationFormData.formData;
    formDataSource = applicationFormData.formDataSource;
    // conditionally approved (internal), or not selected
    // use data from conditionally approved page
    // even if conditionally approved page has null values, show null
    // applies to BC funding requested and federal funding requested
    // rest is from application as above
    errors = applicationFormData.errors;
    fallBackFields = applicationFormData.fallBackFields;
  } else if (
    applicationData.status === 'conditionally_approved' ||
    applicationData.status === 'applicant_conditionally_approved' ||
    applicationData.status === 'merged' ||
    applicationData.status === 'applicant_merged' ||
    applicationData.status === 'closed' ||
    applicationData.status === 'applicant_on_hold' ||
    applicationData.status === 'on_hold'
  ) {
    const applicationFormData = getFormDataFromApplication(
      applicationData,
      allIntakes,
      economicRegions,
      regionalDistricts
    );
    formData = applicationFormData.formData;
    formDataSource = applicationFormData.formDataSource;
    fallBackFields = applicationFormData.fallBackFields;
    errors = applicationFormData.errors;

    const conditionalApprovalData = getFormDataNonSow(applicationData);
    const conditionalApprovalFormData = conditionalApprovalData.formData;

    formData.funding = {
      ...formData.funding,
      ...conditionalApprovalFormData.funding,
    };
    formData.eventsAndDates = {
      ...formData.eventsAndDates,
      ...conditionalApprovalFormData.eventsAndDates,
    };
    formDataSource = {
      ...formDataSource,
      ...conditionalApprovalData.formDataSource,
    };
    // Agreement signed
  } else if (
    applicationData.status === 'approved' ||
    applicationData.status === 'applicant_approved'
  ) {
    // first get form data from application
    const applicationFormData = getFormDataFromApplication(
      applicationData,
      allIntakes,
      economicRegions,
      regionalDistricts
    );
    formData = applicationFormData.formData;
    formDataSource = applicationFormData.formDataSource;
    fallBackFields = applicationFormData.fallBackFields;
    const conditionalApprovalData = getFormDataNonSow(applicationData);
    const conditionalApprovalDataFormData = conditionalApprovalData.formData;
    formData.eventsAndDates = {
      ...formData.eventsAndDates,
      ...conditionalApprovalDataFormData.eventsAndDates,
    };
    // then, we need the sow data
    const sowSummaryData = getSowData(
      sowData,
      applicationData.projectInformationDataByApplicationId
    );
    const sowFormData = sowSummaryData.formData;
    const sowFormDataSource = sowSummaryData.formDataSource;
    const sowFallBackFields = sowSummaryData.fallBackFields;
    const sowErrors: any = sowSummaryData.errors;
    // we overwrite everything except dates with the returned sowFormData
    // even if null, as per requirements
    formData = {
      ...formData,
      ...sowFormData,
      locations: {
        ...formData.locations,
        benefitingCommunities: sowFormData.locations.benefitingCommunities,
        benefitingIndigenousCommunities:
          sowFormData.locations.benefitingIndigenousCommunities,
      },
      eventsAndDates: {
        ...formData.eventsAndDates,
        effectiveStartDate: sowFormData.eventsAndDates.effectiveStartDate,
        proposedStartDate: sowFormData.eventsAndDates.proposedStartDate,
        proposedCompletionDate:
          sowFormData.eventsAndDates.proposedCompletionDate,
        dateAgreementSigned: sowFormData.eventsAndDates.dateAgreementSigned,
      },
    };
    formDataSource = {
      ...formDataSource,
      ...sowFormDataSource,
      dateConditionallyApproved: 'Conditional Approval',
    };
    // add errors if any from application data errors
    const { economicRegions: erValidations, regionalDistricts: rdValidations } =
      applicationFormData.errors?.locations || {};
    const hasLocationsErrors =
      erValidations || rdValidations || sowErrors?.locations;

    errors = {
      ...sowErrors,
      ...(hasLocationsErrors && {
        locations: {
          economicRegions: erValidations,
          regionalDistricts: rdValidations,
          ...sowErrors?.locations,
        },
      }),
    };
    fallBackFields = {
      ...fallBackFields,
      ...sowFallBackFields,
    };
  }

  return {
    // dependency is one source
    formData: {
      dependency: {
        connectedCoastNetworkDependent:
          dependencyData?.connectedCoastNetworkDependent,
        crtcProjectDependent: dependencyData?.crtcProjectDependent,
      },
      counts: { ...formData?.counts },
      locations: { ...formData?.locations },
      funding: { ...formData?.funding, fnhaContribution }, // fnhaContribution is one source
      eventsAndDates: {
        ...formData?.eventsAndDates,
        announcedByProvince: applicationData
          ?.applicationAnnouncedsByApplicationId?.nodes[0]?.announced
          ? 'Yes'
          : 'No',
      },
      // milestone is one source
      milestone: {
        percentProjectMilestoneComplete: handleMilestone(
          applicationData?.applicationMilestoneExcelDataByApplicationId
            ?.nodes[0]?.jsonData?.overallMilestoneProgress
        ),
      },
    },
    formDataSource: {
      ...formDataSource,
      connectedCoastNetworkDependent: 'Technical Assessment',
      crtcProjectDependent: 'Technical Assessment',
      percentProjectMilestoneComplete: 'Milestone Report',
      announcedByProvince: 'Announcements',
    },
    errors: {
      ...errors,
      ...formData?.errors,
    },
    fallBackFields: {
      ...fallBackFields,
    },
  };
};

export default generateFormData;
