import React, { useState } from 'react';
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

const acceptedFileTypes = '.xls, .xlsx, .xlsm';

const SowImportFileWidget: React.FC<FileWidgetProps> = ({
  id,
  disabled,
  onChange,
  value,
  required,
  label,
}) => {
  const [error, setError] = useState('');
  const router = useRouter();
  const [createAttachment, isCreatingAttachment] = useCreateAttachment();
  const [deleteAttachment, isDeletingAttachment] = useDeleteAttachment();
  const [isImporting, setIsImporting] = useState(false);
  const isFiles = value?.length > 0;
  const loading = isCreatingAttachment || isDeletingAttachment || isImporting;
  const maxFileSizeInBytes = 104857600;
  const fileId = isFiles && value[0].id;

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsImporting(true);
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

    if (isFiles) {
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

    const formData = new FormData();
    formData.append('file', file);

    await fetch('/api/analyst/sow', {
      method: 'POST',
      body: formData,
    }).then((response) => {
      const { status } = response;
      if (status === 200) {
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
            onChange([fileDetails]);
            setIsImporting(false);
            span.setStatus('ok');
            span.finish();
            transaction.finish();
          },
        });
      } else {
        setError('sowImportFailed');
        setIsImporting(false);
        span.setStatus('unknown_error');
        span.finish();
        transaction.finish();
      }
    });
  };

  return (
    <FileComponent
      loading={loading}
      error={error}
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

export default SowImportFileWidget;
