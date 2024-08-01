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
  if (otherFundingSources?.totalInfrastructureBankFunding) {
    otherFundingSourcesTotal +=
      otherFundingSources.totalInfrastructureBankFunding;
  }
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
    return isedDate;
  }
  if (!isedDate) {
    return provincialDate;
  }
  return new Date(provincialDate) > new Date(isedDate)
    ? provincialDate
    : isedDate;
};

const handleMilestone = (milestonePercent) => {
  if (!milestonePercent) {
    return null;
  }
  return `${milestonePercent * 100}%`;
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

const getSowErrors = (sowData, communitiesData) => {
  // error on benefiting communities
  const errors = {
    counts: {
      benefitingCommunities: {},
      benefitingIndigenousCommunities: {},
    },
  };
  const communitiesNumber =
    sowData?.nodes[0]?.sowTab8SBySowId?.nodes[0]?.jsonData?.communitiesNumber;
  const indigenousCommunitiesNumber =
    sowData?.nodes[0]?.sowTab8SBySowId?.nodes[0]?.jsonData
      ?.indigenousCommunitiesNumber;
  if (communitiesNumber !== communitiesData?.totalBenefitingCommunities) {
    errors.counts.benefitingCommunities = {
      __errors: [
        `Communities count mismatch ${communitiesNumber} and ${communitiesData.totalBenefitingCommunities}`,
      ],
      errorColor: '#f8e78f',
    };
    // error on benefiting indigenous communities
  }
  if (
    indigenousCommunitiesNumber !==
    communitiesData?.totalBenefitingIndigenousCommunities
  ) {
    errors.counts.benefitingIndigenousCommunities = {
      __errors: [
        `Indigenous communities count mismatch ${indigenousCommunitiesNumber} and ${communitiesData.totalBenefitingIndigenousCommunities}`,
      ],
      errorColor: '#f8e78f',
    };
  }
  return errors;
};

const getSowData = (sowData, baseSowData) => {
  const communitiesData = getCommunities(
    sowData?.nodes[0]?.sowTab8SBySowId?.nodes[0]?.jsonData?.geoNames
  );
  const errors = getSowErrors(sowData, communitiesData);
  return {
    formData: {
      counts: {
        communities:
          sowData?.nodes[0]?.sowTab8SBySowId?.nodes[0]?.jsonData
            ?.communitiesNumber,
        benefitingCommunities: communitiesData?.benefitingCommunities,
        indigenousCommunities:
          sowData?.nodes[0]?.sowTab8SBySowId?.nodes[0]?.jsonData
            ?.indigenousCommunitiesNumber,
        benefitingIndigenousCommunities:
          communitiesData?.benefitingIndigenousCommunities,
        totalHouseholdsImpacted:
          sowData?.nodes[0]?.sowTab1SBySowId?.nodes[0]?.jsonData
            ?.totalNumberCommunitiesImpacted,
        numberOfIndigenousHouseholds:
          sowData?.nodes[0]?.sowTab1SBySowId?.nodes[0]?.jsonData
            ?.householdsImpactedIndigenous,
      },
      funding: {
        bcFundingRequested:
          sowData?.nodes[0]?.sowTab7SBySowId?.nodes[0]?.jsonData?.summaryTable
            ?.amountRequestedFromProvince,
        federalFunding:
          sowData?.nodes[0]?.sowTab7SBySowId?.nodes[0]?.jsonData?.summaryTable
            ?.amountRequestedFromFederalGovernment,
        applicantAmount:
          sowData?.nodes[0]?.sowTab7SBySowId?.nodes[0]?.jsonData?.summaryTable
            ?.totalApplicantContribution,
        cibFunding:
          sowData?.nodes[0]?.sowTab7SBySowId?.nodes[0]?.jsonData?.summaryTable
            ?.totalInfrastructureBankFunding,
        fhnaFunding: null,
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
      benefitingIndigenousCommunities: 'SOW',
      totalHouseholdsImpacted: 'SOW',
      numberOfIndigenousHouseholds: 'SOW',
      bcFundingRequested: 'SOW',
      federalFunding: 'SOW',
      applicantAmount: 'SOW',
      cibFunding: 'SOW',
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
      dateConditionallyApproved: 'Conditional Approval',
    },
  };
};

const getFormDataFromApplication = (applicationData, allIntakes) => {
  return {
    formData: {
      counts: {
        communities: null,
        benefitingCommunities: null,
        indigenousCommunities: null,
        benefitingIndigenousCommunities: null,
        totalHouseholdsImpacted:
          applicationData?.formData?.jsonData?.benefits?.numberOfHouseholds,
        numberOfIndigenousHouseholds:
          applicationData?.formData?.jsonData?.benefits
            ?.householdsImpactedIndigenous,
      },
      funding: {
        bcFundingRequested: null,
        federalFunding: null,
        applicantAmount:
          applicationData?.formData?.jsonData?.projectFunding
            ?.totalApplicantContribution,
        cibFunding:
          applicationData?.formData?.jsonData?.projectFunding?.cibFunding,
        fhnaFunding: null,
        otherFunding: handleOtherFundingSourcesApplication(
          applicationData?.formData?.jsonData?.otherFundingSources
        ),
        totalProjectBudget:
          applicationData?.formData?.jsonData?.budgetDetails?.totalProjectCost,
      },
      eventsAndDates: {
        announcedByProvince: 'No',
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
      proposedStartDate: 'Application',
      proposedCompletionDate: 'Application',
    },
  };
};

const generateFormData = (applicationData, sowData, allIntakes) => {
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
    applicationData.status === 'withdrawn'
  ) {
    const applicationFormData = getFormDataFromApplication(
      applicationData,
      allIntakes
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
      allIntakes
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
      allIntakes
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
      funding: { ...formData?.funding },
      eventsAndDates: { ...formData?.eventsAndDates },
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
    },
    errors,
  };
};

export default generateFormData;
