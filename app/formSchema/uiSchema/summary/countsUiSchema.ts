const countsUiSchema = {
  'ui:field': 'SectionField',
  'ui:options': {
    dividers: true,
  },
  'ui:title': 'Counts',
  communities: {
    'ui:widget': 'NumberWidget',
    'ui:label': 'Communities',
  },
  benefitingCommunities: {
    'ui:widget': 'LinkArrayWidget',
    'ui:label': 'Benefiting Communities',
  },
  indigenousCommunities: {
    'ui:widget': 'NumberWidget',
    'ui:label': 'Indigenous Communities',
  },
  benefitingIndigenousCommunities: {
    'ui:widget': 'LinkArrayWidget',
    'ui:label': 'Benefiting Indigenous Communities',
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
