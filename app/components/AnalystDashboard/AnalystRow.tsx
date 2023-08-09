import { useRouter } from 'next/router';
import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import statusStyles from 'data/statusStyles';
import { AnalystRow_application$key } from '__generated__/AnalystRow_application.graphql';
import AssignLead from 'components/Analyst/AssignLead';
import StatusPill from '../StatusPill';

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
  width: 6.66%;
`;

const StyledCcbdIdCell = styled(StyledBaseCell)`
  width: 8.31%;
  padding-left: 12px !important;
  white-space: nowrap;
`;

const StyledStatusCell = styled(StyledBaseCell)`
  width: 14.31%;
  max-width: 14.31%;
`;

const StyledProjectNameCell = styled(StyledBaseCell)`
  width: 23.68%;
`;

const StyledOrganizationNameCell = styled(StyledBaseCell)`
  width: 18.42%;
`;

const StyledLeadCell = styled(StyledBaseCell)`
  width: 10.53%;
  max-width: 10.53%;
  cursor: default;
`;

const StyledPackageCell = styled(StyledBaseCell)`
  width: 7.89%;
  text-align: right;
`;

const StyledZoneCell = styled(StyledBaseCell)`
  width: 5.59%;
  text-align: right;
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
    analystStatus,
    package: applicationPackage,
    projectName,
    ccbcNumber,
    organizationName,
    intakeNumber,
    zones,
  } = useFragment(
    graphql`
      fragment AnalystRow_application on Application {
        rowId
        analystStatus
        analystLead
        package
        projectName
        ccbcNumber
        organizationName
        intakeNumber
        zones
      }
    `,
    application
  );

  const router = useRouter();

  console.log(zones);

  const handleOnClick = () => {
    router.push(`/analyst/application/${rowId}`);
  };

  return (
    <StyledRow onClick={handleOnClick}>
      <StyledIntakeNumberCell>{intakeNumber}</StyledIntakeNumberCell>
      <StyledCcbdIdCell>{ccbcNumber}</StyledCcbdIdCell>
      <StyledZoneCell>{zones.join(', ')}</StyledZoneCell>
      <StyledStatusCell>
        <StatusPill status={analystStatus} styles={statusStyles} />
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
