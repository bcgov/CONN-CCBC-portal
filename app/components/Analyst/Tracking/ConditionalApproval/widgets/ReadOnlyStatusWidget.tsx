import { WidgetProps } from '@rjsf/core';
import { StyledValue } from './ReadOnlyWidget';
import StyledStatus from '../StyledStatus';

const ReadOnlyStatusWidget: React.FC<WidgetProps> = ({ value }) => {
  const isConditionallyApproved = value === 'Conditionally Approved';

  return (
    <StyledValue>
      {isConditionallyApproved ? (
        <StyledStatus statusType={value}>Conditionally Approved</StyledStatus>
      ) : (
        <StyledStatus statusType={value}>Received</StyledStatus>
      )}
    </StyledValue>
  );
};

export default ReadOnlyStatusWidget;
