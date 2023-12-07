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
  color: #e71f1f;
  font-weight: 700;
`;

const ReadOnlyProjectAreaWidget: React.FC<WidgetProps> = ({ formContext }) => {
  const projectAreas = formContext?.acceptedProjectAreasArray || null;

  return (
    <StyledContainer>
      <StyledError>
        {`Please note that we are only accepting applications for Zones ${projectAreas?.toString()} in this intake.`}{' '}
        <br />
      </StyledError>
    </StyledContainer>
  );
};

export default ReadOnlyProjectAreaWidget;
