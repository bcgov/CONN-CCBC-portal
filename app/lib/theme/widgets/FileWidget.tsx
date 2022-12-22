import React, { MutableRefObject, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';
import { Button } from '@button-inc/bcgov-theme';
import path from 'path';
import GenericModal from './GenericModal';
import { useCreateAttachment } from '../../../schema/mutations/attachment/createAttachment';
import { useDeleteAttachment } from '../../../schema/mutations/attachment/deleteAttachment';

import bytesToSize from '../../../utils/bytesToText';
import { CancelIcon, LoadingSpinner } from '../../../components';

const StyledContainer = styled('div')`
  margin-top: 16px;
  margin-bottom: 32px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  padding: 16px;
`;

const StyledDetails = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledH4 = styled('h4')`
  margin: 0;
`;

const StyledLink = styled.button`
  color: ${(props) => props.theme.color.links};
  text-decoration-line: underline;
`;

const StyledButton = styled(Button)`
  min-width: 160px;
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-left: 8px;
`;

const StyledError = styled('div')`
  color: #e71f1f;
  margin-top: 10px;
`;

const StyledFileDiv = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;

  margin-left: 16px;
  margin-top: 10px;
  & svg {
    margin: 0 8px;
  }
`;

const StyledDeleteBtn = styled('button')`
  &:hover {
    opacity: 0.6;
  }
`;

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

const Error = ({ error, fileTypes }) => {
  if (error === 'uploadFailed') {
    return <StyledError>File failed to upload, please try again</StyledError>;
  }

  if (error === 'deleteFailed') {
    return <StyledError>Delete file failed, please try again</StyledError>;
  }

  if (error === 'fileType') {
    return (
      <StyledError>
        Please use an accepted file type. Accepted types for this field are:
        <div>{fileTypes}</div>
      </StyledError>
    );
  }

  if (error === 'fileSize') {
    return <StyledError>Files must be less than 100MB.</StyledError>;
  }
  return null;
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

  const hiddenFileInput = useRef() as MutableRefObject<HTMLInputElement>;
  const allowMultipleFiles = uiSchema['ui:options']?.allowMultipleFiles;
  const acceptedFileTypes = uiSchema['ui:options']?.fileTypes;
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

    deleteAttachment({
      variables,
      onError: () => setError('deleteFailed'),
      onCompleted: (res) => {
        const attachmentRowId = res?.updateAttachmentByRowId?.attachment?.rowId;
        const indexOfFile = value.findIndex(
          (object) => object.id === attachmentRowId
        );
        const newFileList = [...value];
        newFileList.splice(indexOfFile, 1);
        const isFileListEmpty = newFileList.length <= 0;
        onChange(isFileListEmpty ? null : newFileList);
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
      },
    });

    e.target.value = '';
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const showModal =() =>{
    window.location.hash = `#${id}-file-error`;
  }
  const buttonLabel = () => {
    if (isFiles && !allowMultipleFiles) {
      return 'Replace';
    }
    if (isFiles && allowMultipleFiles) {
      return 'Add file';
    }
    if (allowMultipleFiles) {
      return 'Upload(s)';
    }
    return 'Upload';
  };

  const handleDownload = async (uuid, fileName) => {
    const url = `/api/s3/download/${uuid}/${fileName}`;
    await fetch(url)
      .then((response) => response.json())
      .then((response) => {
        if(response.avstatus) {
          showModal();
        }
        else {
          window.open(response, '_blank');
        }
      });
  };

  return (
    <StyledContainer style={{ border: error && '1px solid #E71F1F' }}>
      <StyledDetails>
        <StyledH4>{label}</StyledH4>
        {isFiles &&
          value.map((file: File) => (
            <StyledFileDiv key={file.uuid}>
              <StyledLink
                onClick={(e) => {
                  e.preventDefault();
                  handleDownload(file.uuid, file.name);
                }}
              >
                {file.name}
              </StyledLink>
              <StyledDeleteBtn
                data-testid="file-delete-btn"
                onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                  e.preventDefault();
                  handleDelete(file.id);
                }}
                disabled={isDeletingAttachment}
              >
                <CancelIcon />
              </StyledDeleteBtn>
            </StyledFileDiv>
          ))}
        {error && <Error error={error} fileTypes={acceptedFileTypes} />}
      </StyledDetails>
      <div>
        <StyledButton
          id={`${id}-btn`}
          onClick={(e: React.MouseEvent<HTMLInputElement>) => {
            e.preventDefault();
            handleClick();
          }}
          disabled={isCreatingAttachment || disabled}
        >
          {loading ? <LoadingSpinner /> : buttonLabel()}
        </StyledButton>
      </div>
      <input
        data-testid="file-test"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: 'none' }}
        type="file"
        required={required}
        accept={acceptedFileTypes && acceptedFileTypes.toString()}
      />
      <GenericModal  
        id={`${id}-file-error`}
        title='File error' 
        message='This file cannot be downloaded' />
    </StyledContainer>
  );
};

export default FileWidget;
