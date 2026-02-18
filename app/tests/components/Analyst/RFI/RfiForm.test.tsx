import { extractRequestedFiles } from 'components/Analyst/RFI/RfiForm';

describe('RfiForm - Additional Files Email Notification Logic', () => {
  describe('extractRequestedFiles', () => {
    describe('single file request', () => {
      it('should detect when a single additional file is newly requested', () => {
        const oldFiles = {};
        const newFiles = {
          eligibilityAndImpactsCalculatorRfi: true,
        };

        const requestedFiles = extractRequestedFiles(oldFiles, newFiles);

        expect(requestedFiles).toHaveLength(1);
        expect(requestedFiles).toContain('Template 1 - Eligibility and Impacts Calculator');
      });

      it('should detect when detailedBudgetRfi is requested', () => {
        const oldFiles = {};
        const newFiles = {
          detailedBudgetRfi: true,
        };

        const requestedFiles = extractRequestedFiles(oldFiles, newFiles);

        expect(requestedFiles).toHaveLength(1);
        expect(requestedFiles).toContain('Template 2 - Detailed Budget');
      });

      it('should detect when financialForecastRfi is requested', () => {
        const oldFiles = {};
        const newFiles = {
          financialForecastRfi: true,
        };

        const requestedFiles = extractRequestedFiles(oldFiles, newFiles);

        expect(requestedFiles).toHaveLength(1);
        expect(requestedFiles).toContain('Template 3 - Financial Forecast');
      });
    });

    describe('multiple file requests', () => {
      it('should detect when multiple additional files are newly requested', () => {
        const oldFiles = {};
        const newFiles = {
          eligibilityAndImpactsCalculatorRfi: true,
          detailedBudgetRfi: true,
          financialForecastRfi: true,
        };

        const requestedFiles = extractRequestedFiles(oldFiles, newFiles);

        expect(requestedFiles).toHaveLength(3);
        expect(requestedFiles).toContain('Template 1 - Eligibility and Impacts Calculator');
        expect(requestedFiles).toContain('Template 2 - Detailed Budget');
        expect(requestedFiles).toContain('Template 3 - Financial Forecast');
      });

      it('should detect all 20 document types correctly', () => {
        const oldFiles = {};
        const newFiles = {
          eligibilityAndImpactsCalculatorRfi: true,
          detailedBudgetRfi: true,
          financialForecastRfi: true,
          lastMileIspOfferingRfi: true,
          popWholesalePricingRfi: true,
          communityRuralDevelopmentBenefitsTemplateRfi: true,
          wirelessAddendumRfi: true,
          supportingConnectivityEvidenceRfi: true,
          geographicNamesRfi: true,
          equipmentDetailsRfi: true,
          copiesOfRegistrationRfi: true,
          preparedFinancialStatementsRfi: true,
          logicalNetworkDiagramRfi: true,
          projectScheduleRfi: true,
          communityRuralDevelopmentBenefitsRfi: true,
          otherSupportingMaterialsRfi: true,
          geographicCoverageMapRfi: true,
          coverageAssessmentStatisticsRfi: true,
          currentNetworkInfastructureRfi: true,
          upgradedNetworkInfrastructureRfi: true,
        };

        const requestedFiles = extractRequestedFiles(oldFiles, newFiles);

        expect(requestedFiles).toHaveLength(20);
        expect(requestedFiles).toContain('Template 1 - Eligibility and Impacts Calculator');
        expect(requestedFiles).toContain('Template 10 - Equipment Details');
        expect(requestedFiles).toContain('Financial statements');
        expect(requestedFiles).toContain('Proposed or Upgraded Network Infrastructure');
      });
    });

    describe('incremental changes', () => {
      it('should only detect newly added requests, not previously requested files', () => {
        const oldFiles = {
          eligibilityAndImpactsCalculatorRfi: true,
          detailedBudgetRfi: true,
        };
        const newFiles = {
          eligibilityAndImpactsCalculatorRfi: true,
          detailedBudgetRfi: true,
          financialForecastRfi: true,
        };

        const requestedFiles = extractRequestedFiles(oldFiles, newFiles);

        expect(requestedFiles).toHaveLength(1);
        expect(requestedFiles).toContain('Template 3 - Financial Forecast');
        expect(requestedFiles).not.toContain('Template 1 - Eligibility and Impacts Calculator');
        expect(requestedFiles).not.toContain('Template 2 - Detailed Budget');
      });

      it('should detect multiple new requests when some files were already requested', () => {
        const oldFiles = {
          eligibilityAndImpactsCalculatorRfi: true,
        };
        const newFiles = {
          eligibilityAndImpactsCalculatorRfi: true,
          detailedBudgetRfi: true,
          financialForecastRfi: true,
          projectScheduleRfi: true,
        };

        const requestedFiles = extractRequestedFiles(oldFiles, newFiles);

        expect(requestedFiles).toHaveLength(3);
        expect(requestedFiles).toContain('Template 2 - Detailed Budget');
        expect(requestedFiles).toContain('Template 3 - Financial Forecast');
        expect(requestedFiles).toContain('Project schedule');
        expect(requestedFiles).not.toContain('Template 1 - Eligibility and Impacts Calculator');
      });
    });

    describe('no changes scenarios', () => {
      it('should return empty array when no files are requested', () => {
        const oldFiles = {};
        const newFiles = {};

        const requestedFiles = extractRequestedFiles(oldFiles, newFiles);

        expect(requestedFiles).toHaveLength(0);
      });

      it('should return empty array when checkbox states remain unchanged', () => {
        const oldFiles = {
          eligibilityAndImpactsCalculatorRfi: true,
          detailedBudgetRfi: true,
          financialForecastRfi: false,
        };
        const newFiles = {
          eligibilityAndImpactsCalculatorRfi: true,
          detailedBudgetRfi: true,
          financialForecastRfi: false,
        };

        const requestedFiles = extractRequestedFiles(oldFiles, newFiles);

        expect(requestedFiles).toHaveLength(0);
      });

      it('should return empty array when checkboxes are unchecked', () => {
        const oldFiles = {
          eligibilityAndImpactsCalculatorRfi: true,
          detailedBudgetRfi: true,
        };
        const newFiles = {
          eligibilityAndImpactsCalculatorRfi: false,
          detailedBudgetRfi: false,
        };

        const requestedFiles = extractRequestedFiles(oldFiles, newFiles);

        expect(requestedFiles).toHaveLength(0);
      });

      it('should return empty array when all checkboxes are set to false', () => {
        const oldFiles = {};
        const newFiles = {
          eligibilityAndImpactsCalculatorRfi: false,
          detailedBudgetRfi: false,
          financialForecastRfi: false,
        };

        const requestedFiles = extractRequestedFiles(oldFiles, newFiles);

        expect(requestedFiles).toHaveLength(0);
      });
    });

    describe('edge cases', () => {
      it('should handle undefined old files', () => {
        const oldFiles = undefined;
        const newFiles = {
          eligibilityAndImpactsCalculatorRfi: true,
        };

        const requestedFiles = extractRequestedFiles(oldFiles, newFiles);

        expect(requestedFiles).toHaveLength(1);
        expect(requestedFiles).toContain('Template 1 - Eligibility and Impacts Calculator');
      });

      it('should handle undefined new files', () => {
        const oldFiles = {
          eligibilityAndImpactsCalculatorRfi: true,
        };
        const newFiles = undefined;

        const requestedFiles = extractRequestedFiles(oldFiles, newFiles);

        expect(requestedFiles).toHaveLength(0);
      });

      it('should handle both undefined', () => {
        const oldFiles = undefined;
        const newFiles = undefined;

        const requestedFiles = extractRequestedFiles(oldFiles, newFiles);

        expect(requestedFiles).toHaveLength(0);
      });

      it('should ignore non-boolean fields', () => {
        const oldFiles = {};
        const newFiles = {
          eligibilityAndImpactsCalculatorRfi: true,
          eligibilityAndImpactsCalculator: 'uuid-123', // File reference, not checkbox
          detailedBudgetRfi: true,
          detailedBudget: 'uuid-456', // File reference, not checkbox
          someOtherField: 'value',
        };

        const requestedFiles = extractRequestedFiles(oldFiles, newFiles);

        expect(requestedFiles).toHaveLength(2);
        expect(requestedFiles).toContain('Template 1 - Eligibility and Impacts Calculator');
        expect(requestedFiles).toContain('Template 2 - Detailed Budget');
      });

      it('should ignore fields not ending with "Rfi"', () => {
        const oldFiles = {};
        const newFiles = {
          eligibilityAndImpactsCalculatorRfi: true,
          eligibilityAndImpactsCalculator: true, // Doesn't end with Rfi
          someOtherBoolean: true, // Doesn't end with Rfi
        };

        const requestedFiles = extractRequestedFiles(oldFiles, newFiles);

        expect(requestedFiles).toHaveLength(1);
        expect(requestedFiles).toContain('Template 1 - Eligibility and Impacts Calculator');
      });

      it('should use field key as fallback label if not in RFI_FILE_LABELS', () => {
        const oldFiles = {};
        const newFiles = {
          unknownDocumentTypeRfi: true,
        };

        const requestedFiles = extractRequestedFiles(oldFiles, newFiles);

        expect(requestedFiles).toHaveLength(1);
        expect(requestedFiles).toContain('unknownDocumentTypeRfi');
      });
    });

    describe('mixed scenarios', () => {
      it('should handle mix of new requests, unchanged requests, and unchecked boxes', () => {
        const oldFiles = {
          eligibilityAndImpactsCalculatorRfi: true, // Was checked, still checked
          detailedBudgetRfi: true, // Was checked, now unchecked
          financialForecastRfi: false, // Was unchecked, still unchecked
        };
        const newFiles = {
          eligibilityAndImpactsCalculatorRfi: true,
          detailedBudgetRfi: false,
          financialForecastRfi: false,
          projectScheduleRfi: true, // New request
          logicalNetworkDiagramRfi: true, // New request
        };

        const requestedFiles = extractRequestedFiles(oldFiles, newFiles);

        expect(requestedFiles).toHaveLength(2);
        expect(requestedFiles).toContain('Project schedule');
        expect(requestedFiles).toContain('Logical Network Diagram');
        expect(requestedFiles).not.toContain('Template 1 - Eligibility and Impacts Calculator');
        expect(requestedFiles).not.toContain('Template 2 - Detailed Budget');
      });

      it('should handle partial update with file references present', () => {
        const oldFiles = {
          eligibilityAndImpactsCalculatorRfi: true,
          eligibilityAndImpactsCalculator: 'uuid-old',
        };
        const newFiles = {
          eligibilityAndImpactsCalculatorRfi: true,
          eligibilityAndImpactsCalculator: 'uuid-old',
          detailedBudgetRfi: true,
          detailedBudget: 'uuid-new',
        };

        const requestedFiles = extractRequestedFiles(oldFiles, newFiles);

        expect(requestedFiles).toHaveLength(1);
        expect(requestedFiles).toContain('Template 2 - Detailed Budget');
      });
    });

    describe('real-world scenarios', () => {
      it('should handle analyst creating new RFI with multiple document requests', () => {
        const oldFiles = {}; // New RFI
        const newFiles = {
          rfiType: ['Missing files or information'],
          rfiDueBy: '2026-03-01',
          eligibilityAndImpactsCalculatorRfi: true,
          detailedBudgetRfi: true,
          financialForecastRfi: true,
          projectScheduleRfi: true,
        };

        const requestedFiles = extractRequestedFiles(oldFiles, newFiles);

        expect(requestedFiles).toHaveLength(4);
        expect(requestedFiles).toContain('Template 1 - Eligibility and Impacts Calculator');
        expect(requestedFiles).toContain('Template 2 - Detailed Budget');
        expect(requestedFiles).toContain('Template 3 - Financial Forecast');
        expect(requestedFiles).toContain('Project schedule');
      });

      it('should handle analyst updating existing RFI by adding more document requests', () => {
        const oldFiles = {
          eligibilityAndImpactsCalculatorRfi: true,
          detailedBudgetRfi: true,
        };
        const newFiles = {
          eligibilityAndImpactsCalculatorRfi: true,
          detailedBudgetRfi: true,
          logicalNetworkDiagramRfi: true,
          currentNetworkInfastructureRfi: true,
          upgradedNetworkInfrastructureRfi: true,
        };

        const requestedFiles = extractRequestedFiles(oldFiles, newFiles);

        expect(requestedFiles).toHaveLength(3);
        expect(requestedFiles).toContain('Logical Network Diagram');
        expect(requestedFiles).toContain('Current network infrastructure');
        expect(requestedFiles).toContain('Proposed or Upgraded Network Infrastructure');
      });

      it('should handle analyst saving RFI without making any document changes', () => {
        const oldFiles = {
          eligibilityAndImpactsCalculatorRfi: true,
          eligibilityAndImpactsCalculator: 'uuid-123',
          detailedBudgetRfi: true,
          detailedBudget: 'uuid-456',
        };
        const newFiles = {
          eligibilityAndImpactsCalculatorRfi: true,
          eligibilityAndImpactsCalculator: 'uuid-123',
          detailedBudgetRfi: true,
          detailedBudget: 'uuid-456',
          rfiDueBy: '2026-03-15', // Changed due date only
        };

        const requestedFiles = extractRequestedFiles(oldFiles, newFiles);

        expect(requestedFiles).toHaveLength(0); // No new document requests
      });
    });

    describe('label mapping verification', () => {
      it('should correctly map all template fields to their labels', () => {
        const oldFiles = {};
        const newFiles = {
          eligibilityAndImpactsCalculatorRfi: true,
          detailedBudgetRfi: true,
          financialForecastRfi: true,
          lastMileIspOfferingRfi: true,
          popWholesalePricingRfi: true,
          communityRuralDevelopmentBenefitsTemplateRfi: true,
          wirelessAddendumRfi: true,
          supportingConnectivityEvidenceRfi: true,
          geographicNamesRfi: true,
          equipmentDetailsRfi: true,
        };

        const requestedFiles = extractRequestedFiles(oldFiles, newFiles);

        expect(requestedFiles).toEqual([
          'Template 1 - Eligibility and Impacts Calculator',
          'Template 2 - Detailed Budget',
          'Template 3 - Financial Forecast',
          'Template 4 - Last Mile Internet Service Offering',
          'Template 5 - List of Points of Presence and Wholesale Pricing',
          'Template 6 - Community and Rural Development Benefits',
          'Template 7 - Wireless Addendum',
          'Template 8 - Supporting Connectivity Evidence',
          'Template 9 - Backbone and Geographic Names',
          'Template 10 - Equipment Details',
        ]);
      });

      it('should correctly map all non-template fields to their labels', () => {
        const oldFiles = {};
        const newFiles = {
          copiesOfRegistrationRfi: true,
          preparedFinancialStatementsRfi: true,
          logicalNetworkDiagramRfi: true,
          projectScheduleRfi: true,
          communityRuralDevelopmentBenefitsRfi: true,
          otherSupportingMaterialsRfi: true,
          geographicCoverageMapRfi: true,
          coverageAssessmentStatisticsRfi: true,
          currentNetworkInfastructureRfi: true,
          upgradedNetworkInfrastructureRfi: true,
        };

        const requestedFiles = extractRequestedFiles(oldFiles, newFiles);

        expect(requestedFiles).toEqual([
          'Copies of registration and other relevant documents',
          'Financial statements',
          'Logical Network Diagram',
          'Project schedule',
          'Benefits supporting documents',
          'Other supporting materials',
          'Coverage map from Eligibility Mapping Tool',
          'Coverage Assessment and Statistics',
          'Current network infrastructure',
          'Proposed or Upgraded Network Infrastructure',
        ]);
      });
    });
  });
});
