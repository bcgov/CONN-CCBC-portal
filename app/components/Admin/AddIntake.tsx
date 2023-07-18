import { useState } from 'react';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import FormBase from 'components/Form/FormBase';
import intakeSchema from 'formSchema/admin/intake';
import intakeUiSchema from 'formSchema/uiSchema/admin/intakeUiSchema';

const StyledButton = styled(Button)`
  // overflow: hidden for the animation was cutting off focus border so adding a small margin
  margin: 4px;
`;

interface EditProps {
  isFormEditMode: boolean;
}

const StyledBtnContainer = styled.div<EditProps>`
  margin: ${(props) => (props.isFormEditMode ? '0px' : '16px 0')};
  overflow: hidden;
  max-height: ${(props) => (props.isFormEditMode ? '0px' : '50px')};
  transition: all 0.5s;
`;

const StyledForm = styled.section<EditProps>`
  overflow: hidden;
  max-height: ${(props) => (props.isFormEditMode ? '500px' : '0px')};
  transition: max-height 0.5s;
`;

const StyledSaveBtn = styled(StyledButton)`
  margin-right: 16px;
`;

const AddIntake = () => {
  const [isFormEditMode, setIsFormEditMode] = useState(false);
  return (
    <div>
      <StyledBtnContainer isFormEditMode={isFormEditMode}>
        <StyledButton
          isFormEditMode={isFormEditMode}
          onClick={() => setIsFormEditMode(true)}
          variant="secondary"
        >
          Add intake
        </StyledButton>
      </StyledBtnContainer>
      <StyledForm isFormEditMode={isFormEditMode}>
        <FormBase schema={intakeSchema} uiSchema={intakeUiSchema}>
          <StyledSaveBtn>Save</StyledSaveBtn>
          <StyledButton
            onClick={() => setIsFormEditMode(false)}
            variant="secondary"
          >
            Cancel
          </StyledButton>
        </FormBase>
      </StyledForm>
    </div>
  );
};

export default AddIntake;
