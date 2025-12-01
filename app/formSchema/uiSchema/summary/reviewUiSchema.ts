import dependencyUiSchema from './dependencyUiSchema';
import countsUiSchema from './countsUiSchema';
import fundingUiSchema from './fundingUiSchema';
import eventsAndDatesUiSchema from './eventsAndDatesUiSchema';
import milestoneUiSchema from './milestoneUiSchema';
import locationsUiSchema from './locationsUiSchema';

const reviewUiSchema = {
  dependency: dependencyUiSchema,
  counts: countsUiSchema,
  locations: locationsUiSchema,
  funding: {
    ...fundingUiSchema,
    bcFundingRequested: {
      ...fundingUiSchema.bcFundingRequested,
      'ui:widget': 'ReadOnlyMoneyWidget',
      'ui:options': {
        ...fundingUiSchema.bcFundingRequested?.['ui:options'],
        decimals: 0,
      },
    },
    fnhaContribution: {
      ...fundingUiSchema.fnhaContribution,
      'ui:options': {
        ...fundingUiSchema.fnhaContribution?.['ui:options'],
        decimals: 0,
      },
    },
    federalFunding: {
      ...fundingUiSchema.federalFunding,
      'ui:widget': 'ReadOnlyMoneyWidget',
      'ui:options': {
        ...fundingUiSchema.federalFunding?.['ui:options'],
        decimals: 0,
      },
    },
    fundingRequestedCcbc: {
      ...fundingUiSchema.fundingRequestedCcbc,
      'ui:widget': 'ReadOnlyMoneyWidget',
      'ui:options': {
        ...fundingUiSchema.fundingRequestedCcbc?.['ui:options'],
        decimals: 0,
      },
    },
    applicantAmount: {
      ...fundingUiSchema.applicantAmount,
      'ui:widget': 'ReadOnlyMoneyWidget',
      'ui:options': {
        ...fundingUiSchema.applicantAmount?.['ui:options'],
        decimals: 0,
      },
    },
    otherFunding: {
      ...fundingUiSchema.otherFunding,
      'ui:widget': 'ReadOnlyMoneyWidget',
      'ui:options': {
        ...fundingUiSchema.otherFunding?.['ui:options'],
        decimals: 0,
      },
    },
    cibFunding: {
      ...fundingUiSchema.cibFunding,
      'ui:widget': 'ReadOnlyMoneyWidget',
      'ui:options': {
        ...fundingUiSchema.cibFunding?.['ui:options'],
        decimals: 0,
      },
    },
    fnhaFunding: {
      ...fundingUiSchema.fnhaFunding,
      'ui:widget': 'ReadOnlyMoneyWidget',
      'ui:options': {
        ...fundingUiSchema.fnhaFunding?.['ui:options'],
        decimals: 0,
      },
    },
    totalProjectBudget: {
      ...fundingUiSchema.totalProjectBudget,
      'ui:widget': 'ReadOnlyMoneyWidget',
      'ui:options': {
        ...fundingUiSchema.totalProjectBudget?.['ui:options'],
        decimals: 0,
      },
    },
    'ui:options': {
      allowAnalystEdit: true,
    },
  },
  eventsAndDates: eventsAndDatesUiSchema,
  milestone: milestoneUiSchema,
};
export default reviewUiSchema;
