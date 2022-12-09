import { JSONSchema7 } from 'json-schema';

const rfi = {
  title: '',
  type: 'object',
  required: [
    'rfiType',
    'rfiDueBy',
    'rfiEmailCorrespondance',
    'rfiAdditionalFiles',
  ],
  properties: {
    rfiType: {
      title: 'RFI type',
      type: 'array',
      items: {
        type: 'string',
        enum: ['Missing files or information', 'Technical'],
      },
      uniqueItems: true,
    },
    rfiDueBy: {
      title: 'Due by',
      type: 'string',
    },
    rfiEmailCorrespondance: {
      title: 'Email correspondence',
      type: 'string',
    },
    rfiAdditionalFiles: {
      type: 'object',
      properties: {
        eligibilityAndImpactsCalculatorRfi: {
          title: 'Template 1 - Eligibility and Impacts Calculator',
          type: 'boolean',
        },
        detailedBudgetRfi: {
          title: 'Template 2 - Detailed Budget',
          type: 'boolean',
        },
        financialForecastRfi: {
          title: 'Template 3 - Financial Forecast',
          type: 'boolean',
        },
        lastMileIspOfferingRfi: {
          title: 'Template 4 - Last Mile Internet Service Offering',
          type: 'boolean',
        },
        popWholesalePricingRfi: {
          title:
            'Template 5 - List of Points of Presence and Wholesale Pricing',
          type: 'boolean',
        },
        communityRuralDevelopmentBenefitsTemplateRfi: {
          title: 'Template 6 - Community and Rural Development Benefits',
          type: 'boolean',
        },
        wirelessAddendumRfi: {
          title: 'Template 7 - Wireless Addendum',
          type: 'boolean',
        },
        supportingConnectivityEvidenceRfi: {
          title: 'Template 8 - Supporting Connectivity Evidence',
          type: 'boolean',
        },
        geographicNamesRfi: {
          title: 'Template 9 - Backbone and Geographic Names',
          type: 'boolean',
        },
        equipmentDetailsRfi: {
          title: 'Template 10 - Equipment Details',
          type: 'boolean',
        },
        copiesOfRegistrationRfi: {
          title: 'Copies of registration and other relevant documents',
          type: 'boolean',
        },
        preparedFinancialStatementsRfi: {
          title: 'Financial statements',
          type: 'boolean',
        },
        logicalNetworkDiagramRfi: {
          title: 'Logical Network Diagram',
          type: 'boolean',
        },
        projectScheduleRfi: {
          title: 'Project schedule',
          type: 'boolean',
        },
        communityRuralDevelopmentBenefitsRfi: {
          title: 'Benefits supporting documents',
          type: 'boolean',
        },
        otherSupportingMaterialsRfi: {
          title: 'Other supporting materials',
          type: 'boolean',
        },
        geographicCoverageMapRfi: {
          title: 'Coverage map from Eligibility Mapping Tool',
          type: 'boolean',
        },
        coverageAssessmentStatisticsRfi: {
          title: 'Coverage Assessment and Statistics',
          type: 'boolean',
        },
        currentNetworkInfastructureRfi: {
          title: 'Current network infrastructure',
          type: 'boolean',
        },
        upgradedNetworkInfrastructureRfi: {
          title: 'Proposed or Upgraded Network Infrastructure',
          type: 'boolean',
        },
      },
      dependencies: {
        eligibilityAndImpactsCalculatorRfi: {
          properties: {
            eligibilityAndImpactsCalculator: {
              title: 'Template 1 - Eligibility and Impacts Calculator',
              type: 'boolean',
            },
          },
        },
        detailedBudgetRfi: {
          properties: {
            detailedBudget: {
              title: 'Template 2 - Detailed Budget',
              type: 'boolean',
            },
          },
        },
        financialForecastRfi: {
          properties: {
            financialForecast: {
              title: 'Template 3 - Financial Forecast',
              type: 'boolean',
            },
          },
        },
        lastMileIspOfferingRfi: {
          properties: {
            lastMileIspOffering: {
              title: 'Template 4 - Last Mile Internet Service Offering',
              type: 'boolean',
            },
          },
        },
        popWholesalePricingRfi: {
          properties: {
            popWholesalePricing: {
              title:
                'Template 5 - List of Points of Presence and Wholesale Pricing',
              type: 'boolean',
            },
          },
        },
        communityRuralDevelopmentBenefitsTemplateRfi: {
          properties: {
            communityRuralDevelopmentBenefitsTemplate: {
              title: 'Template 6 - Community and Rural Development Benefits',
              type: 'boolean',
            },
          },
        },
        wirelessAddendumRfi: {
          properties: {
            wirelessAddendum: {
              title: 'Template 7 - Wireless Addendum',
              type: 'boolean',
            },
          },
        },
        supportingConnectivityEvidenceRfi: {
          properties: {
            supportingConnectivityEvidence: {
              title: 'Template 8 - Supporting Connectivity Evidence',
              type: 'boolean',
            },
          },
        },
        geographicNamesRfi: {
          properties: {
            geographicNames: {
              title: 'Template 9 - Backbone and Geographic Names',
              type: 'boolean',
            },
          },
        },
        equipmentDetailsRfi: {
          properties: {
            equipmentDetails: {
              title: 'Template 10 - Equipment Details',
              type: 'boolean',
            },
          },
        },
        copiesOfRegistrationRfi: {
          properties: {
            copiesOfRegistration: {
              title: 'Copies of registration and other relevant documents',
              type: 'boolean',
            },
          },
        },
        preparedFinancialStatementsRfi: {
          properties: {
            preparedFinancialStatements: {
              title: 'Financial statements',
              type: 'boolean',
            },
          },
        },
        logicalNetworkDiagramRfi: {
          properties: {
            logicalNetworkDiagram: {
              title: 'Logical Network Diagram',
              type: 'boolean',
            },
          },
        },
        projectScheduleRfi: {
          properties: {
            projectSchedule: {
              title: 'Project schedule',
              type: 'boolean',
            },
          },
        },
        communityRuralDevelopmentBenefitsRfi: {
          properties: {
            communityRuralDevelopmentBenefits: {
              title: 'Benefits supporting documents',
              type: 'boolean',
            },
          },
        },
        otherSupportingMaterialsRfi: {
          properties: {
            otherSupportingMaterials: {
              title: 'Other supporting materials',
              type: 'boolean',
            },
          },
        },
        geographicCoverageMapRfi: {
          properties: {
            geographicCoverageMap: {
              title: 'Coverage map from Eligibility Mapping Tool',
              type: 'boolean',
            },
          },
        },
        coverageAssessmentStatisticsRfi: {
          properties: {
            coverageAssessmentStatistics: {
              title: 'Coverage Assessment and Statistics',
              type: 'boolean',
            },
          },
        },
        currentNetworkInfastructureRfi: {
          properties: {
            currentNetworkInfastructure: {
              title: 'Current network infrastructure',
              type: 'boolean',
            },
          },
        },
        upgradedNetworkInfrastructureRfi: {
          properties: {
            upgradedNetworkInfrastructure: {
              title: 'Proposed or Upgraded Network Infrastructure',
              type: 'boolean',
            },
          },
        },
      },
      uniqueItems: true,
    },
  },
} as Record<string, JSONSchema7>;

export default rfi;
