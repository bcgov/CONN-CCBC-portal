import { FieldTemplateProps } from '@rjsf/utils';
import styled from 'styled-components';

const StyledH4 = styled.h4`
  color: #9b9b9b;
  margin: 0;
  font-size: 14px;
  margin-bottom: 8px;
`;

const StyledContainer = styled.div`
  .pg-select-wrapper,
  .datepicker-widget,
  .url-widget-wrapper,
  .ccbcid-widget-wrapper {
    max-width: 100%;
    width: 100%;
  }

  ${(props) => props.theme.breakpoint.smallUp} {
    .pg-select-wrapper,
    .datepicker-widget,
    .url-widget-wrapper,
    .ccbcid-widget-wrapper {
      max-width: 340px;
      width: 100%;
    }
  }
  .select-widget-wrapper {
    margin-bottom: 0px;
  }
`;

const ProjectFieldTemplate: React.FC<FieldTemplateProps> = ({
  children,
  uiSchema,
}) => {
  const uiTitle = `${uiSchema?.['ui:label'] ?? uiSchema?.['ui:title']}`;
  const hidden = uiSchema?.['ui:widget'] === 'HiddenWidget' || false;
  return (
    <>
      {!hidden && (
        <StyledContainer>
          {uiTitle && <StyledH4>{uiTitle}</StyledH4>}
          {children}
        </StyledContainer>
      )}
    </>
  );
};

export default ProjectFieldTemplate;
