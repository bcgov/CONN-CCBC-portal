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
`;

const TabErrorAlert = styled(StyledAlert)`
  > div:first-child {
    display: none !important;
  }
`;

const TabErrorRow = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 4px;
`;

const TabErrorIcon = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.color.error};
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
    content: '\\2026'; /* ascii code for the ellipsis character */
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

export const displayExcelUploadErrors = (err) => {
  const {
    level: errorType,
    error: errorMessage,
    filename = 'Statement of Work',
  } = err;
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
  // for cell level errors
  if (Array.isArray(errorMessage)) {
    const tabTitle = tabDisplayNames[errorType] || title;
    return (
      <TabErrorAlert
        key={tabTitle}
        variant="danger"
        closable={false}
        content={
          <>
            <div> {tabTitle}</div>
            <div>
              {errorMessage.map(
                ({ cell, error: message, expected, received }, idx) => {
                  const cellText = cell ? `Cell ${cell}, ` : '';
                  const expectationParts = [];
                  if (expected !== null && expected !== undefined) {
                    expectationParts.push(`expected - "${expected}"`);
                  }
                  expectationParts.push(`received - "${received ?? null}"`);
                  const expectationText =
                    expectationParts.length > 0
                      ? `; ${expectationParts.join(', ')}`
                      : '';

                  return (
                    <TabErrorRow key={`${cell ?? idx}-${message}`}>
                      <TabErrorIcon icon={faCircleExclamation} />
                      <TabErrorText>
                        {cellText}
                        {message}
                        {expectationText}
                      </TabErrorText>
                    </TabErrorRow>
                  );
                }
              )}
            </div>
          </>
        }
      />
    );
  }
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
      {excelValidationErrors?.length > 0 &&
        excelValidationErrors.flatMap(displayExcelUploadErrors)}
    </>
  );
};

export default ExcelImportFileWidget;
