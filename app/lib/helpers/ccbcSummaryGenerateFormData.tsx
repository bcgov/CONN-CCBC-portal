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

const findScreeningAssessment = (assessments) => {
  return assessments.nodes.find(
    (assessment) => assessment.assessmentDataType === 'screening'
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

const getSowData = (sowData, baseSowData) => {
  const communitiesData = getCommunities(
    sowData?.nodes[0]?.sowTab8SBySowId?.nodes[0]?.jsonData?.geoNames
  );
  const errors = {}; // errors may get added later
  const communities =
    sowData?.nodes[0]?.sowTab8SBySowId?.nodes[0]?.jsonData?.communitiesNumber;
  const indigenousCommunities =
    sowData?.nodes[0]?.sowTab8SBySowId?.nodes[0]?.jsonData
      ?.indigenousCommunitiesNumber;
  return {
    formData: {
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
    },
    formDataSource: {
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
    },
    errors,
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
  return {
    formData: {
      counts: {
        communities: null,
        benefitingCommunities: null,
        indigenousCommunities: null,
        nonIndigenousCommunities: null,
        benefitingIndigenousCommunities: null,
        totalHouseholdsImpacted:
          applicationData?.formData?.jsonData?.benefits?.numberOfHouseholds,
        numberOfIndigenousHouseholds:
          applicationData?.formData?.jsonData?.benefits
            ?.householdsImpactedIndigenous,
      },
      locations: {
        economicRegions: getEconomicRegions(economicRegions),
        regionalDistricts: getRegionalDistricts(regionalDistricts),
      },
      funding: {
        bcFundingRequested: null,
        federalFunding: null,
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
  const screeningAssessment = findScreeningAssessment(
    applicationData.allAssessments
  );
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

  return {
    // dependency is one source
    formData: {
      dependency: {
        connectedCoastNetworkDependent: screeningAssessment?.jsonData
          ?.connectedCoastNetworkDependent
          ? 'Yes'
          : null,
        crtcProjectDependent: screeningAssessment?.jsonData
          ?.crtcProjectDependent
          ? 'Yes'
          : null,
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
      connectedCoastNetworkDependent: 'Screening',
      crtcProjectDependent: 'Screening',
      percentProjectMilestoneComplete: 'Milestone Report',
      announcedByProvince: 'Announcements',
    },
    errors,
  };
};

export default generateFormData;
