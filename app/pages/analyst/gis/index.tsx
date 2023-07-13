import { useState } from 'react';
import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import styled from 'styled-components';
import path from 'path';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { DashboardTabs } from 'components/AnalystDashboard';
import { ButtonLink, Layout, MetabaseEmbed } from 'components';
import { gisUploadedJsonQuery } from '__generated__/gisUploadedJsonQuery.graphql';
import FileComponent from 'lib/theme/components/FileComponent';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import * as Sentry from '@sentry/nextjs';

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

const StyledCard = styled.div`
  align-items: center;
  padding: 8px 16px;
  width: 600px;
  border: 1px solid #d6d6d6;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1em;
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

const checkFileType = (file: string, fileTypes: string[]) => {
  const extension = path.extname(file)?.toLowerCase();

  return fileTypes.includes(extension);
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
      <h2>GIS Input</h2>
      <StyledCard>
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
        />
        <StyledBtnContainer>
          <ButtonLink onClick={handleUpload} href="#">
            Continue
          </ButtonLink>
        </StyledBtnContainer>
      </StyledCard>
      {error && <UploadError error={error} />}
      {hasUploadErrors && (
        <>
          <p>
            {' '}
            <FontAwesomeIcon icon={faCircleXmark} color="#D8292F" /> Error
            importing the file. Errors occured at:{' '}
          </p>
          <ul>
            {error.map((err, index) => {
              return (
                // eslint-disable-next-line react/no-array-index-key
                <li key={index}>{`Line: ${err?.line}, ${err?.message}`}</li>
              );
            })}
          </ul>
        </>
      )}
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
