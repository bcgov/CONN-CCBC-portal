import { useRouter } from 'next/router';
import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import statusStyles from 'data/statusStyles';
import { AnalystRow_application$key } from '__generated__/AnalystRow_application.graphql';
import AssignLead from 'components/Analyst/AssignLead';
import StatusPill from '../Analyst/StatusPill';

interface Props {
  application: AnalystRow_application$key;
  query: any;
}

const StyledRow = styled('tr')`
  max-width: 1216px;
  padding: 16px 8px;

  &:hover {
    background: #f2f2f2;
    cursor: pointer;
  }
`;

const StyledBaseCell = styled('td')`
  padding: 16px 8px;
`;

const StyledIntakeNumberCell = styled('td')`
  width: 7.31%;
`;

const StyledCcbdIdCell = styled(StyledBaseCell)`
  width: 10.54%;
  padding-left: 12px !important;
  white-space: nowrap;
`;

const StyledStatusCell = styled(StyledBaseCell)`
  width: 14.31%;
  max-width: 14.31%;
`;

const StyledProjectNameCell = styled(StyledBaseCell)`
  width: 23.49%;
`;

const StyledOrganizationNameCell = styled(StyledBaseCell)`
  width: 18.72%;
`;

const StyledLeadCell = styled(StyledBaseCell)`
  width: 17.07%;
  max-width: 17.07%;
  cursor: default;
`;

const StyledPackageCell = styled(StyledBaseCell)`
  width: 8.55%;
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
    package: applicationPackage,
    projectName,
    ccbcNumber,
    organizationName,
    intakeNumber,
  } = useFragment(
    graphql`
      fragment AnalystRow_application on Application {
        rowId
        status
        analystLead
        package
        projectName
        ccbcNumber
        organizationName
        intakeNumber
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
      <StyledIntakeNumberCell>{intakeNumber}</StyledIntakeNumberCell>
      <StyledCcbdIdCell>{ccbcNumber}</StyledCcbdIdCell>
      <StyledStatusCell>
        <StatusPill status={status} styles={statusStyles} />
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
      <StyledPackageCell>{applicationPackage}</StyledPackageCell>
    </StyledRow>
  );
};

export default AnalystRow;
