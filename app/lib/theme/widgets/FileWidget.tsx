import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { WidgetProps } from '@rjsf/utils';
import {
  handleDelete,
  validateFile,
  handleDownload,
} from 'lib/theme/functions/fileWidgetFunctions';
import { useCreateAttachment } from 'schema/mutations/attachment/createAttachment';
import { useDeleteAttachment } from 'schema/mutations/attachment/deleteAttachment';
import bytesToSize from 'utils/bytesToText';
import FileComponent from 'lib/theme/components/FileComponent';
import useDisposeOnRouteChange from 'lib/helpers/useDisposeOnRouteChange';
import { DateTime } from 'luxon';
import { useToast } from 'components/AppProvider';
import { ToastType } from 'components/Toast';
import reportClientError from 'lib/helpers/reportClientError';

type File = {
  id: string | number;
  uuid: string;
  name: string;
  size: number;
  type: string;
};

interface FileWidgetProps extends WidgetProps {
  value: Array<File>;
}

export async function processFileTemplate(
  file: any,
  setTemplateData: Function,
  templateNumber: number,
  isApplicantPage: boolean,
  formId: number,
  rfiNumber: string
) {
  let isTemplateValid = true;
  const fileFormData = new FormData();
  if (file) {
    fileFormData.append('file', file);
    if (setTemplateData) {
      try {
        if (templateNumber !== 9) {
          const response = await fetch(
            `/api/applicant/template?templateNumber=${templateNumber}`,
            {
              method: 'POST',
              body: fileFormData,
            }
          );
          if (response.ok) {
            const data = await response.json();
            setTemplateData({
              templateNumber,
              data,
              templateName: file.name,
            });
          } else {
            isTemplateValid = false;
            setTemplateData({
              templateNumber,
              error: true,
            });
          }
        } else if (templateNumber === 9) {
          if (isApplicantPage) {
            // fetch for applicant and handle as expected
            const response = await fetch(
              `/api/template-nine/rfi/applicant/${formId}/${rfiNumber}`,
              {
                method: 'POST',
                body: fileFormData,
              }
            );
            if (response.ok) {
              const data = await response.json();
              setTemplateData({
                templateNumber,
                data,
                templateName: file.name,
              });
            } else {
              isTemplateValid = false;
              setTemplateData({
                templateNumber,
                error: true,
              });
            }
          } else {
            const response = await fetch(
              `/api/template-nine/rfi/${formId}/${rfiNumber}`,
              {
                method: 'POST',
                body: fileFormData,
              }
            );
            if (response.ok) {
              const data = await response.json();
              setTemplateData({
                templateNumber,
                data,
                templateName: file.name,
              });
            } else {
              isTemplateValid = false;
              setTemplateData({
                templateNumber,
                error: true,
              });
            }
          }
        }
      } catch (error) {
        isTemplateValid = false;
        setTemplateData({
          templateNumber,
          error: true,
        });
        reportClientError(error, { source: 'file-widget-template-validate' });
      }
    }
  }
  return isTemplateValid;
}

