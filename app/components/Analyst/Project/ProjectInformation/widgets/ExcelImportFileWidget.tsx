import React, { useEffect, useState } from 'react';
import { WidgetProps } from '@rjsf/utils';
import {
  handleDelete,
  validateFile,
  handleDownload,
} from 'lib/theme/functions/fileWidgetFunctions';
import { useCreateAttachment } from 'schema/mutations/attachment/createAttachment';
import { useDeleteAttachment } from 'schema/mutations/attachment/deleteAttachment';
import bytesToSize from 'utils/bytesToText';
import FileComponent from 'lib/theme/components/FileComponent';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { Alert } from '@button-inc/bcgov-theme';
import parse from 'html-react-parser';

const StyledAlert = styled(Alert)`
  margin-bottom: 8px;
  margin-top: 8px;

  &.tab-error-alert > .pg-notification-content:first-of-type {
    display: none !important;
  }
`;

const TabErrorRow = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 4px;
`;

const TabErrorIcon = styled(FontAwesomeIcon)`
  color: rgb(161, 38, 34);
  margin-right: 8px;
  flex-shrink: 0;
  margin-top: 3px;
`;

const TabErrorText = styled.div`
  flex: 1;
`;

const ellipsisAnimation = keyframes`
  0% {
    width: 0;
    color: #D8292F;
  }
  50% {
    color: #FCBA19;
  }
  100% {
    width: 1.25em;
    color: #003366;
  }
`;

const Loading = styled.div`
  color: #1a5a96;
  width: 10rem;
  &:after {
    overflow: hidden;
    display: inline-block;
    vertical-align: bottom;
    animation: ${ellipsisAnimation} steps(4, end) 900ms infinite;
    content: '...';
  }
`;

const SuccessTextHeading = styled.div`
  color: #1a5a96;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
`;

const SuccessTextSubHeading = styled.div`
  color: #1a5a96;
  text-align: center;
`;

const SuccessTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: ${(props) => props.theme.spacing.small};
`;

const SuccessIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.color.success};
`;

const SuccessContainer = styled.div`
  display: flex;
`;

const CellLevelErrorsAlert = styled(StyledAlert)`
  background-color: #fde4e4;
  border-color: rgb(161, 38, 34);
  color: rgb(161, 38, 34);
  font-size: 16px;
  font-weight: 400;
  .cell-level-heading,
  .cell-level-footer {
    font-weight: 700;
    margin-bottom: ${(props) => props.theme.spacing.medium};
  }
  .cell-level-tab-title {
    font-weight: 700;
    margin-top: ${(props) => props.theme.spacing.small};
  }

  &.tab-error-alert > .pg-notification-content:first-of-type {
    display: none !important;
  }
