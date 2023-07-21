import { useState } from 'react';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import FormBase from 'components/Form/FormBase';
import intakeSchema from 'formSchema/admin/intake';
import intakeUiSchema from 'formSchema/uiSchema/admin/intakeUiSchema';
import DefaultTheme from 'lib/theme/DefaultTheme';
import BasicFieldTemplate from 'lib/theme/templates/BasicFieldTemplate';
import ReadOnlyWidget from 'components/Analyst/Project/ConditionalApproval/widgets/ReadOnlyWidget';
import { useCreateIntakeMutation } from 'schema/mutations/admin/createIntakeMutation';
import { DateTime } from 'luxon';

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

interface Props {
  allIntakesConnectionId: string;
}

const AddIntake: React.FC<Props> = ({ allIntakesConnectionId }) => {
  const [createIntake] = useCreateIntakeMutation();
  const [isFormEditMode, setIsFormEditMode] = useState(false);

  const handleSubmit = (e) => {
    const intakeNumber = e.formData?.intakeNumber;
    const startTime = e.formData?.startDate;
    const endTime = e.formData?.endDate;
    console.log(e.formData);
    console.log(intakeNumber, startTime, endTime);
    createIntake({
      variables: {
        connections: [allIntakesConnectionId],
        input: { ccbcNumber: parseInt(intakeNumber, 10), endTime, startTime },
      },
      onCompleted: () => {
        setIsFormEditMode(false);
      },
    });
  };

  const validate = (jsonData, errors) => {
    const { startDate, endDate } = jsonData;
    const currentDateTime = DateTime.now();
    const startDateTime = DateTime.fromISO(startDate);
    const endDateTime = DateTime.fromISO(endDate);

    if (startDateTime < currentDateTime) {
      errors?.startDate.addError(
        'Start date & time must be after current date & time'
      );
    }

    if (endDateTime < startDateTime) {
      errors?.endDate.addError(
        'End date & time must be after start date & time'
      );
    }
    return errors;
  };

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
            formData={{
              intakeNumber: 501,
            }}
            liveValidate
            schema={intakeSchema}
            uiSchema={intakeUiSchema}
            onSubmit={handleSubmit}
            theme={{
              ...DefaultTheme,
              widgets: {
                ...DefaultTheme.widgets,
                ReadOnlyWidget,
              },
              FieldTemplate: BasicFieldTemplate,
            }}
            validate={validate}
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
