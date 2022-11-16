import styled from 'styled-components';
import { useAssignAnalystMutation } from '../../schema/mutations/application/createApplicationAnalystLead';

const StyledDropdown = styled.select`
  text-overflow: ellipsis;
  color: ${(props) => props.theme.color.links};
  background-color: ${(props) => props.theme.color.white};
  border: 1px solid ${(props) => props.theme.color.borderGrey};
  padding: 8px;
  max-width: 100%;
  border-radius: 4px;
`;

const StyledOption = styled.option``;

interface Props {
  lead: string;
  analysts: any;
  applicationId: number;
  label?: string;
}

const AssignLead: React.FC<Props> = ({
  analysts = {},
  applicationId,
  label = 'Unassigned',
  lead,
}) => {
  const [assignAnalyst] = useAssignAnalystMutation();

  const handleAssignAnalyst = (e) => {
    const analystId = parseInt(e.target.value, 10);

    assignAnalyst({
      variables: {
        input: { applicationAnalystLead: { analystId, applicationId } },
      },
    });
  };

  const analystList = Object.keys(analysts);
  return (
    <StyledDropdown name="assign-analyst" onChange={handleAssignAnalyst}>
      <StyledOption selected={!lead}>{label}</StyledOption>
      {analystList.map((analystKey) => {
        const analyst = analysts[analystKey];
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
