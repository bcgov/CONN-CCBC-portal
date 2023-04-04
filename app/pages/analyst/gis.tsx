import { MutableRefObject, useRef, useState } from 'react';
import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import styled from 'styled-components';
import path from 'path';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { DashboardTabs } from 'components/AnalystDashboard';
import { Button } from '@button-inc/bcgov-theme';

import { ButtonLink, Layout } from 'components';
import { gisUploadedJsonQuery } from '__generated__/gisUploadedJsonQuery.graphql';

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
`;
const StyledError = styled('div')`
  color: #e71f1f;
  margin-top: 10px;
`;

const StyledFileDiv = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1.2em;
  border: 1px solid #c0c0c0;

  margin-top: 10px;
  & svg {
    margin: 0 8px;
  }
`;

const StyledButton = styled(Button)`
  min-width: 160px;
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-left: 50%;
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

const GisTab = () => {
  const hiddenFileInput = useRef() as MutableRefObject<HTMLInputElement>;
  const [selectedFile, setSelectedFile] = useState(); 
  const [error, setError] = useState('');
  const acceptedFileTypes = ['.json'];

  const checkFileType = (file, fileTypes) => {
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
  
  const changeHandler = (event) => {
    const file = event.target.files?.[0];

    const { isValid, error: newError } = validateFile(file);
    if (!isValid) {
      setError(newError);
      return;
    }
    setError('');
    setSelectedFile(event.target.files[0]); 
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    await fetch('/api/analyst/gis', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result === 'done') {
          // [TODO] change to proper handling
          alert('This is a valid file. You can proceed.'); 
        }
        if (result.errors) {
          // [TODO] change to proper handling
          alert(`Validation failed: ${JSON.stringify(result.errors)}`);
        }
      })
      .catch((fetch_error) => {
        alert(fetch_error);
      });
  };

  return (
    <div>
      <h2>GIS Input</h2>
      <strong>
        Import a JSON of the GIS analysis for one or more applications
      </strong>
      <StyledFileDiv>
        <strong>
          JSON of GIS analysis
        </strong>
        <StyledButton
          id='json-upload-btn'
          onClick={(e: React.MouseEvent<HTMLInputElement>) => {
            e.preventDefault();
            handleClick();
          }}
        >
          Upload
        </StyledButton>
      </StyledFileDiv>

      <input
        data-testid="file-select-test"
        ref={hiddenFileInput}
        onChange={changeHandler}
        style={{ display: 'none' }}
        type="file"
        accept={acceptedFileTypes && acceptedFileTypes.toString()}
      />

      {error && <UploadError error={error} />}
      <StyledBtnContainer>
        <ButtonLink onClick={handleUpload} href="#">
          Continue
        </ButtonLink>
      </StyledBtnContainer>
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
      </StyledContainer>
    </Layout>
  );
};

export default withRelay(UploadJSON, getUploadedJsonQuery, defaultRelayOptions);
