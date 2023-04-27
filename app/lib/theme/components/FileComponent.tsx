import React, { MutableRefObject, useRef } from 'react';
import styled from 'styled-components';
import { Button } from '@button-inc/bcgov-theme';
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

interface FileComponentProps {
  value: Array<File>;
  handleDelete: (fileId: number | string) => void;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  allowMultipleFiles: boolean;
  fileTypes: string;
  buttonVariant: string;
  error: string;
  id: string;
  disabled: boolean;
  loading: boolean;
  required: boolean;
  label: string;
  handleDownload(uuid: string, fileName: string): Promise<void>;
}

const ErrorMessage = ({ error, fileTypes }) => {
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

const FileComponent: React.FC<FileComponentProps> = ({
  id,
  disabled,
  onChange,
  value,
  required,
  label,
  fileTypes,
  allowMultipleFiles,
  buttonVariant,
  handleDelete,
  loading,
  error,
  handleDownload,
}) => {
  const hiddenFileInput = useRef() as MutableRefObject<HTMLInputElement>;
  const isFiles = value?.length > 0;
  const isSecondary = buttonVariant === 'secondary';

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

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

  return (
    <StyledContainer
      className="file-widget"
      style={{ border: error && '1px solid #E71F1F' }}
    >
      <StyledDetails>
        <StyledH4>{label}</StyledH4>
        {isFiles &&
          value.map((file: File) => (
            <StyledFileDiv key={file.uuid}>
              <StyledLink
                data-testid="file-download-link"
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
                disabled={loading || disabled}
              >
                <CancelIcon />
              </StyledDeleteBtn>
            </StyledFileDiv>
          ))}
        {error && <ErrorMessage error={error} fileTypes={fileTypes} />}
      </StyledDetails>
      <div>
        <StyledButton
          id={`${id}-btn`}
          onClick={(e: React.MouseEvent<HTMLInputElement>) => {
            e.preventDefault();
            handleClick();
          }}
          variant={buttonVariant}
          disabled={loading || disabled}
        >
          {loading ? (
            <LoadingSpinner color={isSecondary ? '#000000' : '#fff'} />
          ) : (
            buttonLabel()
          )}
        </StyledButton>
      </div>
      <input
        data-testid="file-test"
        ref={hiddenFileInput}
        onChange={onChange}
        style={{ display: 'none' }}
        type="file"
        required={required}
        accept={fileTypes && fileTypes.toString()}
      />
    </StyledContainer>
  );
};

export default FileComponent;
