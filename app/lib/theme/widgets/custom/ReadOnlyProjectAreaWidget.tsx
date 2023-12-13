import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';

export const StyledContainer = styled('div')`
  margin-bottom: 8px;
`;

export const StyledValue = styled('div')`
  margin-top: 12px;
  margin-bottom: 4px;
  padding: 0.6em 0;
`;

const StyledError = styled('div')`
  font-weight: 700;
`;

const ReadOnlyProjectAreaWidget: React.FC<WidgetProps> = ({ formContext }) => {
  const projectAreas = formContext?.acceptedProjectAreasArray || null;

  return (
    <StyledContainer>
      <StyledError>
        {`Note: Intake 3 is currently open for project applications in selected areas of interest within Zones ${projectAreas?.toString()} and/or projects supported or led by First Nations in any of the 14 Zones.`}{' '}
        <br />
      </StyledError>
    </StyledContainer>
  );
};

export default ReadOnlyProjectAreaWidget;
