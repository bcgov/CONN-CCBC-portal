import { useMemo, useState } from 'react';
import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import styled from 'styled-components';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { DashboardTabs } from 'components/AnalystDashboard';
import { ButtonLink, Layout } from 'components';
import { coveragesQuery } from '__generated__/coveragesQuery.graphql';
import FileComponent from 'lib/theme/components/FileComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import * as Sentry from '@sentry/nextjs';
import Tabs from 'components/Analyst/GIS/Tabs';
import checkFileType from 'utils/checkFileType';
import { useUnsavedChanges } from 'components/UnsavedChangesProvider';
import HistoryFileUpload from 'components/Analyst/History/HistoryFileUpload';
import config from '../../../config';

const getCoveragesQuery = graphql`
  query coveragesQuery {
    allRecordVersions(
      orderBy: RECORD_ID_DESC
      condition: { tableName: "coverages_upload" }
    ) {
      nodes {
        record
        tableName
        createdBy
        createdAt
        ccbcUserByCreatedBy {
          familyName
          givenName
        }
      }
    }
    session {
      sub
      ...DashboardTabs_query
    }
  }
`;

const COVERAGES_FILE_NAME = config.get('COVERAGES_FILE_NAME');

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
`;
const StyledError = styled('div')`
  color: #e71f1f;
  margin-top: 10px;
`;

const StyledSuccess = styled('div')`
  color: #2e8540;
  margin-top: 10px;
`;

const StyledBtnContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.25rem;
  margin-top: 2rem;
  flex-direction: row;
  justify-content: left;
`;

const acceptedFileTypes = ['.zip'];

const UploadError = ({ error }) => {
  if (error === 'uploadFailed') {
    return <StyledError>File failed to upload, please try again</StyledError>;
  }

  if (error === 'fileType') {
    return (
      <StyledError>
        Please use an accepted file type. Accepted type for this field is: .zip
      </StyledError>
    );
  }

  if (error === 'fileName') {
    return (
      <StyledError>
        Please use an accepted file name. Accepted name for this field is:{' '}
        {COVERAGES_FILE_NAME}
      </StyledError>
    );
  }

  return null;
};

const validateFile = (file: globalThis.File) => {
  if (!file) return { isValid: false, error: '' };

  if (!checkFileType(file.name, acceptedFileTypes)) {
    return { isValid: false, error: 'fileType' };
  }

  if (file.name !== COVERAGES_FILE_NAME) {
    return { isValid: false, error: 'fileName' };
  }

  return { isValid: true, error: null };
};

const CoveragesTab = ({ historyList }) => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { updateDirtyState } = useUnsavedChanges();
  const fileComponentValue = [
    {
      id: '',
      name: selectedFile?.name,
      size: selectedFile?.size,
      type: '.zip',
      uuid: '',
    },
  ];
  const [error, setError] = useState<Array<any> | string>([]);
  const hasUploadErrors = error?.length > 0 && Array.isArray(error);

  const changeHandler = (event) => {
    setUploadSuccess(false);
    const file: File = event.target.files?.[0];

    const { isValid, error: newError } = validateFile(file);
    if (!isValid) {
      setError(newError);
      return;
    }
    setError('');
    setSelectedFile(file);
    updateDirtyState(true);
  };

  const handleUpload = async () => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await fetch('/api/coverages/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSelectedFile(null);
        setIsUploading(false);
        setUploadSuccess(true);
        updateDirtyState(false);
      }
    } catch (e) {
      setIsUploading(false);
      Sentry.captureException(e);
    }
  };

  const historyTableList = useMemo(
    () =>
      historyList.map((historyItem) => ({
        name: `${historyItem.ccbcUserByCreatedBy.givenName} ${historyItem.ccbcUserByCreatedBy.familyName}`,
        file: COVERAGES_FILE_NAME,
        createdAt: historyItem.createdAt,
        uuid: historyItem.record.uuid,
      })),
    [historyList]
  );

  return (
    <div>
      <Tabs />
      <h2>Application Coverages Upload</h2>
      <div>
        <strong>
          Upload a ZIP file containing the shapefiles for the CCBC Application
          Coverages. The file must be named {COVERAGES_FILE_NAME}.
        </strong>
        <p>
          The ZIP file should contain the .shp as well as it&apos;s accompanying
          files and should not be inside a folder.
        </p>
        <FileComponent
          allowMultipleFiles={false}
          buttonVariant="primary"
          fileTypes=".zip"
          label="ZIP of CCBC Application Coverages"
          id="coverages-upload"
          onChange={changeHandler}
          handleDelete={() => {
            setSelectedFile(null);
            updateDirtyState(false);
          }}
          hideFailedUpload={false}
          value={selectedFile ? fileComponentValue : []}
          allowDragAndDrop
        />

        {error && <UploadError error={error} />}
        {hasUploadErrors && (
          <>
            <br />
            <div>
              {' '}
              <FontAwesomeIcon icon={faCircleXmark} color="#D8292F" /> Error
              uploading ZIP file
            </div>
          </>
        )}
        <StyledBtnContainer>
          <ButtonLink
            onClick={handleUpload}
            href="#"
            disabled={isUploading || !selectedFile}
            data-skip-unsaved-warning
          >
            {isUploading ? 'Uploading' : 'Upload'}
          </ButtonLink>
        </StyledBtnContainer>
        {uploadSuccess && (
          <StyledSuccess>
            <p>Upload successful!</p>
          </StyledSuccess>
        )}
      </div>
      <HistoryFileUpload historyTableList={historyTableList} />
    </div>
  );
};

const UploadCoverages = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, coveragesQuery>) => {
  const query = usePreloadedQuery(getCoveragesQuery, preloadedQuery);
  const { session, allRecordVersions } = query;
  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledContainer>
        <DashboardTabs session={session} />
        <CoveragesTab historyList={allRecordVersions?.nodes || []} />
      </StyledContainer>
    </Layout>
  );
};

export default withRelay(
  UploadCoverages,
  getCoveragesQuery,
  defaultRelayOptions
);