const FileWidget: React.FC<FileWidgetProps> = ({
  id,
  disabled,
  onChange,
  value,
  required,
  uiSchema,
  label,
  rawErrors,
  formContext,
}) => {
  const [errors, setErrors] = useState([]);
  const router = useRouter();
  const [createAttachment, isCreatingAttachment] = useCreateAttachment();
  const [deleteAttachment, isDeletingAttachment] = useDeleteAttachment();
  const [fileDate, setFileDate] = useState(null);
  const setDisposable = useDisposeOnRouteChange();
  const wrap = uiSchema['ui:options']?.wrap ?? false;
  const allowMultipleFiles =
    (uiSchema['ui:options']?.allowMultipleFiles as boolean) ?? false;
  const allowDragAndDrop =
    (uiSchema['ui:options']?.allowDragAndDrop as boolean) ?? false;
  const maxDate = uiSchema['ui:options']?.maxDate as Date;
  const minDate = uiSchema['ui:options']?.minDate as Date;
  const acceptedFileTypes = (uiSchema['ui:options']?.fileTypes as string) ?? '';
  const useFileDate = (uiSchema['ui:options']?.useFileDate as boolean) ?? false;
  const fileDateTitle = uiSchema['ui:options']?.fileDateTitle as string;
  const buttonVariant = (uiSchema['ui:options']?.buttonVariant ||
    'primary') as string;
  const templateValidate =
    (uiSchema['ui:options']?.templateValidate as boolean) ?? false;
  const showValidationToast =
    (uiSchema['ui:options']?.showValidationMessage as boolean) ?? false;
  const templateNumber =
    (uiSchema['ui:options']?.templateNumber as number) ?? 0;
  const showTemplateUploadIndication =
    (uiSchema['ui:options']?.showTemplateUploadIndication as boolean) ?? false;
  const isFiles = value?.length > 0;
  const loading = isCreatingAttachment || isDeletingAttachment;
  // 104857600 bytes = 100mb
  const maxFileSizeInBytes = 104857600;
  const fileId = isFiles && value[0].id;
  const { setTemplateData, clearTemplateUpload, rfiNumber } = formContext;
  const { showToast, hideToast } = useToast();

  const isApplicantPage = router.pathname.includes('applicant');

  useEffect(() => {
    if (rawErrors?.length > 0) {
      setErrors([{ error: 'rjsf_validation' }]);
    }
  }, [rawErrors, setErrors]);

  const getValidatedFile = async (file: any, formId: number) => {
    const isTemplateValid = templateValidate
      ? await processFileTemplate(
          file,
          setTemplateData,
          templateNumber,
          isApplicantPage,
          formId,
          rfiNumber
        )
      : true;

    const { name, size, type } = file;
    const { isValid, error: newError } = validateFile(
      file,
      maxFileSizeInBytes,
      acceptedFileTypes
    );
    if (!isValid) {
      return { error: newError, fileName: name };
    }

    return {
      isTemplateValid,
      input: {
        attachment: {
          file,
          fileName: name,
          fileSize: bytesToSize(size),
          fileType: type,
          applicationId: formId,
        },
      },
    };
  };

  const handleUpload = (variables: any): Promise<any> => {
    return new Promise((resolve) => {
      const { input } = variables;
      const { file } = input.attachment;
      const disposableEvent = createAttachment({
        variables,
        onError: () => {
          resolve({
            error: 'uploadFailed',
            fileName: file.name,
          });
        },
        onCompleted: (res) => {
          const uuid = res?.createAttachment?.attachment?.file;
          const attachmentRowId = res?.createAttachment?.attachment?.rowId;

          const fileDetails = {
            id: attachmentRowId,
            uuid,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: DateTime.now().toISO(),
            ...(useFileDate ? { fileDate } : {}),
          };
          resolve(fileDetails);
        },
      });
      setDisposable(disposableEvent);
    });
  };

  const showToastMessage = (files, type: ToastType = 'success') => {
    let fields: string;
    if (templateNumber === 1) {
      fields = 'Total Households and Indigenous Households data';
    } else if (templateNumber === 2) {
      fields = 'Total eligible costs and Total project costs data';
    } else if (templateNumber === 9) {
      fields = 'geographic names';
    }
    let message: string;
    if (templateNumber === 9) {
      message =
        type === 'success'
          ? `Template ${templateNumber} processing successful, geographic names will be automatically update or create upon 'Save'.`
          : `Template ${templateNumber} validation failed: ${files.join(', ')} failed to validate. ${fields} in the application will not update.`;
    } else {
      message =
        type === 'success'
          ? `Template ${templateNumber} validation successful, new values for ${fields} in the application will update upon 'Save'`
          : `Template ${templateNumber} validation failed: ${files.join(', ')} did not validate due to formatting issues. ${fields} in the application will not update.`;
    }
    showToast(message, type, 100000000);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (loading) return;
    hideToast();
    const formId =
      parseInt(router?.query?.id as string, 10) ||
      parseInt(router?.query?.applicationId as string, 10);

    if (isFiles && !allowMultipleFiles) {
      // Soft delete file if 'Replace' button is used for single file uploads
      handleDelete(fileId, deleteAttachment, setErrors, value, onChange);
    }

    const files = allowMultipleFiles ? e.target.files : [e.target.files?.[0]];
    const resp = await Promise.all(
      Array.from(files).map(async (file) => getValidatedFile(file, formId))
    );
    const validatedFiles = resp.filter((file) => file.input);
    setErrors(resp.filter((file) => file.error));

    const validationErrors = resp.filter((file) => !file.isTemplateValid);

    const uploadResponse = await Promise.all(
      validatedFiles.map(async (payload) => handleUpload(payload))
    );

    const fileDetails = uploadResponse.filter((file) => !file.error);

    const uploadErrors = uploadResponse.filter((file) => file.error);
    if (uploadErrors.length > 0) {
      setErrors([...errors, ...uploadErrors]);
    }

    if (templateValidate && showValidationToast) {
      if (validationErrors.length > 0) {
        showToastMessage(
          validationErrors.map(
            (error) => error.fileName || error.input?.attachment?.fileName
          ),
          'error'
        );
      } else if (validationErrors.length === 0 && uploadErrors.length === 0) {
        showToastMessage(fileDetails.map((file) => file.name));
      }
    }

    if (allowMultipleFiles) {
      onChange(value ? [...value, ...fileDetails] : fileDetails);
    } else {
      onChange(fileDetails);
    }
    setFileDate(null);

    e.target.value = '';
  };

  return (
    <FileComponent
      wrap={wrap as boolean}
      allowMultipleFiles={allowMultipleFiles}
      loading={isCreatingAttachment || isDeletingAttachment}
      errors={errors}
      buttonVariant={buttonVariant}
      handleDelete={(f) =>
        handleDelete(f, deleteAttachment, setErrors, value, (e) => {
          onChange(e);
          // handle template delete
          if (templateNumber && clearTemplateUpload) {
            clearTemplateUpload(templateNumber);
          }
        })
      }
      handleDownload={handleDownload}
      onChange={handleChange}
      disabled={disabled}
      fileTypes={acceptedFileTypes}
      id={id}
      label={label}
      required={required}
      hideFailedUpload={false}
      value={value}
      useFileDate={useFileDate}
      fileDate={fileDate}
      setFileDate={setFileDate}
      fileDateTitle={fileDateTitle}
      maxDate={maxDate}
      minDate={minDate}
      allowDragAndDrop={allowDragAndDrop}
      templateNumber={templateNumber}
      showTemplateUploadIndication={showTemplateUploadIndication}
    />
  );
};

export default FileWidget;
