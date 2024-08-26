import dependencyUiSchema from './dependencyUiSchema';
import countsUiSchema from './countsUiSchema';
import fundingUiSchema from './fundingUiSchema';
import eventsAndDatesUiSchema from './eventsAndDatesUiSchema';
import milestoneUiSchema from './milestoneUiSchema';

const reviewUiSchema = {
  dependency: dependencyUiSchema,
  counts: countsUiSchema,
  funding: fundingUiSchema,
  eventsAndDates: eventsAndDatesUiSchema,
  milestone: milestoneUiSchema,
};
export default reviewUiSchema;
