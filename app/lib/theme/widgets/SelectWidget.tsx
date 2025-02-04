import { WidgetProps } from '@rjsf/utils';
import { Dropdown } from '@button-inc/bcgov-theme';
import styled from 'styled-components';
import Label from 'components/Form/Label';

interface ObjectOptionProps {
  value: string | number;
  label: string;
}

interface SelectWidgetProps extends WidgetProps {
  customOption?: React.ReactNode;
  objectOptions?: ObjectOptionProps[];
}

interface SelectProps {
  isPlaceholder: boolean;
  isError: boolean;
}

const StyledSelect = styled(Dropdown)<SelectProps>`
  .pg-select-wrapper {
    border: ${(props) =>
      props.isError ? '2px solid #E71F1F' : '2px solid #606060'};
    margin-top: 8px;
    width: ${(props) => props.theme.width.inputWidthSmall};
  }
  .pg-select-wrapper:after {
    margin: 0.3em 0;
  }
  & select {
    color: ${(props) => (props.isPlaceholder ? '#cccccc' : 'inherit')};
    margin: 0.25em 0;
  }

  select option:first-child {
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
  margin-bottom: 16px;
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
  rawErrors,
  objectOptions,
}) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const options = objectOptions ?? (schema.enum as Array<string>);
  const description = uiSchema ? uiSchema['ui:description'] : null;
  const showNull = uiSchema?.['ui:shownull'] ?? true;
  const isError = rawErrors && rawErrors.length > 0 && !value;
  return (
    <StyledDiv className="select-widget-wrapper">
      <StyledSelect
        id={id}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value || undefined)
        }
        isError={isError}
        data-testid={id}
        disabled={disabled}
        isPlaceholder={!value || value === placeholder}
        placeholder={placeholder}
        size="medium"
        required={required}
        value={value}
        aria-label={label}
      >
        {showNull && (
          <option key={`option-placeholder-${id}`} value={undefined}>
            {placeholder}
          </option>
        )}
        ;
        {options?.map((opt, index) => {
          return (
            <option
              // eslint-disable-next-line react/no-array-index-key
              key={`${opt?.value ?? opt}_${index}`}
              value={opt?.value ?? opt}
            >
              {opt?.label ?? opt}
            </option>
          );
        })}
        {customOption ?? customOption}
        {description && <Label>{description}</Label>}
      </StyledSelect>
    </StyledDiv>
  );
};

export default SelectWidget;
