import { rfiSchema } from 'formSchema/analyst';

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

const getFileKey = (file: any) => file?.uuid ?? file?.id ?? file?.name;

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
        documentTypes.push(documentType);
        documentNames.push(
          ...newFiles.map((file) => file.name).filter(Boolean)
        );
      }
    }
  );

  return { documentTypes, documentNames };
};

export default getNewlyUploadedRfiFiles;
