import { WidgetProps } from '@rjsf/utils';
import styled from 'styled-components';

export const StyledSourceSpan = styled('span')`
  color: #2e8540;
`;

const DefaultWidget: React.FC<WidgetProps> = ({ value, formContext, name }) => {
  return (
    <>
      {value?.toString()}
      {formContext?.formDataSource?.[name] &&
        value !== null &&
        typeof value !== 'undefined' && (
          <StyledSourceSpan>
            {` (${formContext.formDataSource?.[name]})`}
          </StyledSourceSpan>
        )}
    </>
  );
};

export default DefaultWidget;
