import review from 'formSchema/analyst/summary/review';

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

const findTechnicalAssessment = (assessments) => {
  return assessments.nodes.find(
    (assessment) => assessment.assessmentDataType === 'technical'
  );
};

const handleApplicationDateReceived = (applicationData, allIntakes) => {
  // keep blank for hidden intakes
  if (applicationData.intakeNumber === 99) {
    return null;
  }
  // from intake 5 application is immediately submitted, use that date
  if (applicationData.intakeNumber === 5) {
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

const getConditionalApprovalDate = (conditionalApprovalData) => {
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
        });
      }
    }
    if (community?.isIndigenous?.toUpperCase() === 'Y') {
      if (community?.geoName) {
        benefitingIndigenousCommunities.push({
          name: community?.geoName,
          link: community?.mapLink,
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

const getSowErrors = (sowData, schema, formDataSource) => {
  if (sowData?.length) return null;
  const errors = {};
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
          __errors: ['SOW excel table has not been uploaded in the portal'],
        };
      }
    });
  });

  return errors;
};

const getSowData = (sowData, baseSowData) => {
  const communitiesData = getCommunities(
    sowData?.nodes[0]?.sowTab8SBySowId?.nodes[0]?.jsonData?.geoNames
  );
  const communities =
    sowData?.nodes[0]?.sowTab8SBySowId?.nodes[0]?.jsonData?.communitiesNumber;
  const indigenousCommunities =
    sowData?.nodes[0]?.sowTab8SBySowId?.nodes[0]?.jsonData
      ?.indigenousCommunitiesNumber;
  const formData = {
    counts: {
      communities,
      indigenousCommunities,
      nonIndigenousCommunities:
        communities && indigenousCommunities
          ? communities - indigenousCommunities
          : communities,
      totalHouseholdsImpacted:
        sowData?.nodes[0]?.sowTab1SBySowId?.nodes[0]?.jsonData
          ?.numberOfHouseholds,
      numberOfIndigenousHouseholds:
        sowData?.nodes[0]?.sowTab1SBySowId?.nodes[0]?.jsonData
          ?.householdsImpactedIndigenous,
    },
    locations: {
      benefitingCommunities: communitiesData?.benefitingCommunities,
      benefitingIndigenousCommunities:
        communitiesData?.benefitingIndigenousCommunities,
    },
    funding: {
      bcFundingRequested:
        sowData?.nodes[0]?.sowTab7SBySowId?.nodes[0]?.jsonData?.summaryTable
          ?.amountRequestedFromProvince,
      federalFunding:
        sowData?.nodes[0]?.sowTab7SBySowId?.nodes[0]?.jsonData?.summaryTable
          ?.amountRequestedFromFederalGovernment,
      fundingRequestedCcbc:
        sowData?.nodes[0]?.sowTab7SBySowId?.nodes[0]?.jsonData?.summaryTable
          ?.totalFundingRequestedCCBC,
      applicantAmount:
        sowData?.nodes[0]?.sowTab7SBySowId?.nodes[0]?.jsonData?.summaryTable
          ?.totalApplicantContribution,
      cibFunding:
        sowData?.nodes[0]?.sowTab7SBySowId?.nodes[0]?.jsonData?.summaryTable
          ?.totalInfrastructureBankFunding,
      fhnaFunding:
        sowData?.nodes[0]?.sowTab7SBySowId?.nodes[0]?.jsonData?.summaryTable
          ?.totalFNHAFunding,
      otherFunding:
        sowData?.nodes[0]?.sowTab7SBySowId?.nodes[0]?.jsonData?.summaryTable
          ?.fundingFromAllOtherSources,
      totalProjectBudget:
        sowData?.nodes[0]?.sowTab7SBySowId?.nodes[0]?.jsonData?.summaryTable
          ?.totalProjectCost,
    },
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
    communities: 'SOW',
    benefitingCommunities: 'SOW',
    indigenousCommunities: 'SOW',
    nonIndigenousCommunities: 'SOW',
    benefitingIndigenousCommunities: 'SOW',
    totalHouseholdsImpacted: 'SOW',
    numberOfIndigenousHouseholds: 'SOW',
    bcFundingRequested: 'SOW',
    federalFunding: 'SOW',
    fundingRequestedCcbc: 'SOW',
    applicantAmount: 'SOW',
    cibFunding: 'SOW',
    fhnaFunding: 'SOW',
    otherFunding: 'SOW',
    totalProjectBudget: 'SOW',
    effectiveStartDate: 'SOW',
    proposedStartDate: 'SOW',
    proposedCompletionDate: 'SOW',
    dateAgreementSigned: 'SOW',
  };
  const errors = getSowErrors(sowData?.nodes, review, formDataSource);

  return {
    formData,
    formDataSource,
    errors,
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

const getFormDataNonSow = (applicationData) => {
  return {
    formData: {
      funding: {
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
      },
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
  return {
    formData: {
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
      funding: {
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
        fhnaFunding: null,
        otherFunding: handleOtherFundingSourcesApplication(
          applicationData?.formData?.jsonData?.otherFundingSources
        ),
        totalProjectBudget:
          applicationData?.formData?.jsonData?.budgetDetails?.totalProjectCost,
      },
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
          applicationData?.formData?.jsonData?.projectPlan
            ?.projectCompletionDate,
      },
    },
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
  };
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
  let formData;
  let formDataSource;
  let errors = null;
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
  } else if (
    applicationData.status === 'conditionally_approved' ||
    applicationData.status === 'applicant_conditionally_approved' ||
    applicationData.status === 'closed'
  ) {
    const applicationFormData = getFormDataFromApplication(
      applicationData,
      allIntakes,
      economicRegions,
      regionalDistricts
    );
    formData = applicationFormData.formData;
    formDataSource = applicationFormData.formDataSource;

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
    errors = sowSummaryData.errors;
  }

  const technicalAssessment = findTechnicalAssessment(
    applicationData.allAssessments
  );
  const techAssessmentProgress = technicalAssessment?.jsonData?.nextStep;
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
      funding: { ...formData?.funding },
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
      dependency: {
        connectedCoastNetworkDependent: {
          __errors: [
            techAssessmentProgress
              ? `Assessment progress is "${techAssessmentProgress}"`
              : null,
          ],
          errorColor: '#FFF',
          errorTextColor:
            dependencyData?.connectedCoastNetworkDependent === 'TBD'
              ? '#676666'
              : null,
        },
        crtcProjectDependent: {
          __errors: [
            techAssessmentProgress
              ? `Assessment progress is "${techAssessmentProgress}"`
              : null,
          ],
          errorColor: '#FFF',
          errorTextColor:
            dependencyData?.crtcProjectDependent === 'TBD' ? '#676666' : null,
        },
      },
    },
  };
};

export default generateFormData;
