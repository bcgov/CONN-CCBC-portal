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
  onChange,
  value,
  required,
  uiSchema,
}) => {
  const [fileList, setFileList] = useState<File[]>([]);
  const [error, setError] = useState('');
  const description = uiSchema['ui:description'];
  const hiddenFileInput = useRef() as MutableRefObject<HTMLInputElement>;
  const allowMultipleFiles = uiSchema['ui:options']?.allowMultipleFiles;
  const router = useRouter();

  const [createAttachment, isCreatingAttachment] = useCreateAttachment();
  const [deleteAttachment, isDeletingAttachment] = useDeleteAttachment();

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
          setError('File failed to upload, please try again');
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
      onError: (err) => console.log('error', err),
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

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const buttonLabel = () => {
    const isFiles = fileList.length > 0;
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
                >
                  <CancelIcon />
                </StyledDeleteBtn>
              </StyledFileDiv>
            );
          })}
        {error && <StyledError>{error}</StyledError>}
      </StyledDetails>
      <div>
        <StyledButton
          id={`${id}-btn`}
          onClick={(e: React.MouseEvent<HTMLInputElement>) => {
            e.preventDefault();
            handleClick();
          }}
        >
          {isCreatingAttachment ? <LoadingSpinner /> : buttonLabel()}
        </StyledButton>
      </div>
      <input
        data-testid="file-test"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: 'none' }}
        type="file"
        required={required}
      />
    </StyledContainer>
  );
};

export default FileWidget;
