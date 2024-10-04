import { useState } from 'react';
import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import styled from 'styled-components';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { DashboardTabs } from 'components/AnalystDashboard';
import { ButtonLink, Layout, MetabaseEmbed } from 'components';
import { gisUploadedJsonQuery } from '__generated__/gisUploadedJsonQuery.graphql';
import FileComponent from 'lib/theme/components/FileComponent';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import * as Sentry from '@sentry/nextjs';
import Tabs from 'components/Analyst/GIS/Tabs';
import checkFileType from 'utils/checkFileType';

const getUploadedJsonQuery = graphql`
  query gisUploadedJsonQuery {
    session {
      sub
      ...DashboardTabs_query
    }
  }
`;

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
`;
const StyledError = styled('div')`
  color: #e71f1f;
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

const StyledList = styled.div`
  margin-left: 1.3em;
  line-height: 1.5em;
`;

const acceptedFileTypes = ['.json'];

const UploadError = ({ error }) => {
  if (error === 'uploadFailed') {
    return <StyledError>File failed to upload, please try again</StyledError>;
  }

  if (error === 'fileType') {
    return (
      <StyledError>
        Please use an accepted file type. Accepted type for this field is: .json
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

  return { isValid: true, error: null };
};

const GisTab = () => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File>();

  const fileComponentValue = [
    {
      id: '',
      name: selectedFile?.name,
      size: selectedFile?.size,
      type: '.json',
      uuid: '',
    },
  ];
  const [error, setError] = useState<Array<any> | string>([]);
  const hasUploadErrors = error?.length > 0 && Array.isArray(error);

  const changeHandler = (event) => {
    const file: File = event.target.files?.[0];

    const { isValid, error: newError } = validateFile(file);
    if (!isValid) {
      setError(newError);
      return;
    }
    setError('');
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/analyst/gis', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.errors) {
        setError(result.errors);
      } else {
        try {
          await router.push(`/analyst/gis/${result?.batchId}/`);
        } catch (e) {
          Sentry.captureException(e);
        }
      }
    } catch (e) {
      Sentry.captureException(e);
    }
  };

  return (
    <div>
      <Tabs />
      <h2>GIS Input</h2>
      <div>
        <strong>
          Import a JSON of the GIS analysis for one or more applications
        </strong>
        <FileComponent
          allowMultipleFiles={false}
          buttonVariant="primary"
          fileTypes=".json"
          label="JSON of GIS analysis"
          id="json-upload"
          onChange={changeHandler}
          handleDelete={() => setSelectedFile(null)}
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
              uploading JSON file
            </div>
            <StyledList>
              {error.map((err, index) => {
                const col = err?.posiition
                  ? `and column ${err?.posiition}`
                  : '';
                const erroneousCcbcNumber = err?.ccbc_number
                  ? `for ${err?.ccbc_number}`
                  : '';
                const errorAt = err?.line
                  ? `at line ${err?.line}`
                  : erroneousCcbcNumber;
                return (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                  >{`Parsing error: ${err?.message} ${errorAt} ${col}`}</div>
                );
              })}{' '}
              Please check your file and try again.
            </StyledList>
          </>
        )}
        <StyledBtnContainer>
          <ButtonLink onClick={handleUpload} href="#">
            Continue
          </ButtonLink>
        </StyledBtnContainer>
      </div>
    </div>
  );
};

const UploadJSON = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, gisUploadedJsonQuery>) => {
  const query = usePreloadedQuery(getUploadedJsonQuery, preloadedQuery);
  const { session } = query;
  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledContainer>
        <DashboardTabs session={session} />
        <GisTab />
        <MetabaseEmbed dashboardNumber={87} dashboardNumberTest={91} />
      </StyledContainer>
    </Layout>
  );
};

export default withRelay(UploadJSON, getUploadedJsonQuery, defaultRelayOptions);
