import styled from 'styled-components';

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
  lead: any;
  analysts: any;
}

const AssignLead: React.FC<Props> = ({ analysts, lead }) => {
  const analystList = Object.keys(analysts);
  return (
    <StyledDropdown name="assign-analyst" onChange={() => {}}>
      <StyledOption selected={!lead}>Unassigned</StyledOption>
      {analystList.map((analystKey) => {
        const analyst = analysts[analystKey];
        const analystName = `${analyst.givenName} ${analyst.familyName}`;
        return (
          <StyledOption
            key={analystName}
            value={analystName}
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
