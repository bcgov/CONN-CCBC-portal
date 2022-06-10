import { WidgetProps } from '@rjsf/core';
import { Label } from '../../../components/Form';
import Input from '@button-inc/bcgov-theme/Input';
import styled from 'styled-components';

const StyledInput = styled(Input)`
  & input {
    margin: 12px 0;
    width: ${(props) => props.theme.width.inputWidthSmall};
  }
`;

const StyledDiv = styled('div')`
  margin-bottom: 32px;
`;

const TextWidget: React.FC<WidgetProps> = ({
  id,
  placeholder,
  onChange,
  label,
  value,
  required,
  uiSchema,
}) => {
  const description = uiSchema['ui:description'];
  const maxLength = uiSchema['ui:options']?.maxLength;
  const minLength = uiSchema['ui:options']?.minLength;
  return (
    <StyledDiv>
      <StyledInput
        id={id}
        onChange={(e: { target: { value: string } }) =>
          onChange(e.target.value || undefined)
        }
        placeholder={placeholder}
        value={value || ''}
        size={'medium'}
        required={required}
        aria-label={label}
        maxLength={maxLength}
        minLength={minLength}
      />
      {description && <Label>{description}</Label>}
    </StyledDiv>
  );
};

export default TextWidget;
