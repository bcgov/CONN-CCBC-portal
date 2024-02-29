import { WidgetProps } from '@rjsf/utils';
import { INTAKE_3_AREAS_OF_INTEREST } from 'data/externalConstants';
import Link from 'next/link';
import styled from 'styled-components';

const StyledError = styled('div')`
  font-weight: 700;
`;

const ReadOnlyProjectAreaWidget: React.FC<WidgetProps> = ({ formContext }) => {
  const projectAreas = formContext?.acceptedProjectAreasArray || null;

  return (
    <StyledError>
      IMPORTANT: For this intake, CCBC is considering the following projects:
      <ul>
        <li>
          Projects in certain areas of interest in the province (within zones{' '}
          {projectAreas?.toString()}) that remain underserved as outlined in
          maps in the{' '}
          <Link
            href={INTAKE_3_AREAS_OF_INTEREST}
            target="_blank"
            rel="noopener noreferrer"
          >
            BC Data catalogue;
          </Link>{' '}
          and or
        </li>
        <li>
          Projects that are First Nation-led or First Nation-supported in any
          area of the province.
        </li>
      </ul>
    </StyledError>
  );
};

export default ReadOnlyProjectAreaWidget;
