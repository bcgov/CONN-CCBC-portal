import React, { useState } from 'react';
import { useRouter } from 'next/router';
import * as Sentry from '@sentry/nextjs';
import { WidgetProps } from '@rjsf/core';
import path from 'path';
import { useCreateAttachment } from '../../../schema/mutations/attachment/createAttachment';
import { useDeleteAttachment } from '../../../schema/mutations/attachment/deleteAttachment';

import bytesToSize from '../../../utils/bytesToText';
import FileComponent from '../components/FileComponent';

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

const checkFileType = (file, fileTypes) => {
  const extension = path.extname(file)?.toLowerCase();
  const typesArr = fileTypes && fileTypes.replace(/ /g, '').split(',');

  return typesArr.includes(extension);
};

const FileWidget: React.FC<FileWidgetProps> = ({
  id,
  disabled,
  onChange,
  value,
  required,
  uiSchema,
  label,
}) => {
  const [error, setError] = useState('');
  const router = useRouter();
  const [createAttachment, isCreatingAttachment] = useCreateAttachment();
  const [deleteAttachment, isDeletingAttachment] = useDeleteAttachment();

  const allowMultipleFiles =
    (uiSchema['ui:options']?.allowMultipleFiles as boolean) ?? false;
  const acceptedFileTypes = (uiSchema['ui:options']?.fileTypes as string) ?? '';
  const buttonVariant = (uiSchema['ui:options']?.buttonVariant ||
    'primary') as string;
  const isFiles = value?.length > 0;
  const loading = isCreatingAttachment || isDeletingAttachment;
  // 104857600 bytes = 100mb
  const maxFileSizeInBytes = 104857600;

  const handleDelete = (attachmentId) => {
    setError('');
    const variables = {
      input: {
        attachmentPatch: {
          archivedAt: new Date().toISOString(),
        },
        rowId: attachmentId,
      },
    };

    const deleteFileFromFormData = (res) => {
      const attachmentRowId = res?.updateAttachmentByRowId?.attachment?.rowId;
      const indexOfFile = value.findIndex(
        (object) => object.id === attachmentRowId
      );
      const newFileList = [...value];
      newFileList.splice(indexOfFile, 1);
      const isFileListEmpty = newFileList.length <= 0;
      onChange(isFileListEmpty ? null : newFileList);
    };

    deleteAttachment({
      variables,
      onError: (res) => {
        /// Allow files to be deleted from form data if attachment record was already archived
        if (res.message.includes('Deleted records cannot be modified')) {
          deleteFileFromFormData(res);
        } else {
          setError('deleteFailed');
        }
      },
      onCompleted: (res) => {
        deleteFileFromFormData(res);
      },
    });
  };

  const validateFile = (file: globalThis.File) => {
    if (!file) return { isValid: false, error: '' };

    const { size } = file;
    if (size > maxFileSizeInBytes) {
      return { isValid: false, error: 'fileSize' };
    }
    if (acceptedFileTypes && !checkFileType(file.name, acceptedFileTypes)) {
      return { isValid: false, error: 'fileType' };
    }

    return { isValid: true, error: null };
  };

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

    const { isValid, error: newError } = validateFile(file);
    if (!isValid) {
      setError(newError);
      return;
    }

    const { name, size, type } = file;

    if (isFiles && !allowMultipleFiles) {
      // Soft delete file if 'Replace' button is used for single file uploads
      const fileId = value[0].id;
      handleDelete(fileId);
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

  const showModal = () => {
    window.location.hash = 'file-error';
  };

  const handleDownload = async (uuid, fileName) => {
    const url = `/api/s3/download/${uuid}/${fileName}`;
    await fetch(url)
      .then((response) => response.json())
      .then((response) => {
        if (response.avstatus) {
          showModal();
        } else {
          window.open(response, '_blank');
        }
      });
  };

  return (
    <FileComponent
      allowMultipleFiles={allowMultipleFiles as boolean}
      isCreatingAttachment={isCreatingAttachment}
      isDeletingAttachment={isDeletingAttachment}
      error={error}
      buttonVariant={buttonVariant}
      handleDelete={handleDelete}
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