`;

export const Success = ({ heading = 'Excel Data table match database' }) => (
  <SuccessContainer>
    <SuccessTextContainer>
      <SuccessTextHeading>{heading}</SuccessTextHeading>
      <SuccessTextSubHeading>
        Remember to press Save & Import
      </SuccessTextSubHeading>
    </SuccessTextContainer>
    <SuccessIconContainer>
      <FontAwesomeIcon icon={faCircleCheck} />
    </SuccessIconContainer>
  </SuccessContainer>
);

const tabDisplayNames: Record<string, string> = {
  summary: 'Tab - SOW Tables Summary',
  tab1: 'Tab 1 - Community Information',
  tab2: 'Tab 2 - Project Sites',
  tab7: 'Tab 7 - Budget',
};

const isCellLevelError = (err) => {
  const errorMessage = err?.error;
  return (
    Array.isArray(errorMessage) &&
    errorMessage.every(
      (error) =>
        error &&
        typeof error === 'object' &&
        ('cell' in error || 'expected' in error || 'received' in error)
    )
  );
};

const getDefaultErrorTitle = (errorType, filename) => {
  let title = `An unknown error has occured while validating the ${filename} data`;
  if (errorType?.includes('tab')) {
    title = `There was an error importing the ${filename} data at ${errorType}`;
  }
  if (errorType === 'summary') {
    title = `There was an error importing the ${filename} data at the Summary tab`;
  }

  if (errorType === 'database') {
    title = `An error occured when validating the ${filename} data`;
  }

  if (errorType === 'workbook') {
    title = `The ${filename} sheet does not appear to contain the correct tabs.`;
  }
  if (errorType === 'claimNumber') {
    title = `A Claim & Progress Report already exists with this claim number. Data were not imported.`;
  }
  if (errorType === 'timeout') {
    title = `The upload of ${filename} timed out. Please try again later.`;
  }

  return title;
};

export const displayExcelUploadErrors = (err) => {
  const {
    level: errorType,
    error: errorMessage,
    filename = 'Statement of Work',
  } = err;
  const title = getDefaultErrorTitle(errorType, filename);

  if (typeof errorMessage !== 'string') {
    return errorMessage.map(({ error: message }) => {
      return (
        <StyledAlert
          key={message}
          variant="danger"
          closable={false}
          content={
            <>
              <div> {title}</div>
              <div>{message}</div>
            </>
          }
        />
      );
    });
  }
  return (
    <StyledAlert
      key={errorMessage}
      variant="danger"
      closable={false}
      content={
        <>
          <div> {title}</div>
          <div>{parse(errorMessage)}</div>
        </>
      }
    />
  );
};

const renderTabErrorRow = ({
  cell,
  error: message,
  expected,
  received,
  level,
}) => {
  const cellText = cell ? `Cell ${cell}, ` : '';
  const tableText = level === 'table' && cell ? `${cell}, ` : '';
  const expectationParts = [];
  if (expected !== null && expected !== undefined) {
    expectationParts.push(`expected - "${expected}"`);
  }
  if (received !== undefined || received === null) {
    expectationParts.push(`received - "${received ?? null}"`);
  }
  const expectationText =
    expectationParts.length > 0 ? `; ${expectationParts.join(', ')}` : '';

  return (
    <TabErrorRow key={cellText}>
      <TabErrorIcon icon={faCircleExclamation} />
      <TabErrorText>
        {level === 'table' ? tableText : cellText}
        {message}
        {expectationText}
      </TabErrorText>
    </TabErrorRow>
  );
};

const renderCellLevelErrors = (errors) => {
  if (!errors.length) return null;
  const filename = errors[0]?.filename ?? 'Statement of Work';
  const heading = `There were errors importing the file : ${filename} data`;

  return (
    <CellLevelErrorsAlert
      className="tab-error-alert"
      variant="danger"
      closable={false}
      content={
        <>
          <div className="cell-level-heading">{heading}</div>
          {errors.map((error) => {
            const { level: errorType, error: errorMessage } = error;
            const tabTitle =
              tabDisplayNames[errorType] ||
              getDefaultErrorTitle(errorType, filename);

            return (
              <div key={error}>
                <div className="cell-level-tab-title">{tabTitle}</div>
                {errorMessage.map((detail) => renderTabErrorRow(detail))}
              </div>
            );
          })}
          <div className="cell-level-footer">
            Please review and complete the missing or incorrect information in
            the listed tabs before re-uploading the file.
          </div>
        </>
      }
    />
  );
};

export const renderStatusLabel = (
  loading: boolean,
  success: boolean,
  successHeading?: string
): React.ReactNode => {
  if (loading) {
    return <Loading>Checking the data</Loading>;
  }

  if (!loading && success) {
    return <Success heading={successHeading} />;
  }

  return false;
};

type FileProps = {
  id: string | number;
  uuid: string;
  name: string;
  size: number;
  type: string;
};

interface ExcelImportFileWidgetProps extends WidgetProps {
  value: Array<FileProps>;
}

const acceptedFileTypes = '.xls, .xlsx, .xlsm';

const ExcelImportFileWidget: React.FC<ExcelImportFileWidgetProps> = ({
  id,
  formContext,
  onChange,
  options,
  value,
  required,
  label,
  rawErrors,
}) => {
  const [error, setError] = useState('');
  const [createAttachment, isCreatingAttachment] = useCreateAttachment();
  const [deleteAttachment, isDeletingAttachment] = useDeleteAttachment();
  const [isImporting, setIsImporting] = useState(false);
  const [isValidExcel, setIsValidExcel] = useState(false);
  const excelImportOptions = options?.excelImport;
  const allowDragAndDrop = (options?.allowDragAndDrop as boolean) ?? false;
  const successHeading = excelImportOptions['successHeading'] as any;
  const errorType = excelImportOptions?.['errorType'];
  const isFiles = value?.length > 0;
  const loading = isCreatingAttachment || isDeletingAttachment || isImporting;
  const maxFileSizeInBytes = 104857600;
  const fileId = isFiles && value[0].id;

  useEffect(() => {
    if (rawErrors?.length > 0) {
      setError('rjsf_validation');
    }
  }, [rawErrors, setError]);
  const { applicationId, excelValidationErrors, validateExcel } = formContext;
  const cellLevelErrors = (excelValidationErrors ?? []).filter((err) =>
    isCellLevelError(err)
  );
  const otherExcelErrors = (excelValidationErrors ?? []).filter(
    (err) => !isCellLevelError(err)
  );

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (loading) return;
    setError('');

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
    setIsImporting(true);

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
          applicationId,
        },
      },
    };

    const response = await validateExcel(file, true);

    const { status } = response;

    if (status !== 200) {
      setError(errorType || 'excelImportFailed');
      setIsImporting(false);
      setIsValidExcel(false);
    } else {
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
          onChange([fileDetails]);
          setIsImporting(false);
        },
      });
      setIsValidExcel(true);
    }
  };

  return (
    <>
      <FileComponent
        loading={loading}
        errors={error ? [{ error }] : []}
        handleDelete={() =>
          handleDelete(fileId, deleteAttachment, setError, value, onChange)
        }
        handleDownload={handleDownload}
        onChange={(e) => handleChange(e)}
        fileTypes={acceptedFileTypes}
        id={id}
        label={label}
        hideFailedUpload
        statusLabel={renderStatusLabel(
          isImporting,
          isValidExcel,
          successHeading
        )}
        required={required}
        value={value}
        allowDragAndDrop={allowDragAndDrop}
      />
      {cellLevelErrors.length > 0 && renderCellLevelErrors(cellLevelErrors)}
      {otherExcelErrors.length > 0 &&
        otherExcelErrors.flatMap(displayExcelUploadErrors)}
    </>
  );
};

export default ExcelImportFileWidget;
