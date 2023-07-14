import { WidgetProps } from '@rjsf/utils';
import styled from 'styled-components';

export const StyledValue = styled('div')`
  padding: 8px 0;
  min-width: 196px;
  min-height: 22px;
`;

const ReadOnlyWidget: React.FC<WidgetProps> = ({ value }) => {
  if (!value) return null;
  return <StyledValue>{value}</StyledValue>;
};

export default ReadOnlyWidget;
