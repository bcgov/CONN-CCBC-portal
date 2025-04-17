import { useEffect, useState } from 'react';

type TemplateMap = Record<string, string>;

const useTemplateUpload = ({
  formData,
  formJsonData,
  applicationId,
  sendFailedReadWarning = false,
}: {
  formData: any;
  formJsonData: any;
  applicationId: string;
  sendFailedReadWarning?: boolean;
}) => {
  const [newFormData, setNewFormData] = useState(formJsonData);
  const [templateNineData, setTemplateNineData] = useState(null);
  const [templateData, setTemplateData] = useState(null);
  const [templateFiles, setTemplateFiles] = useState<TemplateMap>({});
  const [templatesUpdated, setTemplatesUpdated] = useState<TemplateMap>({});
  const [hasApplicationFormDataUpdated, setHasApplicationFormDataUpdated] =
    useState(false);
  const [excelImportFields, setExcelImportFields] = useState([]);
  const [excelImportFiles, setExcelImportFiles] = useState([]);

  useEffect(() => {
    const getFileDetails = (templateNumber) => {
      if (templateNumber === 1) {
        return formData?.rfiAdditionalFiles
          ?.eligibilityAndImpactsCalculator?.[0];
      }
      if (templateNumber === 2) {
        return formData?.rfiAdditionalFiles?.detailedBudget?.[0];
      }
      if (templateNumber === 9) {
        return formData?.rfiAdditionalFiles?.geographicNames?.[0];
      }

      return null;
    };

    if (templateData?.templateNumber && !templateData?.error) {
      const { templateNumber, templateName, data } = templateData;

      setExcelImportFields([
        ...excelImportFields,
        `Template ${templateNumber}`,
      ]);
      setExcelImportFiles([...excelImportFiles, templateName]);
      setTemplateFiles((prev) => ({
        ...prev,
        [templateNumber]: templateName,
      }));
      setTemplatesUpdated((prevTemplatesUpdated) => {
        return { ...prevTemplatesUpdated, [templateNumber]: true };
      });

      if (templateNumber === 1) {
        setNewFormData({
          ...newFormData,
          benefits: {
            ...newFormData.benefits,
            householdsImpactedIndigenous:
              data.result.totalNumberHouseholdsImpacted,
            numberOfHouseholds: data.result.finalEligibleHouseholds,
          },
        });
        setHasApplicationFormDataUpdated(true);
      } else if (templateNumber === 2) {
        setNewFormData({
          ...newFormData,
          budgetDetails: {
            ...newFormData.budgetDetails,
            totalEligibleCosts: templateData.data.result.totalEligibleCosts,
            totalProjectCost: templateData.data.result.totalProjectCosts,
          },
        });
        setHasApplicationFormDataUpdated(true);
      } else if (templateNumber === 9) {
        setTemplateNineData(templateData);
      }
      setTemplateData(null);
    }

    // notify if template 9 read fails
    const fileDetails = getFileDetails(templateData?.templateNumber);
    if (
      sendFailedReadWarning &&
      fileDetails &&
      templateData?.error &&
      (templateData?.templateNumber === 1 ||
        templateData?.templateNumber === 2 ||
        templateData?.templateNumber === 9)
    ) {
      fetch(`/api/email/notifyFailedReadOfTemplateData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          host: window.location.origin,
          params: {
            templateNumber: templateData.templateNumber,
            uuid: fileDetails.uuid,
            uploadedAt: fileDetails?.uploadedAt,
          },
        }),
      }).then(() => {
        setTemplateData(null);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateData, formData]);

  const clearTemplateUpload = (templateNumberToClear: number) => {
    // Remove template data from excel fields and files on delete
    const updatedExcelImportFields = excelImportFields.filter(
      (field) => field !== `Template ${templateNumberToClear}`
    );
    const updatedExcelImportFiles = excelImportFiles.filter(
      (file) => file !== templateFiles[templateNumberToClear]
    );
    setExcelImportFields(updatedExcelImportFields);
    setExcelImportFiles(updatedExcelImportFiles);

    const { [templateNumberToClear]: removedFile, ...updatedTemplateFiles } =
      templateFiles;
    const {
      [templateNumberToClear]: removedTemplate,
      ...updatedTemplatesUpdated
    } = templatesUpdated;
    setTemplateFiles(updatedTemplateFiles);
    setTemplatesUpdated(updatedTemplatesUpdated);

    // revert form data
    if (templateNumberToClear === 1) {
      setNewFormData({
        ...newFormData,
        benefits: {
          ...newFormData?.benefits,
          householdsImpactedIndigenous:
            formJsonData.benefits?.householdsImpactedIndigenous,
          numberOfHouseholds: formJsonData.benefits?.numberOfHouseholds,
        },
      });
      setHasApplicationFormDataUpdated(false);
    } else if (templateNumberToClear === 2) {
      setNewFormData({
        ...newFormData,
        budgetDetails: {
          ...newFormData?.budgetDetails,
          totalEligibleCosts: formJsonData.budgetDetails?.totalEligibleCosts,
          totalProjectCost: formJsonData.budgetDetails?.totalProjectCost,
        },
      });
      setHasApplicationFormDataUpdated(false);
    } else if (templateNumberToClear === 9) {
      setTemplateNineData(null);
    }
  };

  return {
    newFormData,
    templatesUpdated,
    hasApplicationFormDataUpdated,
    templateNineData,
    excelImportFields,
    excelImportFiles,
    setTemplateData,
    clearTemplateUpload,
  };
};

export default useTemplateUpload;
