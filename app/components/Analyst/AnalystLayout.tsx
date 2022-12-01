import styled from 'styled-components';
import { graphql, useFragment } from 'react-relay';
import NavigationSidebar from 'components/Analyst/NavigationSidebar';
import FormDiv from 'components/FormDiv';
import { AnalystLayout_application$key } from '__generated__/AnalystLayout_application.graphql';
import ApplicationHeader from './ApplicationHeader';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 100%;
`;

const StyledFlex = styled.div`
  display: flex;
`;

interface Props {
  children: JSX.Element[] | JSX.Element;
  application: AnalystLayout_application$key;
  query: any;
}

const AnalystLayout: React.FC<Props> = ({
  application: applicationKey,
  children,
  query,
}) => {
  const application = useFragment(
    graphql`
      fragment AnalystLayout_application on Application {
        ...ApplicationHeader_application
      }
    `,
    applicationKey
  );

  const queryFragment = useFragment(
    graphql`
      fragment AnalystLayout_query on Query {
        ...ApplicationHeader_query
      }
    `,
    query
  );
  return (
    <StyledContainer>
      <ApplicationHeader query={queryFragment} application={application} />
      <StyledFlex>
        <NavigationSidebar />
        <FormDiv>{children}</FormDiv>
      </StyledFlex>
    </StyledContainer>
  );
};

export default AnalystLayout;
