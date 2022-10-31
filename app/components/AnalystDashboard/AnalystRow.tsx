import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import { AnalystRow_application$key } from '__generated__/AnalystRow_application.graphql';

interface Props {
  application: AnalystRow_application$key;
}

const StyledRow = styled('tr')`
  max-width: 1170px;
  padding: 16px 8px 16px 8px;

  &:hover {
    background: #f2f2f2;
  }
`;

const StyledCcbdIdCell = styled('td')`
  width: 9.7%;
  padding-left: 12px !important;
`;

const StyledStatusCell = styled('td')`
  width: 16.24%;
`;

const StyledProjectNameCell = styled('td')`
  width: 21.03%;
`;

const StyledOrganizationNameCell = styled('td')`
  width: 16.76%;
`;

const StyledLeadCell = styled('td')`
  width: 11.97%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const StyledPackageCell = styled('td')`
  width: 5.81%;
`;

const PillSpan = styled.span`
  background-color: #1a5a96;
  color: #ffffff;
  border-radius: 16px;
  padding: 5px;
  text-transform: capitalize;
`;

const AnalystRow: React.FC<Props> = ({ application }) => {
  // TODO: remove this when adding in application link
  const { status, projectName, ccbcNumber, organizationName } = useFragment(
    graphql`
      fragment AnalystRow_application on Application {
        id
        rowId
        status
        projectName
        ccbcNumber
        organizationName
      }
    `,
    application
  );

  return (
    <StyledRow>
      <StyledCcbdIdCell>{ccbcNumber}</StyledCcbdIdCell>
      <StyledStatusCell>
        <PillSpan>{status}</PillSpan>
      </StyledStatusCell>
      <StyledProjectNameCell>{projectName}</StyledProjectNameCell>
      <StyledOrganizationNameCell>
        {organizationName}
      </StyledOrganizationNameCell>
      {/* to be filled in later when these columns are implemented on backend */}
      <StyledLeadCell />
      <StyledPackageCell />
    </StyledRow>
  );
};

export default AnalystRow;
