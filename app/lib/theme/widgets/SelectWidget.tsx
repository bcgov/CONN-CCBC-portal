import { WidgetProps } from '@rjsf/core';
import { Dropdown } from '@button-inc/bcgov-theme';
import { Label } from '../../../components/Form';
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

  select:disabled {
    background: inherit;
    border: 1px solid rgba(96, 96, 96, 0.3);
    opacity: 0;
  }

  & div:first-child {
    background: ${(props) => props.disabled && 'rgba(196, 196, 196, 0.3)'};
    border: ${(props) => props.disabled && ' 1px solid rgba(96, 96, 96, 0.3)'};
  }
`;

const StyledDiv = styled('div')`
  margin-bottom: 32px;
`;

const SelectWidget: React.FC<WidgetProps> = ({
  id,
  disabled,
  onChange,
  label,
  value,
  required,
  placeholder,
  schema,
  uiSchema,
}) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const options = schema.enum as Array<string>;
  const description = uiSchema ? uiSchema['ui:description'] : null;

  return (
    <StyledDiv>
      <StyledSelect
        id={id}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value || undefined)
        }
        disabled={disabled}
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
        {description && <Label>{description}</Label>}
      </StyledSelect>
    </StyledDiv>
  );
};

export default SelectWidget;
