import { WidgetProps } from '@rjsf/core';
import { Dropdown } from '@button-inc/bcgov-theme';
import styled from 'styled-components';
import { Label } from '../../../components/Form';

interface SelectWidgetProps extends WidgetProps {
  customOption?: React.ReactNode;
}

interface SelectProps {
  isPlaceholder: boolean;
}
const StyledSelect = styled(Dropdown)<SelectProps>`
  .pg-select-wrapper {
    margin: 12px 0;
    width: ${(props) => props.theme.width.inputWidthSmall};
  }
  .pg-select-wrapper:after {
    margin: 0.3em 0;
  }
  & select {
    color: ${(props) => (props.isPlaceholder ? '#cccccc' : 'inherit')};
    margin: 0.25em 0;
  }

  select option:first-child{
    color: ${(props) => (props.isPlaceholder ? '#cccccc' : 'inherit')};
  }

  select option {
    color: #000000;
  }

  select:disabled {
    background: ${(props) =>
      props.disabled ? props.theme.color.backgroundGrey : 'inherit'};
    border: 1px solid rgba(96, 96, 96, 0.3);
  }

  & div:first-child {
    background: ${(props) =>
      props.disabled ? props.theme.color.backgroundGrey : 'inherit'};
    border: ${(props) => props.disabled && ' 1px solid rgba(96, 96, 96, 0.3)'};
  }
`;

const StyledDiv = styled('div')`
  margin-bottom: 32px;
`;

const SelectWidget: React.FC<SelectWidgetProps> = ({
  id,
  disabled,
  onChange,
  label,
  value,
  required,
  placeholder,
  schema,
  uiSchema,
  customOption,
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
        data-testid={id}
        disabled={disabled}
        isPlaceholder={!value || value === placeholder}
        placeholder={placeholder}
        size="medium"
        required={required}
        value={value}
        aria-label={label}
      >
        <option key={`option-placeholder-${id}`} value={undefined}>
          {placeholder}
        </option>
        {options &&
          options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        {customOption ?? customOption}
        {description && <Label>{description}</Label>}
      </StyledSelect>
    </StyledDiv>
  );
};

export default SelectWidget;
