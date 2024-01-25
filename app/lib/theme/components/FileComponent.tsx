import React, { MutableRefObject, useRef } from 'react';
import styled from 'styled-components';
import { Button } from '@button-inc/bcgov-theme';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { enUS } from '@mui/x-date-pickers/locales';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { DateTime } from 'luxon';
import useModal from 'lib/helpers/useModal';
import { LoadingSpinner } from '../../../components';
import { StyledDatePicker, getStyles } from '../widgets/DatePickerWidget';
import GenericModal from '../widgets/GenericModal';

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

const StyledInputContainer = styled.div<{ useFileDate?: boolean }>`
  ${({ useFileDate }) =>
    useFileDate
      ? `
        display: flex;
        flex-direction: row;
        align-items: center;
      `
      : ''};
`;

const StyledButtonContainer = styled.div<{ useFileDate?: boolean }>`
  ${({ useFileDate }) =>
    useFileDate
      ? `
      height: 100%; margin-top: 45px;
      `
      : ''};
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

const StyledDateDiv = styled.div`
  margin-left: 16px;
  margin-top: 4px;
`;

const StyledFileDiv = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  word-break: break-word;
  margin-left: 16px;
  margin-top: 10px;
  & svg {
    margin: 0px 8px;
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
  uploadedAt?: string;
  fileDate?: string;
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
  maxDate?: Date;
  minDate?: Date;
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
  maxDate,
  minDate,
}) => {
  const hiddenFileInput = useRef() as MutableRefObject<HTMLInputElement>;
  const isFiles = value?.length > 0;
  const hideIfFailed = !!error && hideFailedUpload;
  const isSecondary = buttonVariant === 'secondary';
  const fileErrorModal = useModal();

  // eslint-disable-next-line react/no-unstable-nested-components
  const ClearableIconButton = () => {
    return (
      <button type="button" onClick={() => setFileDate(undefined)}>
        <FontAwesomeIcon icon={faTimesCircle} color="#606060" />
      </button>
    );
  };

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

  const onError = () => fileErrorModal.open();

  return (
    <>
      <GenericModal
        id="file-error"
        title="File error"
        message="This file cannot be downloaded"
        {...fileErrorModal}
      />
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
              <>
                <StyledFileDiv key={file.uuid}>
                  <StyledLink
                    data-testid="file-download-link"
                    onClick={(e) => {
                      e.preventDefault();
                      if (handleDownload) {
                        handleDownload(file.uuid, file.name, onError);
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
                    <FontAwesomeIcon
                      width={10}
                      icon={faTrash}
                      color="rgb(189, 36, 36)"
                    />
                  </StyledDeleteBtn>
                </StyledFileDiv>
                {useFileDate && file?.fileDate && (
                  <StyledDateDiv>
                    {DateTime.fromISO(file.fileDate).toFormat('MMM dd, yyyy')}
                  </StyledDateDiv>
                )}
              </>
            ))}
          {error && <ErrorMessage error={error} fileTypes={fileTypes} />}
        </StyledDetails>
        <StyledDetails>{statusLabel}</StyledDetails>
        <StyledInputContainer useFileDate={useFileDate}>
          {useFileDate && (
            <div style={{ height: '100%' }}>
              <h4 style={{ marginBottom: '8px' }}>{`${fileDateTitle}`}</h4>
              <LocalizationProvider
                localeText={
                  enUS.components.MuiLocalizationProvider.defaultProps
                    .localeText
                }
                dateAdapter={AdapterDayjs}
              >
                <StyledDatePicker
                  maxDate={maxDate ? dayjs(maxDate) : undefined}
                  minDate={minDate ? dayjs(minDate) : undefined}
                  id={id}
                  sx={getStyles(false)}
                  disabled={false}
                  readOnly={false}
                  onChange={(d: Date | null) => {
                    const originalDate = new Date(d);
                    if (
                      !Number.isNaN(originalDate) &&
                      originalDate.valueOf() >= 0
                    ) {
                      const newDate = originalDate.toISOString().split('T')[0];
                      setFileDate(newDate);
                    } else {
                      setFileDate(null);
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
                  slots={{
                    openPickerButton: fileDate
                      ? ClearableIconButton
                      : undefined,
                  }}
                  format="YYYY-MM-DD"
                />
              </LocalizationProvider>
            </div>
          )}
          <StyledButtonContainer useFileDate={useFileDate}>
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
          </StyledButtonContainer>
        </StyledInputContainer>
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
    </>
  );
};

export default FileComponent;
