import { useRouter } from 'next/router';
import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import { AnalystRow_application$key } from '__generated__/AnalystRow_application.graphql';
import AssignLead from 'components/Analyst/AssignLead';
import StatusPill from './StatusPill';

interface Props {
  application: AnalystRow_application$key;
  query: any;
}

const StyledRow = styled('tr')`
  max-width: 1170px;
  padding: 16px 8px;

  &:hover {
    background: #f2f2f2;
    cursor: pointer;
  }
`;

const StyledBaseCell = styled('td')`
  padding: 16px 8px;
`;

const StyledCcbdIdCell = styled(StyledBaseCell)`
  width: 9.7%;
  padding-left: 12px !important;
  white-space: nowrap;
`;

const StyledStatusCell = styled(StyledBaseCell)`
  width: 16.24%;
`;

const StyledProjectNameCell = styled(StyledBaseCell)`
  width: 21.03%;
`;

const StyledOrganizationNameCell = styled(StyledBaseCell)`
  width: 16.76%;
`;

const StyledLeadCell = styled(StyledBaseCell)`
  width: 11.97%;
  max-width: 11.97%;
  cursor: default;
`;

const StyledPackageCell = styled(StyledBaseCell)`
  width: 5.81%;
`;

const AnalystRow: React.FC<Props> = ({ query, application }) => {
  const queryFragment = useFragment(
    graphql`
      fragment AnalystRow_query on Query {
        ...AssignLead_query
      }
    `,
    query
  );

  const {
    analystLead,
    rowId,
    status,
    projectName,
    ccbcNumber,
    organizationName,
  } = useFragment(
    graphql`
      fragment AnalystRow_application on Application {
        rowId
        status
        analystLead
        projectName
        ccbcNumber
        organizationName
      }
    `,
    application
  );

  const router = useRouter();

  const handleOnClick = () => {
    router.push(`/analyst/application/${rowId}`);
  };

  return (
    <StyledRow onClick={handleOnClick}>
      <StyledCcbdIdCell>{ccbcNumber}</StyledCcbdIdCell>
      <StyledStatusCell>
        <StatusPill status={status} />
      </StyledStatusCell>
      <StyledProjectNameCell>{projectName}</StyledProjectNameCell>
      <StyledOrganizationNameCell>
        {organizationName}
      </StyledOrganizationNameCell>
      {/* Filled in later when these columns are implemented on backend */}
      <StyledLeadCell
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <AssignLead
          query={queryFragment}
          applicationId={rowId}
          lead={analystLead}
        />
      </StyledLeadCell>
      <StyledPackageCell />
    </StyledRow>
  );
};

export default AnalystRow;
