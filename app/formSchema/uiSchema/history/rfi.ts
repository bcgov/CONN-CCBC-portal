import rfi from 'formSchema/analyst//rfiSchema';

const rfiDiffSchema = {
  rfi: {
    ...rfi,
    properties: {
      eligibilityAndImpactsCalculatorRfi: {
        title: 'Template 1 - Eligibility and Impacts Calculator requested',
        type: 'boolean',
      },
      detailedBudgetRfi: {
        title: 'Template 2 - Detailed Budget requested',
        type: 'boolean',
      },
      financialForecastRfi: {
        title: 'Template 3 - Financial Forecast requested',
        type: 'boolean',
      },
      lastMileIspOfferingRfi: {
        title: 'Template 4 - Last Mile Internet Service Offering requested',
        type: 'boolean',
      },
      popWholesalePricingRfi: {
        title: 'Template 5 - List of PoPs and Wholesale Pricing requested',
        type: 'boolean',
      },
      communityRuralDevelopmentBenefitsTemplateRfi: {
        title: 'Template 6 - Community Benefits requested',
        type: 'boolean',
      },
      wirelessAddendumRfi: {
        title: 'Template 7 - Wireless Addendum requested',
        type: 'boolean',
      },
      supportingConnectivityEvidenceRfi: {
        title: 'Template 8 - Supporting Connectivity Evidence requested',
        type: 'boolean',
      },
      geographicNamesRfi: {
        title: 'Template 9 - Backbone and Geographic Names requested',
        type: 'boolean',
      },
      equipmentDetailsRfi: {
        title: 'Template 10 - Equipment Details requested',
        type: 'boolean',
      },
      copiesOfRegistrationRfi: {
        title: 'Copies of registration and other relevant documents requested',
        type: 'boolean',
      },
      preparedFinancialStatementsRfi: {
        title: 'Financial statements requested',
        type: 'boolean',
      },
      logicalNetworkDiagramRfi: {
        title: 'Logical Network Diagram requested',
        type: 'boolean',
      },
      projectScheduleRfi: {
        title: 'Project schedule requested',
        type: 'boolean',
      },
      communityRuralDevelopmentBenefitsRfi: {
        title: 'Benefits supporting documents requested',
        type: 'boolean',
      },
      otherSupportingMaterialsRfi: {
        title: 'Other supporting materials requested',
        type: 'boolean',
      },
      geographicCoverageMapRfi: {
        title: 'Coverage map from Eligibility Mapping Tool requested',
        type: 'boolean',
      },
      coverageAssessmentStatisticsRfi: {
        title: 'Coverage Assessment and Statistics requested',
        type: 'boolean',
      },
      currentNetworkInfastructureRfi: {
        title: 'Current network infrastructure requested',
        type: 'boolean',
      },
      upgradedNetworkInfrastructureRfi: {
        title: 'Proposed or Upgraded Network Infrastructure requested',
        type: 'boolean',
      },
      ...rfi.properties,
    },
  },
};

export default rfiDiffSchema;
