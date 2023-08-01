import { useState } from 'react';
import styled from 'styled-components';
import { graphql, useFragment } from 'react-relay';
import { AjvError, IChangeEvent } from '@rjsf/core';
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
    width: 250px;
  }

  .pg-input,
  .pg-input-input {
    width: 98%;
  }

  .formFieldset {
    margin: 0;
  }
`;

const StyledSaveBtn = styled(Button)`
  margin-right: 16px;
`;

const IntakeTheme = {
  ...DefaultTheme,
  widgets: {
    ...DefaultTheme.widgets,
    ReadOnlyWidget,
  },
  FieldTemplate: BasicFieldTemplate,
};

const customTransformErrors = (errors: AjvError[]) =>
  errors.map((error) => {
    // remove 'Please enter a value' error from null fields so we can add specific error messages
    if (error.name === 'required')
      return {
        ...error,
        message: ``,
      };
    return error;
  });

interface Props {
  applicationQuery: any;
}

const AddIntake: React.FC<Props> = ({ applicationQuery }) => {
  const queryFragment = useFragment(
    graphql`
      fragment AddIntake_query on Query {
        allIntakes(first: 999, orderBy: CCBC_INTAKE_NUMBER_DESC)
          @connection(key: "ApplicationIntakes_allIntakes") {
          __id
          edges {
            node {
              ccbcIntakeNumber
              closeTimestamp
              openTimestamp
            }
          }
        }
      }
    `,
    applicationQuery
  );

  const { allIntakes } = queryFragment;

  const intakeList = allIntakes?.edges;
  const latestIntake = intakeList[0].node;
  const latestIntakeNumber = (latestIntake?.ccbcIntakeNumber as number) || 0;
  const latestIntakeCloseTimestamp = latestIntake?.closeTimestamp;
  const newIntakeNumber = latestIntakeNumber + 1;
  const allIntakesConnectionId = allIntakes?.__id;

  // check if the latest intake opens before the current date
  const isNewIntakeAllowed =
    !latestIntake ||
    DateTime.fromISO(latestIntake?.openTimestamp) < DateTime.now();
  const defaultFormData = {
    intakeNumber: newIntakeNumber,
  };

  const [createIntake] = useCreateIntakeMutation();
  const [isFormEditMode, setIsFormEditMode] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);

  const handleSubmit = (e) => {
    const startTime = e.formData?.startDate;
    const endTime = e.formData?.endDate;
    const description = e.formData?.description;

    createIntake({
      variables: {
        connections: [allIntakesConnectionId],
        input: {
          intakeDescription: description,
          endTime,
          startTime,
        },
      },
      onCompleted: () => {
        setIsFormSubmitting(false);
        setIsFormEditMode(false);
        setFormData(defaultFormData);
      },
    });
  };

  const validate = (jsonData, errors) => {
    const { startDate, endDate } = jsonData;
    const currentDateTime = DateTime.now();
    const startDateTime = DateTime.fromISO(startDate);
    const endDateTime = DateTime.fromISO(endDate);

    const latestIntakeEndDateTime = DateTime.fromISO(
      latestIntakeCloseTimestamp
    );

    if (!startDate && isFormSubmitting) {
      errors?.startDate.addError('Start date & time must be entered');
    }

    if (!endDate && isFormSubmitting) {
      errors?.endDate.addError('End date & time must be entered');
    }

    if (startDateTime <= currentDateTime) {
      errors?.startDate.addError(
        'Start date & time must be after current date & time'
      );
    } else if (startDateTime <= latestIntakeEndDateTime) {
      errors?.startDate.addError(
        'Start date & time must not overlap with the previous intake'
      );
    }

    if (endDateTime <= startDateTime) {
      errors?.endDate.addError(
        'End date & time must be after start date & time'
      );
    }
    return errors;
  };

  return (
    <section>
      <StyledBtnContainer isFormEditMode={isFormEditMode}>
        {isNewIntakeAllowed && (
          <Button
            isFormEditMode={isFormEditMode}
            onClick={() => setIsFormEditMode(true)}
            variant="secondary"
          >
            Add intake
          </Button>
        )}
      </StyledBtnContainer>
      <StyledContainer isFormEditMode={isFormEditMode}>
        <StyledForm isFormEditMode={isFormEditMode}>
          <FormBase
            formData={formData}
            onChange={(e: IChangeEvent) => setFormData({ ...e.formData })}
            liveValidate={isFormEditMode}
            schema={intakeSchema}
            uiSchema={intakeUiSchema}
            onSubmit={handleSubmit}
            transformErrors={customTransformErrors}
            theme={IntakeTheme}
            validate={validate}
          >
            <StyledSaveBtn
              type="submit"
              onClick={() => {
                setIsFormSubmitting(true);
              }}
            >
              Save
            </StyledSaveBtn>
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
