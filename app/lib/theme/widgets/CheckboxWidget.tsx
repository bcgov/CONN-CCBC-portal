import { WidgetProps } from '@rjsf/core';
import Checkbox from '@button-inc/bcgov-theme/Checkbox';
import styled from 'styled-components';

const StyledDiv = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;

  & span {
    border-radius: 2px;
  }

  & label {
    padding-left: 1em;
  }

  & div {
    padding-right: 8px;
  }
`;

const StyledContainer = styled('div')`
  margin: 16px 0;
`;

const CheckboxWidget: React.FC<WidgetProps> = ({
  disabled,
  id,
  onChange,
  label,
  value,
  required,
}) => (
  <StyledContainer>
    <StyledDiv>
      <Checkbox
        id={id}
        checked={typeof value === 'undefined' ? false : value}
        value={value}
        required={required}
        aria-label={label}
        disabled={disabled}
        onChange={(event: { target: { checked: any } }) =>
          onChange(event.target.checked)
        }
      />
      <p>{label}</p>
    </StyledDiv>
  </StyledContainer>
);

export default CheckboxWidget;
