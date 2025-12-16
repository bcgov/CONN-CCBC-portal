import dependencyUiSchema from './dependencyUiSchema';
import countsUiSchema from './countsUiSchema';
import fundingUiSchema from './fundingUiSchema';
import eventsAndDatesUiSchema from './eventsAndDatesUiSchema';
import milestoneUiSchema from './milestoneUiSchema';
import locationsUiSchema from './locationsUiSchema';
import miscellaneousUiSchema from './miscellaneousUiSchema';

const reviewUiSchema = {
  dependency: dependencyUiSchema,
  counts: countsUiSchema,
  locations: locationsUiSchema,
  funding: {
    ...fundingUiSchema,
    bcFundingRequested: {
      ...fundingUiSchema.bcFundingRequested,
      'ui:widget': 'ReadOnlyMoneyWidget',
    },
    federalFunding: {
      ...fundingUiSchema.federalFunding,
      'ui:widget': 'ReadOnlyMoneyWidget',
    },
    fundingRequestedCcbc: {
      ...fundingUiSchema.fundingRequestedCcbc,
      'ui:widget': 'ReadOnlyMoneyWidget',
    },
    applicantAmount: {
      ...fundingUiSchema.applicantAmount,
      'ui:widget': 'ReadOnlyMoneyWidget',
    },
    otherFunding: {
      ...fundingUiSchema.otherFunding,
      'ui:widget': 'ReadOnlyMoneyWidget',
    },
    cibFunding: {
      ...fundingUiSchema.cibFunding,
      'ui:widget': 'ReadOnlyMoneyWidget',
    },
    fnhaFunding: {
      ...fundingUiSchema.fnhaFunding,
      'ui:widget': 'ReadOnlyMoneyWidget',
    },
    totalProjectBudget: {
      ...fundingUiSchema.totalProjectBudget,
      'ui:widget': 'ReadOnlyMoneyWidget',
    },
    'ui:options': {
      allowAnalystEdit: true,
    },
  },
  eventsAndDates: eventsAndDatesUiSchema,
  milestone: milestoneUiSchema,
  miscellaneous: miscellaneousUiSchema,
};
export default reviewUiSchema;
