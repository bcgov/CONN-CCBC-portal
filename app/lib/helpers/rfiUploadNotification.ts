import { rfiSchema } from 'formSchema/analyst';

export const getFileKey = (file: any) => file?.uuid ?? file?.id ?? file?.name;

const getRfiAdditionalFileFields = () => {
  const { dependencies } = (rfiSchema as any).properties.rfiAdditionalFiles;

  return Object.fromEntries(
    Object.entries(dependencies).map(
      ([rfiFieldName, dependency]: [string, any]) => {
        const fieldName = rfiFieldName.replace(/Rfi$/, '');
        return [fieldName, dependency.properties[fieldName].title];
      }
    )
  );
};

const rfiAdditionalFileFields = getRfiAdditionalFileFields();

export const getNewlyUploadedRfiEmailCorrespondence = (
  previousFormData: any,
  updatedFormData: any
) => {
  const previousEmailCorrespondence =
    previousFormData?.rfiEmailCorrespondance ?? [];
  const updatedEmailCorrespondence =
    updatedFormData?.rfiEmailCorrespondance ?? [];
  const previousFileKeys = new Set(previousEmailCorrespondence.map(getFileKey));

  return updatedEmailCorrespondence.filter(
    (file) => !previousFileKeys.has(getFileKey(file))
  );
};

const getNewlyUploadedRfiFiles = (
  previousFormData: any,
  updatedFormData: any
) => {
  const previousAdditionalFiles = previousFormData?.rfiAdditionalFiles ?? {};
  const updatedAdditionalFiles = updatedFormData?.rfiAdditionalFiles ?? {};
  const documentTypes: string[] = [];
  const documentNames: string[] = [];

  Object.entries(rfiAdditionalFileFields).forEach(
    ([fieldName, documentType]) => {
      const files = updatedAdditionalFiles[fieldName];

      if (!Array.isArray(files)) return;

      const previousFileKeys = new Set(
        (previousAdditionalFiles[fieldName] ?? []).map(getFileKey)
      );
      const newFiles = files.filter(
        (file) => !previousFileKeys.has(getFileKey(file))
      );

      if (newFiles.length > 0) {
        newFiles.forEach((file) => {
          if (!file.name) return;

          documentTypes.push(documentType);
          documentNames.push(file.name);
        });
      }
    }
  );

  return { documentTypes, documentNames };
};

export const notifyRfiEmailCorrespondenceUpload = ({
  previousRfiFormData,
  rfiFormData,
  applicationId,
  rfiNumber,
  ccbcNumber,
  notifyDocumentUpload,
}: {
  previousRfiFormData: any;
  rfiFormData: any;
  applicationId: string | number;
  rfiNumber: string;
  ccbcNumber?: string;
  notifyDocumentUpload: (applicationId: string | number, params: any) => void;
}) => {
  const uploadedEmailCorrespondence = getNewlyUploadedRfiEmailCorrespondence(
    previousRfiFormData,
    rfiFormData
  );

  if (uploadedEmailCorrespondence.length === 0) return;

  notifyDocumentUpload(applicationId, {
    ccbcNumber: ccbcNumber ?? undefined,
    rfiNumber,
    documentTypes: ['Email Correspondence'],
    documentNames: uploadedEmailCorrespondence
      .map((file) => file.name)
      .filter(Boolean),
  });
};

export const notifyRfiDocumentUpload = ({
  previousRfiFormData,
  rfiFormData,
  applicationId,
  rfiNumber,
  ccbcNumber,
  notifyDocumentUpload,
}: {
  previousRfiFormData: any;
  rfiFormData: any;
  applicationId: string | number;
  rfiNumber: string;
  ccbcNumber?: string;
  notifyDocumentUpload: (applicationId: string | number, params: any) => void;
}) => {
  const { documentTypes, documentNames } = getNewlyUploadedRfiFiles(
    previousRfiFormData,
    rfiFormData
  );

  if (documentTypes.length === 0) return;

  notifyDocumentUpload(applicationId, {
    ccbcNumber: ccbcNumber ?? undefined,
    rfiNumber,
    documentTypes,
    documentNames,
  });
};
