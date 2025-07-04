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

export default ccbcData;
