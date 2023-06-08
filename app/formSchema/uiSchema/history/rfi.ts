import rfi from 'formSchema/analyst//rfiSchema';

const updatedRfiAdditionalFiles = {
  properties: {
    ...rfi.properties.rfiAdditionalFiles,
    ...Object.entries(rfi.properties.rfiAdditionalFiles.properties).reduce(
      (acc, [key, value]) => {
        acc[key] = { ...value, title: `${value.title} requested` };
        return acc;
      },
      {}
    ),
  },
};

const rfiDiffSchema = {
  rfi: {
    ...rfi,
    properties: {
      ...updatedRfiAdditionalFiles.properties,
      popWholesalePricingRfi: {
        title: 'Template 5 - List of PoPs and Wholesale Pricing requested',
        type: 'boolean',
      },
      communityRuralDevelopmentBenefitsTemplateRfi: {
        title: 'Template 6 - Community Benefits requested',
        type: 'boolean',
      },
      ...rfi.properties,
    },
  },
};

export default rfiDiffSchema;
