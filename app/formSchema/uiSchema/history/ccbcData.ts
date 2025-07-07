import { historyDetailsExcludedkeys } from 'components/Analyst/History/constants';
import { gis } from 'formSchema/analyst';
import gisAssessmentHhSchema from 'formSchema/uiSchema/history/gisAssessmentHh';
import applicationDiffSchema from './application';
import applicationAnnounced from './applicationAnnounced';
import applicationGisDataSchema from './applicationGisData';
import applicationSowDataSchema from './applicationSowData';
import conditionalApprovalSchema from './conditionalApproval';
import fnhaContribution from './fnhaContribution';
import projectInformationSchema from './projectInformation';
import rfiDiffSchema from './rfi';
import screeningSchema from './screening';
import changeRequest from 'formSchema/analyst/changeRequest';

const ccbcData = {
  ccbcData: {
    type: "object",
    properties: {
      statementOfWorkUpload: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            size: { type: "integer" },
            type: "string",
            uuid: { type: "string", format: "uuid" }
          },
          required: ["id", "name", "size", "type", "uuid"]
        }
      },
      fundingAgreementUpload: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            size: { type: "integer" },
            type: "string",
            uuid: { type: "string", format: "uuid" },
            uploadedAt: { type: "string", format: "date-time" }
          },
          required: ["id", "name", "size", "type", "uuid", "uploadedAt"]
        }
      },
      finalizedMapUpload: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            size: { type: "integer" },
            type: "string",
            uuid: { type: "string", format: "uuid" }
          }
        }
      },
      sowWirelessUpload: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            size: { type: "integer" },
            type: "string",
            uuid: { type: "string", format: "uuid" }
          }
        }
      },
      isSowUploadError: {
        type: "boolean"
      },
      otherFiles: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            size: { type: "integer" },
            type: "string",
            uuid: { type: "string", format: "uuid" }
          }
        }
      },
      dateFundingAgreementSigned: {
        type: "string",
        format: "date"
      },
      hasFundingAgreementBeenSigned: {
        type: "boolean"
      }
    }
  }
};


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
export const ccbcSch = {
  application_community_progress_report_data: {
    diffSchema: communityReportSchema,
    excludedKeys: ['ccbc_number', 'progressReportFile'],
    overrideParent: 'communityReport',
  },
  application_milestone_data: {
    diffSchema: communityReportSchema,
    excludedKeys: ['ccbc_number', 'milestoneFile', 'evidenceOfCompletionFile'],
    overrideParent: 'communityReport',
  },
  application_pending_change_request: {
    diffSchema: pendingChangeRequestSchema,
    excludedKeys: [
      'id',
      'created_at',
      'updated_at',
      'created_by',
      'updated_by',
      'archived_at',
      'archived_by',
      'is_pending',
      // 'comment' is optionally excluded if null
    ],
    overrideParent: 'pendingChangeRequest',
  },
  rfi_data: {
    diffSchema: rfiDiffSchema,
    excludedKeys: [
      ...historyDetailsExcludedkeys,
      'rfiAdditionalFiles',
      ],
    overrideParent: 'rfi',
  },
  application_announced: {
    diffSchema: applicationAnnounced,
    excludedKeys: [
      'id',
      'updated_at',
      'created_at',
      'created_by',
      'updated_by',
      'archived_at',
      'archived_by',
    ],
    overrideParent: 'applicationAnnounced',
  },
  form_data: {
    diffSchema: applicationDiffSchema,
    excludedKeys: [
      'id',
      'createdAt',
      'updatedAt',
      'applicationId',
      'acknowledgements',
      'supportingDocuments',
      'coverage',
      'templateUploads',
    ],
  },
  application_dependencies: {
    diffSchema: {
      applicationDependencies: {
        properties: {
          crtcProjectDependent: { title: 'CRTC Project Dependent' },
          connectedCoastNetworkDependent: {
            title: 'Connected Coast Network Dependent',
          },
        },
      },
    },
    excludedKeys: ['id', 'createdAt', 'updatedAt', 'applicationId'],
    overrideParent: 'applicationDependencies',
  },
  assessment_data: {
    diffSchema: {
      screening: screeningSchema,
      gis: gis,
    },
    excludedKeys: [
      'id',
      'name',
      'size',
      'type',
      'uuid',
      'uploadedAt',
      'otherFiles',
      'assessmentTemplate',
    ],
    overrideParent: '[assessmentType]', // dynamic
  },
  conditional_approval_data: {
    diffSchema: conditionalApprovalSchema,
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
    ],
    overrideParent: 'conditionalApproval',
  },
  application_gis_data: {
    diffSchema: applicationGisDataSchema,
    excludedKeys: ['ccbc_number'],
    overrideParent: 'gis',
  },
  application_gis_assessment_hh: {
    diffSchema: gisAssessmentHhSchema,
    excludedKeys: [
      'id',
      'updated_at',
      'created_at',
      'created_by',
      'updated_by',
      'archived_at',
      'archived_by',
    ],
    overrideParent: 'gis',
  },
  project_information_data: {
    diffSchema: projectInformationSchema,
    excludedKeys: [
      'upload',
      'sowWirelessUpload',
      'statementOfWorkUpload',
      'finalizedMapUpload',
      'fundingAgreementUpload',
      'otherFiles',
    ],
    overrideParent: 'projectInformation',
  },
  application_sow_data: {
    diffSchema: applicationSowDataSchema,
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
    ],
    overrideParent: 'application_sow_data',
  },
  application_fnha_contribution: {
    diffSchema: fnhaContribution,
    excludedKeys: [
      'id',
      'updated_at',
      'created_at',
      'created_by',
      'updated_by',
      'archived_at',
      'archived_by',
      'reason_for_change',
    ],
    overrideParent: 'fnhaContribution',
  },
  attachment: {
    diffSchema: {
      properties: {
        file_name: {
          title: 'File Name',
          type: 'string',
        }
      }
    },
    excludedKeys: [
      'id', 'created_at', 'updated_at',
      'created_by', 'updated_by', 'archived_at',
      'archived_by', 'file_type', 'file_size',
      'application_id', 'application_status_id',
    ],
    overrideParent: 'attachment',
  },
  application_project_type: {
    diffSchema: {
      properties: {
        project_type: {
          title: 'Project Type',
          type: 'string',
        }
      }
    },
    excludedKeys: [
      'id', 'created_at', 'updated_at',
      'created_by', 'updated_by', 'archived_at',
      'archived_by', 'application_id',
    ],
    overrideParent: 'application_project_type',
  },
  application_package: {
    diffSchema: {
      properties: {
        package: {
          title: 'Package',
          type: 'string',
        }
      }
    },
    excludedKeys: [
      'id', 'created_at', 'updated_at',
      'created_by', 'updated_by', 'archived_at',
      'archived_by', 'application_id',
    ],
    overrideParent: 'application_project_type',
  },
  change_request_data: {
    diffSchema: {
      amendment_number: {
        title: 'Amendment Number',
        type: 'number',
      },
      json_data: changeRequest,
    },
    excludedKeys: [
      'id',
      'created_at',
      'updated_at',
      'created_by',
      'updated_by',
      'archived_at',
      'archived_by',
      'application_id',
      'application_status_id',
    ],
    overrideParent: 'change_request_data',
  }
};
export default ccbcData;
