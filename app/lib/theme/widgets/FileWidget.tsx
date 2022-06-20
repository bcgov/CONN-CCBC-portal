import { WidgetProps } from '@rjsf/core';
import { Label } from '../../../components/Form';
import styled from 'styled-components';
import { Button } from '@button-inc/bcgov-theme';

const StyledDiv = styled('div')`
  margin-top: 12px;
  margin-bottom: 4px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FileWidget: React.FC<WidgetProps> = ({
  id,
  placeholder,
  onChange,
  label,
  value,
  required,
  uiSchema,
}) => {
  const description = uiSchema['ui:description'];

  return (
    <StyledDiv>
      {description && <Label>{description}</Label>}
      <Button>Upload</Button>
    </StyledDiv>
  );
};

export default FileWidget;
