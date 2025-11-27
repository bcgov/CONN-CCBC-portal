/* eslint-disable import/prefer-default-export */
import applicationDiffSchema from 'formSchema/uiSchema/history/application';
import applicationGisDataSchema from 'formSchema/uiSchema/history/applicationGisData';
import rfiDiffSchema from 'formSchema/uiSchema/history/rfi';
import projectInformationSchema from 'formSchema/uiSchema/history/projectInformation';
import conditionalApprovalSchema from 'formSchema/uiSchema/history/conditionalApproval';
import screeningSchema from 'formSchema/uiSchema/history/screening';
import gis from 'formSchema/uiSchema/history/gis';
import gisAssessmentHhSchema from 'formSchema/uiSchema/history/gisAssessmentHh';
import applicationSowDataSchema from 'formSchema/uiSchema/history/applicationSowData';
import applicationAnnounced from 'formSchema/uiSchema/history/applicationAnnounced';
import fnhaContribution from 'formSchema/uiSchema/history/fnhaContribution';
import communities from 'formSchema/uiSchema/history/communities';
import technicalSchema from 'formSchema/uiSchema/history/technical';
import projectManagementSchema from 'formSchema/uiSchema/history/projectManagement';
import permittingSchema from 'formSchema/uiSchema/history/permitting';
import financialRiskSchema from 'formSchema/uiSchema/history/financialRisk';

// Define inline schemas for simple cases
const communityReportSchema = {
  communityReport: {
    properties: {
      dueDate: {
        title: 'Due date',
        type: 'string',
      },
      dateReceived: {
        title: 'Date received',
        type: 'string',
      },
    },
  },
};

const pendingChangeRequestSchema = {
  pendingChangeRequest: {
    properties: {
      comment: {
        title: 'Comments:',
        type: 'string',
      },
    },
  },
};

const applicationDependenciesSchema = {
  applicationDependencies: {
    properties: {
      crtcProjectDependent: { title: 'CRTC Project Dependent' },
      connectedCoastNetworkDependent: {
        title: 'Connected Coast Network Dependent',
      },
    },
  },
};

