import { WidgetProps } from '@rjsf/core';
import Checkbox from '@button-inc/bcgov-theme/Checkbox';
import styled from 'styled-components';

interface Props {
  columns: number;
}

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

const StyledContainer = styled('div')<Props>`
  margin: 16px 0;
  column-count: ${(props) => props.columns || 1};
`;

const CheckboxesWidget: React.FC<WidgetProps> = ({
  disabled,
  id,
  onChange,
  label,
  options,
  value,
  required,
}) => {
  const columns = options?.checkboxColumns as number;

  function selectValue(val: any, selected: any, all: any) {
    const at = all.indexOf(val);
    const updated = selected.slice(0, at).concat(val, selected.slice(at));
    return updated.sort((a: any, b: any) => all.indexOf(a) > all.indexOf(b));
  }

  function deselectValue(val: any, selected: any) {
    return selected.filter((v: any) => v !== val);
  }

  const { enumOptions }: any = options;
  return (
    <StyledContainer columns={columns}>
      {enumOptions &&
        enumOptions.map(
          (option: { value: string; label: string }, i: number) => {
            const checked = value.indexOf(option.value) !== -1;
            return (
              <StyledDiv
                key={option.value}
                style={{ opacity: disabled && '0.6' }}
              >
                <Checkbox
                  id={`${id}-${i}`}
                  onChange={(event: any) => {
                    const all = enumOptions.map(({ val }: any) => val);
                    if (event.target.checked) {
                      onChange(selectValue(option.value, value, all));
                    } else {
                      onChange(deselectValue(option.value, value));
                    }
                  }}
                  checked={checked}
                  value={value}
                  required={required}
                  aria-label={label}
                  disabled={disabled}
                />
                <div>{option.label}</div>
              </StyledDiv>
            );
          }
        )}
    </StyledContainer>
  );
};

export default CheckboxesWidget;
