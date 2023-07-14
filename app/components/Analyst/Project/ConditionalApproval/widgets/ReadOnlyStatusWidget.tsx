import { WidgetProps } from '@rjsf/utils';
import { StyledValue } from './ReadOnlyWidget';
import StyledStatus from '../StyledStatus';

const ReadOnlyStatusWidget: React.FC<WidgetProps> = ({ value }) => {
  const isConditionallyApproved = value === 'Conditionally Approved';

  return (
    <StyledValue>
      {isConditionallyApproved ? (
        <StyledStatus data-testid="read-only-status-widget" statusType={value}>
          Conditionally Approved
        </StyledStatus>
      ) : (
        <StyledStatus data-testid="read-only-status-widget" statusType={value}>
          Received
        </StyledStatus>
      )}
    </StyledValue>
  );
};

export default ReadOnlyStatusWidget;
