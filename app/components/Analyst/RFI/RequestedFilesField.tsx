import styled from 'styled-components';

const StyledSection = styled.section`
  display: flex;
`;

const StyledDiv = styled.div`
  padding-right: 48px;
`;

const StyledH4 = styled.h4`
  white-space: nowrap;
`;

const RequestedFilesField = ({ properties }) => {
  return (
    <StyledSection>
      <StyledDiv>
        <StyledH4>Requested files</StyledH4>
      </StyledDiv>
      <div>
        {properties.map((prop: any) => {
          return prop.content;
        })}
      </div>
    </StyledSection>
  );
};

export default RequestedFilesField;
