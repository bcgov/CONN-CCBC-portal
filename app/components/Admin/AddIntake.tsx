import { useState } from 'react';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import FormBase from 'components/Form/FormBase';
import intakeSchema from 'formSchema/admin/intake';
import intakeUiSchema from 'formSchema/uiSchema/admin/intakeUiSchema';
import DefaultTheme from 'lib/theme/DefaultTheme';
import BasicFieldTemplate from 'lib/theme/templates/BasicFieldTemplate';
import ReadOnlyWidget from 'components/Analyst/Project/ConditionalApproval/widgets/ReadOnlyWidget';

interface EditProps {
  isFormEditMode: boolean;
}

const StyledContainer = styled.div<EditProps>`
  border: 1px solid #606060;
  border-radius: 4px;
  padding: 0 24px;
  visibility: ${({ isFormEditMode }) =>
    isFormEditMode ? 'visible' : 'hidden'};
  transition: all 0.5s;
`;

const StyledBtnContainer = styled.div<EditProps>`
  margin: ${({ isFormEditMode }) => (isFormEditMode ? '0px' : '16px 0')};
  overflow: hidden;
  max-height: ${({ isFormEditMode }) => (isFormEditMode ? '0px' : '50px')};
  transition: all 0.5s;

  & button {
    margin: 4px;
  }
`;

const StyledForm = styled.section<EditProps>`
  overflow: hidden;
  max-height: ${({ isFormEditMode }) => (isFormEditMode ? '500px' : '0px')};
  transition: max-height 0.5s;
  padding-left: 4px;
  max-width: 480px;
  margin-top: ${({ isFormEditMode }) => (isFormEditMode ? '24px' : '0px')};

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
  const [formData] = useState({
    intakeNumber: 1,
  } as any);

  return (
    <section>
      <StyledBtnContainer isFormEditMode={isFormEditMode}>
        <Button
          isFormEditMode={isFormEditMode}
          onClick={() => setIsFormEditMode(true)}
          variant="secondary"
        >
          Add intake
        </Button>
      </StyledBtnContainer>
      <StyledContainer isFormEditMode={isFormEditMode}>
        <StyledForm isFormEditMode={isFormEditMode}>
          <FormBase
            formData={formData}
            schema={intakeSchema}
            uiSchema={intakeUiSchema}
            theme={{
              ...DefaultTheme,
              widgets: {
                ...DefaultTheme.widgets,
                ReadOnlyWidget,
              },
              FieldTemplate: BasicFieldTemplate,
            }}
          >
            <StyledSaveBtn>Save</StyledSaveBtn>
            <Button
              onClick={() => setIsFormEditMode(false)}
              variant="secondary"
            >
              Cancel
            </Button>
          </FormBase>
        </StyledForm>
      </StyledContainer>
    </section>
  );
};

export default AddIntake;
