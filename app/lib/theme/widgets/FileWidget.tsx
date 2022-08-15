import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';
import { Button } from '@button-inc/bcgov-theme';
import React from 'react';
import { useCreateAttachment } from '../../../schema/mutations/attachment/createAttachment';
import { useDeleteAttachment } from '../../../schema/mutations/attachment/deleteAttachment';

import bytesToSize from '../../../utils/bytesToText';
import { CancelIcon, LoadingSpinner } from '../../../components';
import path from 'path';

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

const StyledLink = styled('a')`
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

const FileWidget: React.FC<WidgetProps> = ({
  id,
  disabled,
  onChange,
  value,
  required,
  uiSchema,
}) => {
  const [fileList, setFileList] = useState<File[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();
  const [createAttachment, isCreatingAttachment] = useCreateAttachment();
  const [deleteAttachment, isDeletingAttachment] = useDeleteAttachment();

  const description = uiSchema['ui:description'];
  const hiddenFileInput = useRef() as MutableRefObject<HTMLInputElement>;
  const allowMultipleFiles = uiSchema['ui:options']?.allowMultipleFiles;
  const acceptedFileTypes = uiSchema['ui:options']?.fileTypes;
  const isFiles = fileList.length > 0;
  const loading = isCreatingAttachment || isDeletingAttachment;

  // 104857600 bytes = 100mb
  const maxFileSizeInBytes = 104857600;

  useEffect(() => {
    // Set state from value stored in RJSF if it exists
    value && setFileList(JSON.parse(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Update value in RJSF with useEffect instead of handleChange due to async setState delay
    onChange(JSON.stringify(fileList) || undefined);
  }, [fileList, onChange]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const formId = parseInt(router?.query?.id as string);
    const file = e.target.files?.[0];
    if (file) {
      const { name, size, type } = file;
      if (size > maxFileSizeInBytes) {
        setError('fileSize');
        return;
      }
      if (acceptedFileTypes && !checkFileType(file.name, acceptedFileTypes)) {
        setError('fileType');
        return;
      }
      if (isFiles && !allowMultipleFiles) {
        // Soft delete file if 'Replace' button is used for single file uploads
        const fileId = fileList[0].id;
        handleDelete(fileId);
      }

      const variables = {
        input: {
          attachment: {
            file: file,
            fileName: file.name,
            fileSize: bytesToSize(file.size),
            fileType: file.type,
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
          const id = res?.createAttachment?.attachment?.rowId;

          const fileDetails = {
            id: id,
            uuid: uuid,
            name: name,
            size: size,
            type: type,
          };

          if (allowMultipleFiles) {
            setFileList((prev) => [...prev, fileDetails]);
          } else {
            setFileList([fileDetails]);
          }
        },
      });
    }

    e.target.value = '';
  };

  const handleDelete = (attachmentId) => {
    setError('');
    const variables = {
      input: {
        attachmentPatch: {
          isDeleted: true,
        },
        rowId: attachmentId,
      },
    };

    deleteAttachment({
      variables,
      onError: () => setError('deleteFailed'),
      onCompleted: (res) => {
        const id = res?.updateAttachmentByRowId?.attachment?.rowId;
        const indexOfFile = fileList.findIndex((object) => {
          return object.id === id;
        });
        const newFileList = [...fileList];
        newFileList.splice(indexOfFile, 1);
        setFileList(newFileList);
      },
    });
  };

  const checkFileType = (file, fileTypes) => {
    const extension = path.extname(file)?.toLowerCase();
    const typesArr = fileTypes && fileTypes.replace(/ /g, '').split(',');

    return typesArr.includes(extension);
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const buttonLabel = () => {
    if (isFiles && !allowMultipleFiles) {
      return 'Replace';
    } else if (isFiles && allowMultipleFiles) {
      return 'Add file';
    } else if (allowMultipleFiles) {
      return 'Upload(s)';
    } else {
      return 'Upload';
    }
  };

  return (
    <StyledContainer style={{ border: error && '1px solid #E71F1F' }}>
      <StyledDetails>
        <StyledH4>{description}</StyledH4>
        {fileList.length > 0 &&
          fileList.map((file: File) => {
            return (
              <StyledFileDiv key={file.uuid}>
                <StyledLink>{file.name}</StyledLink>
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
            );
          })}
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
    </StyledContainer>
  );
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
    return <StyledError>Files must be less than 100mb.</StyledError>;
  } else return null;
};

export default FileWidget;
