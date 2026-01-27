import { WidgetProps } from '@rjsf/utils';
import {
  INTAKE_3_AREAS_OF_INTEREST,
  INTAKE_4_AREAS_OF_INTEREST,
} from 'data/externalConstants';
import ALL_INTAKE_ZONES from 'data/intakeZones';
import Link from 'next/link';
import styled from 'styled-components';

const StyledError = styled('div')`
  font-weight: 700;
`;

const StyledContainer = styled('div')`
  padding-bottom: 12px;
`;

const ReadOnlyProjectAreaWidget: React.FC<WidgetProps> = ({ formContext }) => {
  const projectAreas = formContext?.acceptedProjectAreasArray || null;
  const isAllAreasEligible =
    formContext?.acceptedProjectAreasArray?.length === ALL_INTAKE_ZONES.length;
  const allowUnlistedFnLedZones = formContext?.allowUnlistedFnLedZones ?? true;

  return (
    <>
      {isAllAreasEligible ? (
        <StyledContainer>
          <StyledError>
            IMPORTANT: For Intake {formContext?.intakeNumber}, CCBC will accept
            applications for all eligible areas in the Province. In particular,
            in certain areas of interest that have been highlighted in all
            zones. Refer to the{' '}
            <Link
              href={INTAKE_4_AREAS_OF_INTEREST}
              target="_blank"
              rel="noopener noreferrer"
            >
              BC Data catalogue
            </Link>{' '}
            for maps of these areas of interest.
          </StyledError>
          {allowUnlistedFnLedZones && (
            <StyledError>
              Projects that are First Nation-led or First Nation-supported
              continue to be accepted in all zones.
            </StyledError>
          )}
        </StyledContainer>
      ) : (
        <StyledError>
          IMPORTANT: For Intake {formContext?.intakeNumber}, CCBC is considering
          the following projects:
          <ul>
            <li>
              Projects in certain areas of interest in the province (within
              zones {projectAreas?.toString()}) that remain underserved as
              outlined in maps in the{' '}
              <Link
                href={INTAKE_3_AREAS_OF_INTEREST}
                target="_blank"
                rel="noopener noreferrer"
              >
                BC Data catalogue;
              </Link>{' '}
              {allowUnlistedFnLedZones && 'and or'}
            </li>
            {allowUnlistedFnLedZones && (
              <li>
                Projects that are First Nation-led or First Nation-supported in
                any area of the province.
              </li>
            )}
          </ul>
        </StyledError>
      )}
    </>
  );
};

export default ReadOnlyProjectAreaWidget;
