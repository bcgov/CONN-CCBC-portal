
import { useMemo, useState } from 'react';
import { usePreloadedQuery, graphql } from 'react-relay';
import { withRelay, RelayProps } from 'relay-nextjs';
import styled from 'styled-components';
import getConfig from 'next/config';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { DashboardTabs } from 'components/AnalystDashboard';
import { ButtonLink, Layout } from 'components';
import { coveragesQuery } from '__generated__/coveragesQuery.graphql';
import FileComponent from 'lib/theme/components/FileComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Tabs from 'components/Analyst/GIS/Tabs';
import checkFileType from 'utils/checkFileType';
import { useUnsavedChanges } from 'components/UnsavedChangesProvider';
import HistoryFileUpload from 'components/Analyst/History/HistoryFileUpload';
import reportClientError from 'lib/helpers/reportClientError';

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

const {
  publicRuntimeConfig: { COVERAGES_FILE_NAME },
} = getConfig();

const CBC_COVERAGE_FILE_NAME = 'CBC_Coverage.zip';

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
  margin-bottom: 2.5rem;
  margin-top: 0.5rem;
  flex-direction: row;
  justify-content: left;
`;

const StyledHeading = styled.h2`
  margin-bottom: 2.5rem;
`;

const StyledNoteText = styled.p`
  text-align: left;
  margin-top: -2rem;
`;

const StyledSectionDivider = styled.hr`
  margin: 2rem 0;
  border: none;
  border-top: 1px solid #d6d6d6;
`;

const acceptedFileTypes = ['.zip'];

const UploadError = ({ error, expectedFileName }) => {
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
        {expectedFileName}
      </StyledError>
    );
  }

  return null;
};

const validateFile = (
  file: globalThis.File,
  expectedFileName?: string
) => {
  if (!file) return { isValid: false, error: '' };

  if (!checkFileType(file.name, acceptedFileTypes)) {
    return { isValid: false, error: 'fileType' };
  }

  if (expectedFileName && file.name !== expectedFileName) {
    return { isValid: false, error: 'fileName' };
  }

  return { isValid: true, error: null };
};

const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch('/api/coverages/upload', {
    method: 'POST',
    body: formData,
  });
  const result = await response.json();
  if (result.status !== 'success') {
    throw new Error('Upload failed');
  }
};

const makeFileComponentValue = (file: File) => [
  {
    id: '',
    name: file?.name,
    size: file?.size,
    type: '.zip',
    uuid: '',
  },
];

const CoveragesTab = ({ historyList }) => {
  const [ccbcFile, setCcbcFile] = useState<File>();
  const [cbcFile, setCbcFile] = useState<File>();
  const [ccbcError, setCcbcError] = useState<string>('');
  const [cbcError, setCbcError] = useState<string>('');
  const [uploadErrors, setUploadErrors] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { updateDirtyState } = useUnsavedChanges();

  const hasAnyFile = !!ccbcFile || !!cbcFile;

  const handleCcbcChange = (event) => {
    setUploadSuccess(false);
    setUploadErrors(false);
    const file: File = event.target.files?.[0];

    const { isValid, error } = validateFile(file, COVERAGES_FILE_NAME);
    if (!isValid) {
      setCcbcError(error);
      return;
    }
    setCcbcError('');
    setCcbcFile(file);
    updateDirtyState(true);
  };

  const handleCbcChange = (event) => {
    setUploadSuccess(false);
    setUploadErrors(false);
    const file: File = event.target.files?.[0];

    const { isValid, error } = validateFile(file, CBC_COVERAGE_FILE_NAME);
    if (!isValid) {
      setCbcError(error);
      return;
    }
    setCbcError('');
    setCbcFile(file);
    updateDirtyState(true);
  };

  const handleSave = async () => {
    setIsUploading(true);
    setUploadSuccess(false);
    setUploadErrors(false);

    const filesToUpload = [ccbcFile, cbcFile].filter(Boolean);

    try {
      for (const file of filesToUpload) {
        // eslint-disable-next-line no-await-in-loop
        await uploadFile(file);
      }
      setCcbcFile(null);
      setCbcFile(null);
      setUploadSuccess(true);
      updateDirtyState(false);
    } catch (e) {
      setUploadErrors(true);
      reportClientError(e, { source: 'coverages-upload' });
    } finally {
      setIsUploading(false);
    }
  };

  const historyTableList = useMemo(
    () =>
      historyList.map((historyItem) => ({
        name: `${historyItem.ccbcUserByCreatedBy.givenName} ${historyItem.ccbcUserByCreatedBy.familyName}`,
        file: historyItem.record.file_name || COVERAGES_FILE_NAME,
        createdAt: historyItem.createdAt,
        uuid: historyItem.record.uuid,
      })),
    [historyList]
  );

  return (
    <div>
      <Tabs />
      <StyledHeading>Application Coverages Upload</StyledHeading>
      <StyledNoteText>
        CCBC Coverage uploads are necessary to update the Economic Regions and
        Regional Districts for CCBC applications/projects.
        <br />
        CBC Coverage uploads are necessary to show project areas on the Summary
        Page map.
      </StyledNoteText>

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
          onChange={handleCcbcChange}
          handleDelete={() => {
            setCcbcFile(null);
            if (!cbcFile) updateDirtyState(false);
          }}
          hideFailedUpload={false}
          value={ccbcFile ? makeFileComponentValue(ccbcFile) : []}
          allowDragAndDrop
        />
        {ccbcError && (
          <UploadError error={ccbcError} expectedFileName={COVERAGES_FILE_NAME} />
        )}
      </div>

      <StyledSectionDivider />

      <div>
        <strong>
          Upload a ZIP file containing the Last Mile and Transport shapefiles
          for the CBC Project Coverages. The file must be named{' '}
          {CBC_COVERAGE_FILE_NAME}.
        </strong>
        <p>
          The ZIP file should contain the .shp as well as it&apos;s accompanying
          files and should not be inside a folder.
        </p>
        <FileComponent
          allowMultipleFiles={false}
          buttonVariant="primary"
          fileTypes=".zip"
          label="ZIP of CBC Project Coverages"
          id="cbc-coverages-upload"
          onChange={handleCbcChange}
          handleDelete={() => {
            setCbcFile(null);
            if (!ccbcFile) updateDirtyState(false);
          }}
          hideFailedUpload={false}
          value={cbcFile ? makeFileComponentValue(cbcFile) : []}
          allowDragAndDrop
        />
        {cbcError && (
          <UploadError error={cbcError} expectedFileName={CBC_COVERAGE_FILE_NAME} />
        )}
      </div>

      {uploadErrors && (
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
          onClick={handleSave}
          href="#"
          disabled={isUploading || !hasAnyFile}
          data-skip-unsaved-warning
        >
          {isUploading ? 'Saving' : 'Save'}
        </ButtonLink>
      </StyledBtnContainer>
      <StyledNoteText>
        Note: Changes from this upload will be reflected in the system by the
        following morning.
      </StyledNoteText>
      {uploadSuccess && (
        <StyledSuccess>
          <p>Upload successful!</p>
        </StyledSuccess>
      )}

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
