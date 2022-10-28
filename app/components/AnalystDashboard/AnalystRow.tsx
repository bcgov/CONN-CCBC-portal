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

const PillSpan = styled.span`
  background-color: #1a5a96;
  color: #ffffff;
  border-radius: 16px;
  padding: 5px;
  text-transform: capitalize;
`;

const AnalystRow: React.FC<Props> = ({ application }) => {
  // TODO: remove this when adding in application link
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { rowId, status, projectName, ccbcNumber, organizationName } =
    useFragment(
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
      <td />
      <td />
    </StyledRow>
  );
};

export default AnalystRow;
