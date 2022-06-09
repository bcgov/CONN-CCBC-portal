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
  options,
  value,
  required,
}) => {
  function selectValue(value: any, selected: any, all: any) {
    const at = all.indexOf(value);
    const updated = selected.slice(0, at).concat(value, selected.slice(at));

    return updated.sort((a: any, b: any) => all.indexOf(a) > all.indexOf(b));
  }

  function deselectValue(value: any, selected: any) {
    return selected.filter((v: any) => v !== value);
  }

  const { enumOptions }: any = options;
  return (
    <StyledContainer>
      {enumOptions &&
        enumOptions.map(
          (option: { value: string; label: string }, i: number) => {
            const checked = value.indexOf(option.value) !== -1;

            return (
              <StyledDiv key={i}>
                <Checkbox
                  id={`${id}-${i}`}
                  onChange={(event: any) => {
                    const all = enumOptions.map(({ value }: any) => value);
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

export default CheckboxWidget;
