import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import styled from 'styled-components';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
//import resolveFileUpload from '../../backend/lib/graphql/resolveFileUpload';
import { DashboardTabs } from 'components/AnalystDashboard';

import FileWidget from 'components/Review/widgets/FileWidget';
import { ButtonLink, Layout } from 'components';
import { useState } from 'react';
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
const StyledCaption = styled.div`
  line-height: 2.5rem;
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

const GisTab = () =>{
  const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);

	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
	};
  
  const handleUpload = async() =>{
    console.log('ready to roll?');
    const uploadQuery = {
      query: "",
      variables: {
        files: [ 
          File
        ]
      }
    };
    
    const formData = new FormData();
    formData.append('operations',JSON.stringify(uploadQuery));
    formData.append('map','{"0":["variables.files.0"]}');
		formData.append('File', selectedFile);
    console.log(formData);
		fetch('http://localhost:3000/graphql',
			{
				method: 'POST',
				body: formData,
			}
		)
    .then((response) => response.json())
    .then((result) => {
      console.log('Success:', result);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
	};

  return (
    <div>
        <h2>GIS Input</h2>
        <strong>Import a JSON of the GIS analysis for one or more applications</strong>
        
        <div>
          <input type="file" name="file" onChange={changeHandler} />
        </div>
        <StyledBtnContainer>
          <ButtonLink onClick={handleUpload} href='#' >
            Continue
          </ButtonLink>
        </StyledBtnContainer>
    </div>
  )
}
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

export default withRelay(
  UploadJSON,
  getUploadedJsonQuery,
  defaultRelayOptions
);
