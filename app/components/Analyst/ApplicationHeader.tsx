import styled from 'styled-components';
import { graphql, useFragment } from 'react-relay';
import { ApplicationHeader_application$key } from '__generated__/ApplicationHeader_application.graphql';

const StyledCallout = styled.div`
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  border-left: 4px solid ${(props) => props.theme.color.links};
`;

const StyledH1 = styled.h1`
  font-size: 24px;
  margin: 8px 0;
`;
const StyledH2 = styled.h2`
  margin: 0;
  font-size: 16px;
`;

interface Props {
  application: ApplicationHeader_application$key;
}

const ApplicationHeader: React.FC<Props> = ({ application }) => {
  const { ccbcNumber, organizationName, projectName } = useFragment(
    graphql`
      fragment ApplicationHeader_application on Application {
        projectName
        organizationName
        ccbcNumber
      }
    `,
    application
  );
  return (
    <StyledCallout>
      <div>
        <StyledH2>{ccbcNumber}</StyledH2>
        <StyledH1>{projectName}</StyledH1>
        <StyledH2>{organizationName}</StyledH2>
      </div>
      <div>{/* Todo: Received/Package/Lead controls here */}</div>
    </StyledCallout>
  );
};

export default ApplicationHeader;
