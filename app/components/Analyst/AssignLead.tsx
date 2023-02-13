import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import { AssignLead_query$key } from '__generated__/AssignLead_query.graphql';
import { useAssignAnalystMutation } from '../../schema/mutations/application/createApplicationAnalystLead';

const StyledDropdown = styled.select`
  text-overflow: ellipsis;
  color: ${(props) => props.theme.color.links};
  background-color: ${(props) => props.theme.color.white};
  border: 1px solid ${(props) => props.theme.color.borderGrey};
  padding: 0 8px;
  max-width: 100%;
  border-radius: 4px;
`;

const StyledOption = styled.option``;

interface Props {
  lead: string;
  applicationId: number;
  label?: string;
  query: any;
}

const AssignLead: React.FC<Props> = ({
  applicationId,
  label = 'Unassigned',
  lead,
  query,
}) => {
  const { allAnalysts } = useFragment<AssignLead_query$key>(
    graphql`
      fragment AssignLead_query on Query {
        allAnalysts(orderBy: NATURAL, condition: { active: true }) {
          nodes {
            rowId
            givenName
            familyName
          }
        }
      }
    `,
    query
  );

  const [assignAnalyst] = useAssignAnalystMutation();

  const handleAssignAnalyst = (e) => {
    const analystId = parseInt(e.target.value, 10) || null;

    assignAnalyst({
      variables: {
        input: { applicationAnalystLead: { analystId, applicationId } },
      },
    });
  };

  const analystList = Object.keys(allAnalysts.nodes);

  return (
    <StyledDropdown
      name="assign-analyst"
      id="assign-lead"
      onChange={handleAssignAnalyst}
    >
      <StyledOption key={label} selected={!lead} value={null}>
        {label}
      </StyledOption>
      {analystList.map((analystKey) => {
        const analyst = allAnalysts.nodes[analystKey];
        const analystName = `${analyst.givenName} ${analyst.familyName}`;

        return (
          <StyledOption
            key={analystName}
            value={analyst.rowId}
            selected={lead === analystName}
          >
            {analystName}
          </StyledOption>
        );
      })}
    </StyledDropdown>
  );
};

export default AssignLead;
