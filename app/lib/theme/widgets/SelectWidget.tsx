import { WidgetProps } from '@rjsf/core';
import { Dropdown } from '@button-inc/bcgov-theme';
import styled from 'styled-components';

const StyledSelect = styled(Dropdown)`
  .pg-select-wrapper {
    margin: 12px 0;
    width: ${(props) => props.theme.width.inputWidthSmall};
  }
  .pg-select-wrapper:after {
    margin: 0.3em 0;
  }
  & select {
    margin: 0.25em 0;
  }
`;

const SelectWidget: React.FC<WidgetProps> = ({
  id,
  onChange,
  label,
  value,
  required,
  placeholder,
  schema,
}) => {
  // @ts-ignore
  const options = schema.items?.enum as Array<string>;

  return (
    <StyledSelect
      id={id}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value || undefined)
      }
      placeholder={placeholder}
      size={'medium'}
      required={required}
      value={value}
      aria-label={label}
    >
      <option key={`option-placeholder-${id}`} value={undefined}>
        {placeholder}
      </option>
      {options &&
        options.map((opt) => {
          return (
            <option key={opt} value={opt}>
              {opt}
            </option>
          );
        })}
    </StyledSelect>
  );
};

export default SelectWidget;
