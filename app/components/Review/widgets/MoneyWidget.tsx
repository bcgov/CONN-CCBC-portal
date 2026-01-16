import { WidgetProps } from '@rjsf/utils';
import formatMoney from 'utils/formatMoney';
import { StyledSourceSpan } from './DefaultWidget';

const MoneyWidget: React.FC<WidgetProps> = ({
  value,
  formContext,
  name,
  options,
}) => (
  <>
    {formatMoney(value, options?.decimals as number)}
    {formContext?.formDataSource?.[name] &&
      value !== null &&
      typeof value !== 'undefined' &&
      !!value && (
        <StyledSourceSpan>
          {` (${formContext.formDataSource?.[name]})`}
        </StyledSourceSpan>
      )}
  </>
);

export default MoneyWidget;
