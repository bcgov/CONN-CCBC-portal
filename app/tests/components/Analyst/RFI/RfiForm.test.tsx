import { extractRequestedFiles, getEmailParams, processRfiEmailNotification } from 'components/Analyst/RFI/RfiForm';
import { detectNewFiles, transformFilesForNotification } from 'components/Analyst/RFI/RFI';

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

  describe('getEmailParams', () => {
    it('should create email params with only email correspondence files', () => {
      const newlyAddedFiles = [
        { name: 'file1.pdf', type: 'application/pdf', uploadedAt: '2024-08-24' },
      ];

      const params = getEmailParams(
        true,  // hasNewFiles
        false, // hasNewAdditionalFiles
        newlyAddedFiles,
        [],
        'CCBC-12345',
        'CCBC-12345-1'
      );

      expect(params.ccbcNumber).toBe('CCBC-12345');
      expect(params.documentType).toBe('RFI Additional Documents');
      expect(params.rfiNumber).toBe('CCBC-12345-1');
      expect(params.documentNames).toEqual(['file1.pdf']);
      expect(params.fileDetails).toHaveLength(1);
      expect(params.requestedFiles).toBeUndefined();
    });

    it('should create email params with only requested additional files', () => {
      const params = getEmailParams(
        false, // hasNewFiles
        true,  // hasNewAdditionalFiles
        [],
        ['Template 1 - Eligibility and Impacts Calculator', 'Financial statements'],
        'CCBC-12345',
        'CCBC-12345-1'
      );

      expect(params.ccbcNumber).toBe('CCBC-12345');
      expect(params.documentType).toBe('RFI Additional Documents');
      expect(params.rfiNumber).toBe('CCBC-12345-1');
      expect(params.requestedFiles).toEqual([
        'Template 1 - Eligibility and Impacts Calculator',
        'Financial statements'
      ]);
      expect(params.documentNames).toBeUndefined();
      expect(params.fileDetails).toBeUndefined();
    });

    it('should create email params with both email files and requested documents', () => {
      const newlyAddedFiles = [
        { name: 'email.pdf', type: 'application/pdf', uploadedAt: '2024-08-24' },
        { name: 'response.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', uploadedAt: '2024-08-24' },
      ];

      const params = getEmailParams(
        true,
        true,
        newlyAddedFiles,
        ['Template 1 - Eligibility and Impacts Calculator', 'Project schedule'],
        'CCBC-12345',
        'CCBC-12345-1'
      );

      expect(params.documentNames).toEqual(['email.pdf', 'response.docx']);
      expect(params.fileDetails).toHaveLength(2);
      expect(params.requestedFiles).toEqual([
        'Template 1 - Eligibility and Impacts Calculator',
        'Project schedule'
      ]);
    });

    it('should not include documentNames/fileDetails when hasNewFiles is false', () => {
      const params = getEmailParams(
        false,
        true,
        [{ name: 'file.pdf', type: 'application/pdf', uploadedAt: '2024-08-24' }],
        ['Template 1 - Eligibility and Impacts Calculator'],
        'CCBC-12345',
        'CCBC-12345-1'
      );

      expect(params.documentNames).toBeUndefined();
      expect(params.fileDetails).toBeUndefined();
      expect(params.requestedFiles).toBeDefined();
    });

    it('should not include requestedFiles when hasNewAdditionalFiles is false', () => {
      const newlyAddedFiles = [
        { name: 'file.pdf', type: 'application/pdf', uploadedAt: '2024-08-24' },
      ];

      const params = getEmailParams(
        true,
        false,
        newlyAddedFiles,
        ['Template 1 - Eligibility and Impacts Calculator'],
        'CCBC-12345',
        'CCBC-12345-1'
      );

      expect(params.documentNames).toBeDefined();
      expect(params.fileDetails).toBeDefined();
      expect(params.requestedFiles).toBeUndefined();
    });

    it('should include timestamp in email params', () => {
      const params = getEmailParams(
        false,
        true,
        [],
        ['Template 1 - Eligibility and Impacts Calculator'],
        'CCBC-12345',
        'CCBC-12345-1'
      );

      expect(params.timestamp).toBeDefined();
      expect(typeof params.timestamp).toBe('string');
    });
  });

  describe('processRfiEmailNotification', () => {
    let mockNotifyDocumentUpload: jest.Mock;

    beforeEach(() => {
      mockNotifyDocumentUpload = jest.fn();
    });

    it('should call notifyDocumentUpload when email files are uploaded', () => {
      const oldEmailFiles = [];
      const newEmailFiles = [
        { name: 'file1.pdf', type: 'application/pdf', uploadedAt: '2024-08-24' },
      ];

      processRfiEmailNotification(
        oldEmailFiles,
        newEmailFiles,
        {},
        {},
        'CCBC-12345',
        'CCBC-12345-1',
        1,
        '1',
        mockNotifyDocumentUpload
      );

      expect(mockNotifyDocumentUpload).toHaveBeenCalledTimes(1);
      expect(mockNotifyDocumentUpload).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          ccbcNumber: 'CCBC-12345',
          documentType: 'RFI Additional Documents',
          rfiNumber: 'CCBC-12345-1',
          documentNames: ['file1.pdf'],
        })
      );
    });

    it('should call notifyDocumentUpload when additional files are requested', () => {
      const oldAdditionalFiles = {};
      const newAdditionalFiles = {
        eligibilityAndImpactsCalculatorRfi: true,
        detailedBudgetRfi: true,
      };

      processRfiEmailNotification(
        [],
        [],
        oldAdditionalFiles,
        newAdditionalFiles,
        'CCBC-12345',
        'CCBC-12345-1',
        1,
        '1',
        mockNotifyDocumentUpload
      );

      expect(mockNotifyDocumentUpload).toHaveBeenCalledTimes(1);
      expect(mockNotifyDocumentUpload).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          ccbcNumber: 'CCBC-12345',
          requestedFiles: [
            'Template 1 - Eligibility and Impacts Calculator',
            'Template 2 - Detailed Budget'
          ],
        })
      );
    });

    it('should call notifyDocumentUpload when both files and requests are present', () => {
      const oldEmailFiles = [];
      const newEmailFiles = [
        { name: 'email.pdf', type: 'application/pdf', uploadedAt: '2024-08-24' },
      ];
      const oldAdditionalFiles = {};
      const newAdditionalFiles = {
        projectScheduleRfi: true,
      };

      processRfiEmailNotification(
        oldEmailFiles,
        newEmailFiles,
        oldAdditionalFiles,
        newAdditionalFiles,
        'CCBC-12345',
        'CCBC-12345-1',
        1,
        '1',
        mockNotifyDocumentUpload
      );

      expect(mockNotifyDocumentUpload).toHaveBeenCalledTimes(1);
      const callArgs = mockNotifyDocumentUpload.mock.calls[0][1];
      expect(callArgs.documentNames).toEqual(['email.pdf']);
      expect(callArgs.requestedFiles).toEqual(['Project schedule']);
    });

    it('should NOT call notifyDocumentUpload when no files or requests are present', () => {
      processRfiEmailNotification(
        [],
        [],
        {},
        {},
        'CCBC-12345',
        'CCBC-12345-1',
        1,
        '1',
        mockNotifyDocumentUpload
      );

      expect(mockNotifyDocumentUpload).not.toHaveBeenCalled();
    });

    it('should NOT call notifyDocumentUpload when files remain unchanged', () => {
      const existingFiles = [
        { name: 'file1.pdf', type: 'application/pdf', uploadedAt: '2024-08-24' },
      ];
      const existingAdditionalFiles = {
        eligibilityAndImpactsCalculatorRfi: true,
      };

      processRfiEmailNotification(
        existingFiles,
        existingFiles, // Same files
        existingAdditionalFiles,
        existingAdditionalFiles, // Same checkboxes
        'CCBC-12345',
        'CCBC-12345-1',
        1,
        '1',
        mockNotifyDocumentUpload
      );

      expect(mockNotifyDocumentUpload).not.toHaveBeenCalled();
    });

    it('should use applicationRowId when provided', () => {
      const newEmailFiles = [
        { name: 'file.pdf', type: 'application/pdf', uploadedAt: '2024-08-24' },
      ];

      processRfiEmailNotification(
        [],
        newEmailFiles,
        {},
        {},
        'CCBC-12345',
        'CCBC-12345-1',
        999, // applicationRowId
        '1',
        mockNotifyDocumentUpload
      );

      expect(mockNotifyDocumentUpload).toHaveBeenCalledWith('999', expect.any(Object));
    });

    it('should fall back to appId when applicationRowId is undefined', () => {
      const newEmailFiles = [
        { name: 'file.pdf', type: 'application/pdf', uploadedAt: '2024-08-24' },
      ];

      processRfiEmailNotification(
        [],
        newEmailFiles,
        {},
        {},
        'CCBC-12345',
        'CCBC-12345-1',
        undefined, // No applicationRowId
        '123',
        mockNotifyDocumentUpload
      );

      expect(mockNotifyDocumentUpload).toHaveBeenCalledWith('123', expect.any(Object));
    });

    it('should handle multiple email files and multiple requested documents', () => {
      const newEmailFiles = [
        { name: 'file1.pdf', type: 'application/pdf', uploadedAt: '2024-08-24' },
        { name: 'file2.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', uploadedAt: '2024-08-24' },
      ];
      const newAdditionalFiles = {
        eligibilityAndImpactsCalculatorRfi: true,
        detailedBudgetRfi: true,
        financialForecastRfi: true,
        projectScheduleRfi: true,
      };

      processRfiEmailNotification(
        [],
        newEmailFiles,
        {},
        newAdditionalFiles,
        'CCBC-12345',
        'CCBC-12345-1',
        1,
        '1',
        mockNotifyDocumentUpload
      );

      expect(mockNotifyDocumentUpload).toHaveBeenCalledTimes(1);
      const callArgs = mockNotifyDocumentUpload.mock.calls[0][1];
      expect(callArgs.documentNames).toHaveLength(2);
      expect(callArgs.fileDetails).toHaveLength(2);
      expect(callArgs.requestedFiles).toHaveLength(4);
    });

    it('should correctly integrate detectNewFiles output into email params', () => {
      const oldEmailFiles = [
        { name: 'existing.pdf', type: 'application/pdf', uploadedAt: '2024-08-23' },
      ];
      const newEmailFiles = [
        { name: 'existing.pdf', type: 'application/pdf', uploadedAt: '2024-08-23' },
        { name: 'new.pdf', type: 'application/pdf', uploadedAt: '2024-08-24' },
        { name: 'another.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', uploadedAt: '2024-08-24' },
      ];

      processRfiEmailNotification(
        oldEmailFiles,
        newEmailFiles,
        {},
        {},
        'CCBC-12345',
        'CCBC-12345-1',
        1,
        '1',
        mockNotifyDocumentUpload
      );

      const callArgs = mockNotifyDocumentUpload.mock.calls[0][1];
      expect(callArgs.documentNames).toEqual(['new.pdf', 'another.docx']);
      expect(callArgs.fileDetails).toHaveLength(2);
    });

    it('should correctly integrate extractRequestedFiles output into email params', () => {
      const oldAdditionalFiles = {
        eligibilityAndImpactsCalculatorRfi: true,
      };
      const newAdditionalFiles = {
        eligibilityAndImpactsCalculatorRfi: true,
        detailedBudgetRfi: true,
        financialForecastRfi: true,
      };

      processRfiEmailNotification(
        [],
        [],
        oldAdditionalFiles,
        newAdditionalFiles,
        'CCBC-12345',
        'CCBC-12345-1',
        1,
        '1',
        mockNotifyDocumentUpload
      );

      const callArgs = mockNotifyDocumentUpload.mock.calls[0][1];
      expect(callArgs.requestedFiles).toEqual([
        'Template 2 - Detailed Budget',
        'Template 3 - Financial Forecast'
      ]);
      expect(callArgs.requestedFiles).not.toContain('Template 1 - Eligibility and Impacts Calculator');
    });
  });

  describe('getEmailParams - additional edge cases', () => {
    it('should handle empty newlyAddedFiles array even when hasNewFiles is true', () => {
      const params = getEmailParams(
        true,
        false,
        [], // Empty array
        [],
        'CCBC-12345',
        'CCBC-12345-1'
      );

      expect(params.documentNames).toBeUndefined();
      expect(params.fileDetails).toBeUndefined();
    });

    it('should handle empty requestedAdditionalFiles when hasNewAdditionalFiles is true', () => {
      const params = getEmailParams(
        false,
        true,
        [],
        [], // Empty array but flag is true
        'CCBC-12345',
        'CCBC-12345-1'
      );

      expect(params.requestedFiles).toEqual([]);
    });

    it('should always include base fields regardless of file presence', () => {
      const params = getEmailParams(
        false,
        false,
        [],
        [],
        'CCBC-99999',
        'CCBC-99999-5'
      );

      expect(params.ccbcNumber).toBe('CCBC-99999');
      expect(params.documentType).toBe('RFI Additional Documents');
      expect(params.rfiNumber).toBe('CCBC-99999-5');
      expect(params.timestamp).toBeDefined();
    });

    it('should transform file details correctly via transformFilesForNotification', () => {
      const newlyAddedFiles = [
        { name: 'doc.pdf', type: 'application/pdf', uploadedAt: '2024-08-24' },
        { name: 'sheet.xlsx', uploadedAt: '2024-08-24' }, // No type
      ];

      const params = getEmailParams(
        true,
        false,
        newlyAddedFiles,
        [],
        'CCBC-12345',
        'CCBC-12345-1'
      );

      expect(params.fileDetails[0].type).toBe('application/pdf');
      expect(params.fileDetails[1].type).toBe('Unknown'); // Default for missing type
    });
  });
});
