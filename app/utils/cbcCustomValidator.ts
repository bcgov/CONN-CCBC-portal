export const CBC_WARN_COLOR = '#f8e78f';

const CBC_VALIDATIONS = {
  tombstone: {
    projectStatus: {
      rules: [
        {
          condition: (data) =>
            data.tombstone?.projectStatus === 'Reporting Complete' &&
            data.miscellaneous?.projectMilestoneCompleted !== 1,
          error: 'Missing project status',
        },
      ],
      color: CBC_WARN_COLOR,
    },
    federalFundingSource: {
      rules: [
        {
          condition: (data) =>
            (data.funding?.federalFundingRequested > 0 ||
              data.tombstone?.federalProjectNumber) &&
            !data.tombstone?.federalFundingSource,
          error: 'Missing Federal funding source',
        },
      ],
      color: CBC_WARN_COLOR,
    },
    federalProjectNumber: {
      rules: [
        {
          condition: (data) =>
            data.tombstone?.federalFundingSource &&
            !data.tombstone?.federalProjectNumber,
          error: 'Missing Federal project number',
        },
        {
          condition: (data) =>
            ['ISED-UBF RRS', 'ISED-UBF'].includes(
              data.tombstone?.federalFundingSource
            ) &&
            data.tombstone?.federalProjectNumber &&
            !data.tombstone?.federalProjectNumber?.startsWith('UBF'),
          error: `UBF project numbers must begin with 'UBF-'`,
        },
        {
          condition: (data) =>
            data.tombstone?.federalFundingSource === 'ISED-CTI' &&
            data.tombstone?.federalProjectNumber &&
            !data.tombstone?.federalProjectNumber?.startsWith('CTI'),
          error: `CTI project numbers must begin with 'CTI-'`,
        },
      ],
      color: CBC_WARN_COLOR,
    },
  },
  miscellaneous: {
    projectMilestoneCompleted: {
      rules: [
        {
          condition: (data) =>
            data.miscellaneous?.projectMilestoneCompleted === 100 &&
            !data.miscellaneous?.constructionCompletedOn,
          error: 'Missing date',
        },
      ],
      color: CBC_WARN_COLOR,
    },
  },
  eventsAndDates: {
    dateAnnounced: {
      rules: [
        {
          condition: (data) =>
            data.miscellaneous?.primaryNewsRelease &&
            !data.eventsAndDates?.dateAnnounced,
          error: 'Missing date announced',
        },
      ],
      color: CBC_WARN_COLOR,
    },
    reportingCompletionDate: {
      rules: [
        {
          condition: (data) =>
            data.tombstone?.projectStatus === 'Reporting Complete' &&
            !data.eventsAndDates?.reportingCompletionDate,
          error: 'Missing reporting completion date',
        },
      ],
      color: CBC_WARN_COLOR,
    },
    proposedCompletionDate: {
      rules: [
        {
          condition: (data) =>
            (data.eventsAndDates?.proposedCompletionDate &&
              data.eventsAndDates?.dateConditionallyApproved &&
              data.eventsAndDates?.proposedCompletionDate <
                data.eventsAndDates?.dateConditionallyApproved) ||
            (data.eventsAndDates?.proposedStartDate &&
              data.eventsAndDates?.proposedCompletionDate <
                data.eventsAndDates?.proposedStartDate),
          error:
            'Please review Proposed Completion Date accuracy in relation to Date Conditionally Approved and Proposed Start Date',
        },
      ],
      color: CBC_WARN_COLOR,
    },
    dateAgreementSigned: {
      rules: [
        {
          condition: (data) =>
            data.eventsAndDates?.agreementSigned &&
            !data.eventsAndDates?.dateAgreementSigned,
          error: 'Missing date agreement signed',
        },
      ],
      color: CBC_WARN_COLOR,
    },
    dateConditionallyApproved: {
      rules: [
        {
          condition: (data) =>
            data.eventsAndDates?.conditionalApprovalLetterSent &&
            !data.eventsAndDates?.dateConditionallyApproved,
          error: 'Missing date conditionally approved',
        },
      ],
      color: CBC_WARN_COLOR,
    },
    agreementSigned: {
      rules: [
        {
          condition: (data) =>
            data.tombstone?.projectStatus === 'Agreement Signed' &&
            !data.eventsAndDates?.agreementSigned,
          error: 'Missing information : yes, no?',
        },
      ],
      color: CBC_WARN_COLOR,
    },
    conditionalApprovalLetterSent: {
      rules: [
        {
          condition: (data) =>
            data.tombstone?.projectStatus === 'Conditionally Approved' &&
            !data.eventsAndDates?.conditionalApprovalLetterSent,
          error: `Status is Conditionally Approved, approval letter should have been sent, if so select 'Yes'`,
        },
      ],
      color: CBC_WARN_COLOR,
    },
  },
  funding: {
    totalProjectBudget: {
      rules: [
        {
          condition: (data) =>
            (data.funding?.bcFundingRequested || 0) +
              (data.funding?.federalFundingRequested || 0) +
              (data.funding?.applicantAmount || 0) +
              (data.funding?.otherFundingRequested || 0) !==
            data.funding?.totalProjectBudget,
          error:
            'Total project budget must equal the sum of the funding sources',
        },
      ],
      color: CBC_WARN_COLOR,
    },
  },
  locationsAndCounts: {
    indigenousCommunities: {
      rules: [
        {
          condition: (data) =>
            data.locationsAndCounts?.indigenousCommunities >
            data.locationsAndCounts?.communitiesAndLocalesCount,
          error:
            'Indigenous communities cannot be greater than total communities',
        },
      ],

      color: CBC_WARN_COLOR,
    },
    transportKm: {
      rules: [
        {
          condition: (data) =>
            data.projectType?.projectType === 'Transport' &&
            !data.locationsAndCounts?.transportKm,
          error: 'Missing transport KMs',
        },
      ],
      color: CBC_WARN_COLOR,
    },
    highwayKm: {
      rules: [
        {
          condition: (data) =>
            data.projectType?.projectType === 'Cellular' &&
            !data.locationsAndCounts?.highwayKm,
          error: 'Missing highway KMs',
        },
      ],
      color: CBC_WARN_COLOR,
    },
  },
  projectType: {
    lastMileProjectType: {
      rules: [
        {
          condition: (data) =>
            [
              'Last-Mile',
              'Last-Mile & Cellular',
              'Last-Mile & Transport',
            ].includes(data.projectType?.projectType) &&
            !data.projectType?.lastMileProjectType,
          error: 'Missing Last-Mile project type',
        },
      ],
      color: CBC_WARN_COLOR,
    },
    highwayProjectType: {
      rules: [
        {
          condition: (data) =>
            data.projectType?.projectType === 'Cellular' &&
            !data.projectType?.highwayProjectType,
          error: 'Missing highway project type',
        },
      ],
      color: CBC_WARN_COLOR,
    },
    transportProjectType: {
      rules: [
        {
          condition: (data) =>
            ['Transport', 'Last-Mile & Transport'].includes(
              data.projectType?.projectType
            ) && !data.projectType?.transportProjectType,
          error: 'Missing Transport project type',
        },
      ],
      color: CBC_WARN_COLOR,
    },
  },
};

const validateRule = (rule, data) => {
  return rule?.condition?.(data) ? rule.error : null;
};

const customValidate = (data, key, fieldKey) => {
  const { rules } = CBC_VALIDATIONS[key]?.[fieldKey] || {};
  return (
    rules?.map((rule) => validateRule(rule, data)).filter((error) => error) ||
    []
  );
};

export default customValidate;
