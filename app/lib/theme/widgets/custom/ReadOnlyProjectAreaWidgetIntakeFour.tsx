import { WidgetProps } from '@rjsf/utils';
import Link from '@button-inc/bcgov-theme/Link';
import styled from 'styled-components';
import { INTAKE_4_AREAS_OF_INTEREST } from 'data/externalConstants';

const StyledError = styled('div')`
  font-weight: 700;
  padding-bottom: 10px;
`;

const ReadOnlyProjectAreaWidgetIntakeFour: React.FC<WidgetProps> = ({
  formContext,
}) => {
  return (
    <>
      <StyledError>
        IMPORTANT: For Intake {formContext?.intakeNumber}, CCBC will accept
        applications for all eligible areas in the Province. In particular, in
        certain areas of interest that have been highlighted in all zones. Refer
        to the{' '}
        <Link
          href={INTAKE_4_AREAS_OF_INTEREST}
          target="_blank"
          rel="noopener noreferrer"
        >
          BC Data catalogue
        </Link>{' '}
        for maps of these areas of interest.
      </StyledError>
      <StyledError>
        Projects that are First Nation-led or First Nation-supported continue to
        be accepted in all zones.
      </StyledError>
    </>
  );
};

export default ReadOnlyProjectAreaWidgetIntakeFour;
