import { WidgetProps } from '@rjsf/utils';
import styled from 'styled-components';

const StyledError = styled('div')`
  font-weight: 700;
`;

const ReadOnlyProjectAreaWidgetIntakeFour: React.FC<WidgetProps> = () => {
  return (
    <StyledError>
      IMPORTANT: For Intake 4, CCBC will accept applications for all eligible
      areas in the Province. In particular, in certain areas of interest that
      have been highlighted in all zones. Refer to the BC Data catalogue for
      maps of these areas of interest. Projects that are First Nation-led or
      First Nation-supported continue to be accepted in all Zones.
    </StyledError>
  );
};

export default ReadOnlyProjectAreaWidgetIntakeFour;
