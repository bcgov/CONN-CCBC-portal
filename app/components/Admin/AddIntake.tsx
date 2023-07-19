import { useState } from 'react';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import FormBase from 'components/Form/FormBase';
import intakeSchema from 'formSchema/admin/intake';
import intakeUiSchema from 'formSchema/uiSchema/admin/intakeUiSchema';
import DefaultTheme from 'lib/theme/DefaultTheme';
import BasicFieldTemplate from 'lib/theme/templates/BasicFieldTemplate';

interface EditProps {
  isFormEditMode: boolean;
}

const StyledContainer = styled.div`
  border: 1px solid #606060;
  border-radius: 4px;
  padding: 24px;
`;

const StyledBtnContainer = styled.div<EditProps>`
  margin: ${(props) => (props.isFormEditMode ? '0px' : '16px 0')};
  overflow: hidden;
  max-height: ${(props) => (props.isFormEditMode ? '0px' : '50px')};
  transition: all 0.5s;

  & button {
    margin: 4px;
  }
`;

const StyledForm = styled.section<EditProps>`
  overflow: hidden;
  max-height: ${(props) => (props.isFormEditMode ? '500px' : '0px')};
  transition: max-height 0.5s;
  padding: 4px 0;
  max-width: 480px;

  .datetime-widget {
    width: 240px;
  }

  .pg-input,
  .pg-input-input {
    width: 100%;
  }
`;

const StyledSaveBtn = styled(Button)`
  margin-right: 16px;
`;

const AddIntake = () => {
  const [isFormEditMode, setIsFormEditMode] = useState(false);
  return (
    <StyledContainer>
      <StyledBtnContainer isFormEditMode={isFormEditMode}>
        <Button
          isFormEditMode={isFormEditMode}
          onClick={() => setIsFormEditMode(true)}
          variant="secondary"
        >
          Add intake
        </Button>
      </StyledBtnContainer>
      <StyledForm isFormEditMode={isFormEditMode}>
        <FormBase
          schema={intakeSchema}
          uiSchema={intakeUiSchema}
          theme={{
            ...DefaultTheme,
            FieldTemplate: BasicFieldTemplate,
          }}
        >
          <StyledSaveBtn>Save</StyledSaveBtn>
          <Button onClick={() => setIsFormEditMode(false)} variant="secondary">
            Cancel
          </Button>
        </FormBase>
      </StyledForm>
    </StyledContainer>
  );
};

export default AddIntake;
