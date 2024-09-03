const countsUiSchema = {
  'ui:field': 'SectionField',
  'ui:options': {
    dividers: true,
  },
  'ui:title': 'Counts',
  communities: {
    'ui:widget': 'NumberWidget',
    'ui:label': 'Total number of communities benefitting',
  },
  indigenousCommunities: {
    'ui:widget': 'NumberWidget',
    'ui:label': 'Number of Indigenous Communities benefitting',
  },
  nonIndigenousCommunities: {
    'ui:widget': 'NumberWidget',
    'ui:label': 'Number of Non-Indigenous Communities benefitting',
  },
  benefitingIndigenousCommunities: {
    'ui:widget': 'LinkArrayWidget',
    'ui:label': 'List of Indigenous communities benefitting',
  },
  benefitingCommunities: {
    'ui:widget': 'LinkArrayWidget',
    'ui:label': 'List of Non-Indigenous communities benefitting',
  },
  totalHouseholdsImpacted: {
    'ui:widget': 'NumberWidget',
    'ui:label': 'Total Households Impacted',
  },
  numberOfIndigenousHouseholds: {
    'ui:widget': 'NumberWidget',
    'ui:label': 'Number of Indigenous Households',
  },
};
export default countsUiSchema;
