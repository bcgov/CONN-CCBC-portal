import { WidgetProps } from '@rjsf/utils';
import { SelectWidget } from 'lib/theme/widgets';

interface SelectWidgetProps extends WidgetProps {
  customOption?: React.ReactNode;
}
const StatusSelectWidget: React.FC<SelectWidgetProps> = (props) => {
  const { formContext } = props;
  const isBcMinisterApproved =
    formContext?.formData?.decision?.ministerDecision === 'Approved';
  const isFederalMinisterApproved =
    formContext?.formData?.isedDecisionObj?.isedDecision === 'Approved';
  const isMinisterApproved = isBcMinisterApproved || isFederalMinisterApproved;
  const isApplicantAccepted =
    formContext?.formData?.response?.applicantResponse === 'Accepted';
  const isAccepted = isMinisterApproved && isApplicantAccepted;

  return <SelectWidget {...props} disabled={!isAccepted} />;
};

export default StatusSelectWidget;
