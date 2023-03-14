import { WidgetProps } from '@rjsf/core';
import { SelectWidget } from 'lib/theme/widgets';

interface SelectWidgetProps extends WidgetProps {
  customOption?: React.ReactNode;
}
const StatusSelectWidget: React.FC<SelectWidgetProps> = (props) => {
  const { formContext } = props;
  const isMinisterApproved =
    formContext?.formData?.decision?.ministerDecision === 'Approved';
  const isApplicantAccepted =
    formContext?.formData?.response?.applicantResponse === 'Accepted';
  const isDisabled = !isMinisterApproved && !isApplicantAccepted;

  return <SelectWidget {...props} disabled={isDisabled} />;
};

export default StatusSelectWidget;
