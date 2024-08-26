import { WidgetProps } from '@rjsf/utils';
import { StyledSourceSpan } from './DefaultWidget';

const DateWidget: React.FC<WidgetProps> = ({ value, formContext, name }) => {
  const date = value?.toString().split('T')[0];
  return (
    <>
      {date}
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

export default DateWidget;