// Map table names to their schemas and excluded keys
export const getTableConfig = (tableName: string, assessmentType?: string) => {
  const configs = {
    rfi_data: {
      schema: rfiDiffSchema,
      excludedKeys: [
        'id',
        'createdAt',
        'updatedAt',
        'applicationId',
        'name',
        'size',
        'type',
        'rfiEmailCorrespondance',
        'fileDate',
        'uploadedAt',
        'eligibilityAndImpactsCalculator',
        'detailedBudget',
        'financialForecast',
        'lastMileIspOffering',
        'popWholesalePricing',
        'communityRuralDevelopmentBenefitsTemplate',
        'wirelessAddendum',
        'supportingConnectivityEvidence',
        'geographicNames',
        'equipmentDetails',
        'copiesOfRegistration',
        'preparedFinancialStatements',
        'logicalNetworkDiagram',
        'projectSchedule',
        'communityRuralDevelopmentBenefits',
        'otherSupportingMaterials',
        'geographicCoverageMap',
        'coverageAssessmentStatistics',
        'currentNetworkInfastructure',
        'upgradedNetworkInfrastructure',
        'uuid',
        'user_info',
      ],
      overrideParent: 'rfi',
    },
    application_announced: {
      schema: applicationAnnounced,
      excludedKeys: [
        'id',
        'application_id',
        'updated_at',
        'created_at',
        'created_by',
        'updated_by',
        'archived_at',
        'archived_by',
        'user_info',
      ],
      overrideParent: 'applicationAnnounced',
    },
    application_status: {
      schema: {
        applicationStatus: {
          properties: {
            status: {
              title: 'Status',
              type: 'string',
            },
          },
        },
      },
      excludedKeys: [
        'id',
        'createdAt',
        'updatedAt',
        'applicationId',
        'user_info',
      ],
      overrideParent: 'applicationStatus',
    },
    application_analyst_lead: {
      schema: {
        applicationAnalystLead: {
          properties: {
            analyst_lead: {
              title: 'Lead Assigned',
              type: 'string',
            },
          },
        },
      },
      excludedKeys: [
        'id',
        'createdAt',
        'updatedAt',
        'applicationId',
        'user_info',
      ],
      overrideParent: 'applicationAnalystLead',
    },
    application_package: {
      schema: {
        applicationPackage: {
          properties: {
            package: {
              title: 'Package',
              type: 'string',
            },
          },
        },
      },
      excludedKeys: [
        'id',
        'createdAt',
        'updatedAt',
        'applicationId',
        'user_info',
      ],
      overrideParent: 'applicationPackage',
    },
    application_project_type: {
      schema: {
        applicationProjectType: {
          properties: {
            project_type: {
              title: 'Project Type',
              type: 'string',
            },
          },
        },
      },
      excludedKeys: [
        'id',
        'application_id',
        'created_at',
        'updated_at',
        'created_by',
        'updated_by',
        'archived_at',
        'archived_by',
        'user_info',
      ],
      overrideParent: 'applicationProjectType',
    },
    form_data: {
      schema: applicationDiffSchema,
      excludedKeys: [
        'id',
        'createdAt',
        'updatedAt',
        'applicationId',
        'acknowledgements',
        'supportingDocuments',
        'coverage',
        'templateUploads',
        'user_info',
      ],
    },
    application_dependencies: {
      schema: applicationDependenciesSchema,
      excludedKeys: ['id', 'createdAt', 'updatedAt', 'applicationId'],
      overrideParent: 'applicationDependencies',
    },
    assessment_data: {
      schema: (() => {
        if (assessmentType === 'screening') return screeningSchema;
        if (assessmentType === 'gis') return gis;
        if (assessmentType === 'technical') return technicalSchema;
        if (assessmentType === 'financialRisk') return financialRiskSchema;
        if (assessmentType === 'projectManagement')
          return projectManagementSchema;
        if (assessmentType === 'permitting') return permittingSchema;
        return null;
      })(),
      excludedKeys: [
        'id',
        'name',
        'size',
        'type',
        'uuid',
        'uploadedAt',
        'otherFiles',
        'assessmentTemplate',
        'completedAssessment',
        'user_info',
      ],
      overrideParent: assessmentType,
    },
    conditional_approval_data: {
      schema: conditionalApprovalSchema,
      excludedKeys: [
        'id',
        'createdAt',
        'updatedAt',
        'uploadedAt',
        'size',
        'name',
        'uuid',
        'type',
        'letterOfApprovalUpload',
        'letterOfApproval',
        'user_info',
      ],
      overrideParent: 'conditionalApproval',
    },
    application_gis_data: {
      schema: applicationGisDataSchema,
      excludedKeys: ['ccbc_number'],
      overrideParent: 'gis',
    },
    application_gis_assessment_hh: {
      schema: gisAssessmentHhSchema,
      excludedKeys: [
        'id',
        'application_id',
        'updated_at',
        'created_at',
        'created_by',
        'updated_by',
        'archived_at',
        'archived_by',
        'user_info',
      ],
      overrideParent: 'gis',
    },
    project_information_data: {
      schema: projectInformationSchema,
      excludedKeys: [
        'statementOfWorkUpload',
        'sowWirelessUpload',
        'fundingAgreementUpload',
        'finalizedMapUpload',
        'otherFiles',
        'user_info',
      ],
      overrideParent: 'projectInformation',
    },
    application_sow_data: {
      schema: applicationSowDataSchema,
      excludedKeys: [
        'province',
        'ccbc_number',
        'effectiveStartDate',
        'projectStartDate',
        'projectCompletionDate',
        'backboneFibre',
        'backboneMicrowave',
        'backboneSatellite',
        'lastMileFibre',
        'lastMileCable',
        'lastMileDSL',
        'lastMileMobileWireless',
        'lastMileFixedWireless',
        'lastMileSatellite',
        'user_info',
      ],
      overrideParent: 'application_sow_data',
    },
    application_community_progress_report_data: {
      schema: communityReportSchema,
      excludedKeys: ['ccbc_number', 'progressReportFile'],
      overrideParent: 'communityReport',
    },
    application_milestone_data: {
      schema: communityReportSchema,
      excludedKeys: [
        'ccbc_number',
        'milestoneFile',
        'evidenceOfCompletionFile',
        'user_info',
      ],
      overrideParent: 'communityReport',
    },
    application_pending_change_request: {
      schema: pendingChangeRequestSchema,
      excludedKeys: [
        'id',
        'application_id',
        'created_at',
        'updated_at',
        'created_by',
        'updated_by',
        'archived_at',
        'archived_by',
        'is_pending',
        'user_info',
      ],
      overrideParent: 'pendingChangeRequest',
    },
    application_fnha_contribution: {
      schema: fnhaContribution,
      excludedKeys: [
        'id',
        'application_id',
        'updated_at',
        'created_at',
        'created_by',
        'updated_by',
        'archived_at',
        'archived_by',
        'reason_for_change',
        'user_info',
      ],
      overrideParent: 'fnhaContribution',
    },
    application_communities: {
      schema: communities.applicationCommunities,
      excludedKeys: ['user_info'],
      overrideParent: 'applicationCommunities',
    },
  };

  return configs[tableName] || null;
};
