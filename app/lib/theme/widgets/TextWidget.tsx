import { WidgetProps } from '@rjsf/core';
import Input from '@button-inc/bcgov-theme/Input';
import styled from 'styled-components';

const StyledInput = styled(Input)`
  & input {
    margin: 12px 0;
    width: ${(props) => props.theme.width.inputWidthMid};
  }
`;
const TextWidget: React.FC<WidgetProps> = ({
  id,
  placeholder,
  onChange,
  label,
  value,
  required,
}) => {
  return (
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
    />
  );
};

export default TextWidget;
