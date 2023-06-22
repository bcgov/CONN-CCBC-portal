import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import * as Sentry from '@sentry/nextjs';
import { WidgetProps } from '@rjsf/core';
import {
  handleDelete,
  validateFile,
  handleDownload,
} from 'lib/theme/functions/fileWidgetFunctions';
import { useCreateAttachment } from 'schema/mutations/attachment/createAttachment';
import { useDeleteAttachment } from 'schema/mutations/attachment/deleteAttachment';
import bytesToSize from 'utils/bytesToText';
import FileComponent from 'lib/theme/components/FileComponent';

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

const FileWidget: React.FC<FileWidgetProps> = ({
  id,
  disabled,
  onChange,
  value,
  required,
  uiSchema,
  label,
  rawErrors,
}) => {
  const [error, setError] = useState('');
  const router = useRouter();
  const [createAttachment, isCreatingAttachment] = useCreateAttachment();
  const [deleteAttachment, isDeletingAttachment] = useDeleteAttachment();
  const wrap = uiSchema['ui:options']?.wrap ?? false;
  const allowMultipleFiles =
    (uiSchema['ui:options']?.allowMultipleFiles as boolean) ?? false;
  const acceptedFileTypes = (uiSchema['ui:options']?.fileTypes as string) ?? '';
  const buttonVariant = (uiSchema['ui:options']?.buttonVariant ||
    'primary') as string;
  const isFiles = value?.length > 0;
  const loading = isCreatingAttachment || isDeletingAttachment;
  // 104857600 bytes = 100mb
  const maxFileSizeInBytes = 104857600;
  const fileId = isFiles && value[0].id;

  useEffect(() => {
    if (rawErrors?.length > 0) {
      setError('rjsf_validation');
    }
  }, [rawErrors, setError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const transaction = Sentry.startTransaction({ name: 'ccbc.function' });
    const span = transaction.startChild({
      op: 'file-widget-handle-upload',
      description: 'FileWidget handleUpload function',
    });

    if (loading) return;
    setError('');
    const formId =
      parseInt(router?.query?.id as string, 10) ||
      parseInt(router?.query?.applicationId as string, 10);
    const file = e.target.files?.[0];

    const { isValid, error: newError } = validateFile(
      file,
      maxFileSizeInBytes,
      acceptedFileTypes
    );
    if (!isValid) {
      setError(newError);
      return;
    }

    const { name, size, type } = file;

    if (isFiles && !allowMultipleFiles) {
      // Soft delete file if 'Replace' button is used for single file uploads
      handleDelete(fileId, deleteAttachment, setError, value, onChange);
    }

    const variables = {
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

    createAttachment({
      variables,
      onError: () => {
        setError('uploadFailed');

        span.setStatus('unknown_error');
        span.finish();
        transaction.finish();
      },
      onCompleted: (res) => {
        const uuid = res?.createAttachment?.attachment?.file;
        const attachmentRowId = res?.createAttachment?.attachment?.rowId;

        const fileDetails = {
          id: attachmentRowId,
          uuid,
          name,
          size,
          type,
        };

        if (allowMultipleFiles) {
          onChange(value ? [...value, fileDetails] : [fileDetails]);
        } else {
          onChange([fileDetails]);
        }

        span.setStatus('ok');
        span.finish();
        transaction.finish();
      },
    });

    e.target.value = '';
  };

  return (
    <FileComponent
      wrap={wrap as boolean}
      allowMultipleFiles={allowMultipleFiles}
      loading={isCreatingAttachment || isDeletingAttachment}
      error={error}
      buttonVariant={buttonVariant}
      handleDelete={() =>
        handleDelete(fileId, deleteAttachment, setError, value, onChange)
      }
      handleDownload={handleDownload}
      onChange={handleChange}
      disabled={disabled}
      fileTypes={acceptedFileTypes}
      id={id}
      label={label}
      required={required}
      value={value}
    />
  );
};

export default FileWidget;
