import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';
import StyledSelect from '../components/StyledDropdown';
import { Label } from '../../../components/Form';

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
        {description && <Label>{description}</Label>}
      </StyledSelect>
    </StyledDiv>
  );
};

export default SelectWidget;
