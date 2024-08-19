import React, { MutableRefObject, useRef } from 'react';
import styled from 'styled-components';
import { Button } from '@button-inc/bcgov-theme';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { enUS } from '@mui/x-date-pickers/locales';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
  faTrash,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { DateTime } from 'luxon';
import useModal from 'lib/helpers/useModal';
import TemplateDescription from 'components/Analyst/RFI/TemplateDescription';
import { LoadingSpinner } from '../../../components';
import { StyledDatePicker, getStyles } from '../widgets/DatePickerWidget';
import GenericModal from '../widgets/GenericModal';

const StyledContainer = styled.div<{
  wrap?: boolean;
}>`
  margin-top: 8px;
  margin-bottom: 8px;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  padding: 16px;
`;

const StyledInnerContainer = styled.div<{
  wrap?: boolean;
}>`
  display: flex;
  justify-content: space-between;
  flex-direction: ${({ wrap }) => (wrap ? 'column-reverse' : 'row')};
`;

const StyledFooterText = styled('div')`
  width: 100%;
  font-size: 14px;
  color: #606060;
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

const StyledButtonDiv = styled('div')`
  display: flex;
  flex-direction: column;
`;

const StyledIconSpan = styled('span')`
  font-size: 13px;
  & svg {
    margin-right: 3px;
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
  errors?: Array<any>;
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
  allowDragAndDrop?: boolean;
  templateNumber?: number;
  showTemplateUploadIndication?: boolean;
}

const ErrorMessage = ({ error, fileName, fileTypes }) => {
  const fileNameTemplate = <strong>{fileName ? `${fileName} : ` : ''}</strong>;

  if (error === 'uploadFailed') {
    return (
      <StyledError>
        {fileNameTemplate} File failed to upload, please try again
      </StyledError>
    );
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
        {fileNameTemplate} Please use an accepted file type. Accepted types for
        this field are:
        <div>{fileTypes}</div>
      </StyledError>
    );
  }

  if (error === 'fileSize') {
    return (
      <StyledError>
        {fileNameTemplate} Files must be less than 100MB.
      </StyledError>
    );
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
  errors,
  handleDownload,
  wrap,
  hideFailedUpload,
  useFileDate = false,
  fileDateTitle,
  fileDate,
  setFileDate,
  maxDate,
  minDate,
  allowDragAndDrop,
  templateNumber,
  showTemplateUploadIndication,
}) => {
  const hiddenFileInput = useRef() as MutableRefObject<HTMLInputElement>;
  const isFiles = value?.length > 0;
  const hideIfFailed = errors?.length > 0 && hideFailedUpload;
  const isSecondary = buttonVariant === 'secondary';
  const fileErrorModal = useModal();
  const [dragActive, setDragActive] = React.useState(false);
  const [dropzoneError, setDropzoneError] = React.useState(null);

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

  const handleDrag = (e: any, isDragActive: boolean) => {
    e.preventDefault();
    setDropzoneError(null);
    setDragActive(isDragActive);
  };

  const handleDrop = (
    e: any,
    isDragActive: boolean = true,
    isDrop: boolean = false
  ) => {
    e.preventDefault();
    setDropzoneError(null);
    if (!allowMultipleFiles && e.dataTransfer?.items?.length > 1) {
      setDropzoneError('Multiple file upload not allowed.');
      return;
    }
    setDragActive(isDragActive);
    if (isDrop) onChange({ target: { files: e.dataTransfer.files } } as any);
  };

  const dropzoneProps = {
    onDrop: (e) => handleDrop(e, false, true),
    onDragOver: handleDrop,
    onDragEnter: (e) => handleDrag(e, true),
    onDragLeave: (e) => handleDrag(e, false),
  };

  const borderStyleError = (borderComp: string = 'solid') =>
    `1px ${borderComp} #E71F1F`;

  const borderStyles =
    errors?.length > 0
      ? borderStyleError('dashed')
      : '1px dashed rgba(0, 0, 0, 0.16)';
  const dropzoneStyles = {
    border: dragActive ? '2px dashed #3b99fc' : borderStyles,
  };

  return (
    <>
      <GenericModal
        id="file-error"
        title="File error"
        message="This file cannot be downloaded"
        {...fileErrorModal}
      />
      <StyledContainer
        className="file-widget"
        style={
          allowDragAndDrop
            ? dropzoneStyles
            : { border: errors?.length > 0 && borderStyleError() }
        }
        {...(allowDragAndDrop && dropzoneProps)}
      >
        <StyledInnerContainer wrap={wrap}>
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
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        if (handleDelete) {
                          setDropzoneError(null);
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
            <StyledError>{dropzoneError}</StyledError>
            {errors?.map((fileError: any) => (
              <ErrorMessage
                key={`error-${fileError.id}`}
                fileName={fileError.fileName}
                error={fileError.error}
                fileTypes={fileTypes}
              />
            ))}
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
                        const newDate = originalDate
                          .toISOString()
                          .split('T')[0];
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
                  <StyledButtonDiv>
                    <span>{buttonLabel()}</span>
                    {allowDragAndDrop && (
                      <StyledIconSpan>
                        <FontAwesomeIcon size="xs" icon={faUpload} />
                        Drop files (or click to upload)
                      </StyledIconSpan>
                    )}
                  </StyledButtonDiv>
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
        </StyledInnerContainer>
        {showTemplateUploadIndication && (
          <StyledFooterText>
            <TemplateDescription templateNumber={templateNumber} />
          </StyledFooterText>
        )}
      </StyledContainer>
    </>
  );
};

export default FileComponent;
