import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import { AssignLead_query$key } from '__generated__/AssignLead_query.graphql';
import { useAssignAnalystMutation } from '../../schema/mutations/application/createApplicationAnalystLead';

interface StyledDropdownProps {
  children?: React.ReactNode;
  name?: string;
  id?: string;
  onChange?: (e: any) => void;
}

export const StyledDropdown = styled.select<StyledDropdownProps>`
  text-overflow: ellipsis;
  color: ${(props) => props.theme.color.links};
  background-color: ${(props) => props.theme.color.white};
  border: 1px solid ${(props) => props.theme.color.borderGrey};
  padding: 0 8px;
  max-width: 100%;
  border-radius: 4px;
`;

interface StyledOptionProps {
  children?: React.ReactNode;
  selected?: boolean;
  value?: any;
  key?: string;
  style?: React.CSSProperties;
}

const StyledOption = styled.option<StyledOptionProps>``;

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
  // if the lead is inactive, then it won't be returned from the query
  const isInactiveOption =
    allAnalysts.nodes.findIndex(
      // return true if an analyst matches or no assigned lead
      (analyst) =>
        `${analyst.givenName} ${analyst.familyName}` === lead || !lead
    ) === -1;

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
      {isInactiveOption && (
        <StyledOption style={{ display: 'none' }} selected>
          {lead}
        </StyledOption>
      )}
    </StyledDropdown>
  );
};

export default AssignLead;
