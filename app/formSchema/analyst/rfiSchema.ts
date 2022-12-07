import { JSONSchema7 } from 'json-schema';
import templateUploadsFields from 'dist/formSchema/pages/templateUploads';
import supportingDocumentsFields from 'dist/formSchema/pages/supportingDocuments';
import coverageFields from 'dist/formSchema/pages/coverage';

const templateUploads = templateUploadsFields.templateUploads.properties;
const supportingDocuments =
  supportingDocumentsFields.supportingDocuments.properties;
const coverage = coverageFields.coverage.properties;

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
          hidden: true,
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
            eligibilityAndImpactsCalculator:
              templateUploads.eligibilityAndImpactsCalculator,
          },
        },
        detailedBudgetRfi: {
          properties: {
            detailedBudget: templateUploads.detailedBudget,
          },
        },
        financialForecastRfi: {
          properties: {
            financialForecast: templateUploads.financialForecast,
          },
        },
        lastMileIspOfferingRfi: {
          properties: {
            lastMileIspOffering: templateUploads.lastMileIspOffering,
          },
        },
        popWholesalePricingRfi: {
          properties: {
            popWholesalePricing: templateUploads.popWholesalePricing,
          },
        },
        communityRuralDevelopmentBenefitsTemplateRfi: {
          properties: {
            communityRuralDevelopmentBenefitsTemplate:
              templateUploads.communityRuralDevelopmentBenefitsTemplate,
          },
        },
        wirelessAddendumRfi: {
          properties: {
            wirelessAddendum: templateUploads.wirelessAddendum,
          },
        },
        supportingConnectivityEvidenceRfi: {
          properties: {
            supportingConnectivityEvidence:
              templateUploads.supportingConnectivityEvidence,
          },
        },
        geographicNamesRfi: {
          properties: {
            geographicNames: templateUploads.geographicNames,
          },
        },
        equipmentDetailsRfi: {
          properties: {
            equipmentDetails: templateUploads.equipmentDetails,
          },
        },
        copiesOfRegistrationRfi: {
          properties: {
            copiesOfRegistration: supportingDocuments.copiesOfRegistration,
          },
        },
        preparedFinancialStatementsRfi: {
          properties: {
            preparedFinancialStatements:
              supportingDocuments.preparedFinancialStatements,
          },
        },
        logicalNetworkDiagramRfi: {
          properties: {
            logicalNetworkDiagram: supportingDocuments.logicalNetworkDiagram,
          },
        },
        projectScheduleRfi: {
          properties: {
            projectSchedule: supportingDocuments.projectSchedule,
          },
        },
        communityRuralDevelopmentBenefitsRfi: {
          properties: {
            communityRuralDevelopmentBenefits:
              supportingDocuments.communityRuralDevelopmentBenefits,
          },
        },
        otherSupportingMaterialsRfi: {
          properties: {
            otherSupportingMaterials:
              supportingDocuments.otherSupportingMaterials,
          },
        },
        geographicCoverageMapRfi: {
          properties: {
            geographicCoverageMap: coverage.geographicCoverageMap,
          },
        },
        coverageAssessmentStatisticsRfi: {
          properties: {
            coverageAssessmentStatistics: coverage.coverageAssessmentStatistics,
          },
        },
        currentNetworkInfastructureRfi: {
          properties: {
            currentNetworkInfastructure: coverage.currentNetworkInfastructure,
          },
        },
        upgradedNetworkInfrastructureRfi: {
          properties: {
            upgradedNetworkInfrastructure:
              coverage.upgradedNetworkInfrastructure,
          },
        },
      },
      uniqueItems: true,
    },
  },
} as Record<string, JSONSchema7>;

export default rfi;
