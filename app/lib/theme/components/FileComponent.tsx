import React, { MutableRefObject, useRef } from 'react';
import styled from 'styled-components';
import { Button } from '@button-inc/bcgov-theme';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { enUS } from '@mui/x-date-pickers/locales';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { CancelIcon, LoadingSpinner } from '../../../components';
import { getDateString, getStyles } from '../widgets/DatePickerWidget';

const StyledContainer = styled.div<{
  wrap?: boolean;
}>`
  margin-top: 8px;
  margin-bottom: 8px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  padding: 16px;
  flex-direction: ${({ wrap }) => (wrap ? 'column-reverse' : 'row')};
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

const StyledButton = styled(Button)<{
  addBottomMargin?: boolean;
}>`
  min-width: 160px;
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-left: 8px;
  ${({ addBottomMargin }) => addBottomMargin && `margin-bottom: 8px`};
`;

const StyledError = styled('div')`
  color: #e71f1f;
  margin-top: 10px;
`;

const StyledFileDiv = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  word-break: break-word;

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
  value?: Array<File>;
  handleDelete?: (fileId: number | string) => void;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  allowMultipleFiles?: boolean;
  fileTypes?: string;
  buttonVariant?: string;
  error?: string;
  id: string;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  label: React.ReactNode;
  statusLabel?: React.ReactNode;
  handleDownload?: Function;
  wrap?: boolean;
  hideFailedUpload?: boolean;
  useFileDate?: boolean;
  fileDateTitle?: string;
  fileDate?: any;
  setFileDate?: Function;
}

const ErrorMessage = ({ error, fileTypes }) => {
  if (error === 'uploadFailed') {
    return <StyledError>File failed to upload, please try again</StyledError>;
  }

  if (error === 'deleteFailed') {
    return <StyledError>Delete file failed, please try again</StyledError>;
  }

  if (error === 'sowImportFailed') {
    return (
      <StyledError>
        Statement of Work import failed, please check the file and try again
      </StyledError>
    );
  }

  if (error === 'communityProgressImportFailed') {
    return (
      <StyledError>
        Community Progress Report import failed, please check the file and try
        again
      </StyledError>
    );
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
  statusLabel,
  fileTypes,
  allowMultipleFiles,
  buttonVariant,
  handleDelete,
  loading,
  error,
  handleDownload,
  wrap,
  hideFailedUpload,
  useFileDate = false,
  fileDateTitle,
  fileDate,
  setFileDate,
}) => {
  const hiddenFileInput = useRef() as MutableRefObject<HTMLInputElement>;
  const isFiles = value?.length > 0;
  const hideIfFailed = !!error && hideFailedUpload;
  const isSecondary = buttonVariant === 'secondary';

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const buttonLabel = () => {
    if (isFiles && !hideIfFailed && !allowMultipleFiles) {
      return 'Replace';
    }
    if (isFiles && hideIfFailed && !allowMultipleFiles) {
      return 'Upload';
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
      wrap={wrap}
      className="file-widget"
      style={{ border: error && '1px solid #E71F1F' }}
    >
      <StyledDetails>
        <StyledH4>{label}</StyledH4>
        {isFiles &&
          !hideIfFailed &&
          value.map((file: File) => (
            <StyledFileDiv key={file.uuid}>
              <StyledLink
                data-testid="file-download-link"
                onClick={(e) => {
                  e.preventDefault();
                  if (handleDownload) {
                    handleDownload(file.uuid, file.name);
                  }
                }}
              >
                {file.name}
              </StyledLink>
              <StyledDeleteBtn
                data-testid="file-delete-btn"
                onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                  e.preventDefault();
                  if (handleDelete) {
                    handleDelete(file.id);
                  }
                }}
                disabled={loading || disabled}
              >
                <CancelIcon />
              </StyledDeleteBtn>
            </StyledFileDiv>
          ))}
        {error && <ErrorMessage error={error} fileTypes={fileTypes} />}
      </StyledDetails>
      <StyledDetails>{statusLabel}</StyledDetails>
      <div
        style={
          useFileDate
            ? { display: 'flex', flexDirection: 'row', alignItems: 'center' }
            : {}
        }
      >
        {useFileDate && (
          <div style={{ height: '100%' }}>
            <h4 style={{ marginBottom: '8px' }}>{`${fileDateTitle}`}</h4>
            <LocalizationProvider
              localeText={
                enUS.components.MuiLocalizationProvider.defaultProps.localeText
              }
              dateAdapter={AdapterDayjs}
            >
              <DesktopDatePicker
                id={id}
                sx={getStyles(false)}
                isError={false}
                disabled={false}
                readOnly={false}
                onChange={(d: Date) => {
                  const originalDate = new Date(d);
                  const realDate = new Date(originalDate.toDateString());
                  const newDate = getDateString(realDate);
                  const isDateInvalid = newDate === 'Invalid DateTime';
                  if (isDateInvalid) {
                    setFileDate(null);
                  } else {
                    setFileDate(newDate);
                  }
                }}
                value={fileDate ? dayjs(fileDate) : null}
                defaultValue={null}
                slotProps={{
                  actionBar: {
                    actions: ['clear', 'cancel'],
                  },
                  textField: {
                    inputProps: {
                      id,
                      'data-testid': 'datepicker-widget-input',
                    },
                  },
                }}
                format="YYYY-MM-DD"
              />
            </LocalizationProvider>
          </div>
        )}
        <div style={useFileDate ? { height: '100%', marginTop: '45px' } : {}}>
          <StyledButton
            addBottomMargin={wrap}
            id={`${id}-btn`}
            onClick={(e: React.MouseEvent<HTMLInputElement>) => {
              e.preventDefault();
              handleClick();
            }}
            variant={buttonVariant}
            disabled={loading || disabled || (useFileDate && !fileDate)}
          >
            {loading ? (
              <LoadingSpinner color={isSecondary ? '#000000' : '#fff'} />
            ) : (
              buttonLabel()
            )}
          </StyledButton>
        </div>
      </div>
      <input
        data-testid="file-test"
        ref={hiddenFileInput}
        onChange={(e) => {
          onChange(e);
          // set target to null to allow for reupload of file with same name
          e.currentTarget.value = null;
        }}
        style={{ display: 'none' }}
        type="file"
        required={required}
        accept={fileTypes?.toString()}
      />
    </StyledContainer>
  );
};

export default FileComponent;
