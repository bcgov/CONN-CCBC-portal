import { useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import Button from '@button-inc/bcgov-theme/Button';
import { useUpdateIntakeMutation } from 'schema/mutations/admin/updateIntakeMutation';
import FormBase from 'components/Form/FormBase';
import intakeSchema from 'formSchema/admin/intake';
import intakeUiSchema from 'formSchema/uiSchema/admin/intakeUiSchema';
import DefaultTheme from 'lib/theme/DefaultTheme';
import BasicFieldTemplate from 'lib/theme/templates/BasicFieldTemplate';
import ReadOnlyWidget from 'components/Analyst/Project/ConditionalApproval/widgets/ReadOnlyWidget';
import { useCreateIntakeMutation } from 'schema/mutations/admin/createIntakeMutation';
import { DateTime } from 'luxon';
import styled from 'styled-components';
import { IChangeEvent, ThemeProps } from '@rjsf/core';
import { CustomValidator, RJSFValidationError } from '@rjsf/utils';
import ALL_INTAKE_ZONES from 'data/intakeZones';

interface EditProps {
  isFormEditMode: boolean;
}

const StyledContainer = styled.div<EditProps>`
  border: 1px solid #606060;
  border-radius: 4px;
  padding: 0 24px;
  margin-bottom: 16px;
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
  max-height: ${({ isFormEditMode }) => (isFormEditMode ? '760px' : '0px')};
  transition: max-height 0.5s;
  padding-left: 4px;
  max-width: 680px;
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

const IntakeTheme: ThemeProps = {
  ...DefaultTheme,
  widgets: {
    ...DefaultTheme.widgets,
    ReadOnlyWidget,
  },
  templates: {
    ...DefaultTheme.templates,
    FieldTemplate: BasicFieldTemplate,
  },
};

const customTransformErrors = (errors: RJSFValidationError[]) =>
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
  formData: any;
  isIntakeEdit: boolean;
  intakeList: any;
  isFormEditMode: boolean;
  isStartDateDisabled: boolean;
  setFormData: (formData: any) => void;
  setIsFormEditMode: (isFormEditMode: boolean) => void;
  setIsIntakeEdit: (isIntakeEdit: boolean) => void;
  setIsStartDateDisabled: (isStartDateDisabled: boolean) => void;
}

const AddIntake: React.FC<Props> = ({
  applicationQuery,
  formData,
  isIntakeEdit,
  intakeList,
  isFormEditMode,
  isStartDateDisabled,
  setFormData,
  setIsFormEditMode,
  setIsIntakeEdit,
  setIsStartDateDisabled,
}) => {
  const queryFragment = useFragment(
    graphql`
      fragment AddIntake_query on Query {
        allIntakes(
          first: 999
          orderBy: CCBC_INTAKE_NUMBER_DESC
          condition: { archivedAt: null, hidden: false }
        ) @connection(key: "ApplicationIntakes_allIntakes") {
          __id
          edges {
            node {
              ccbcIntakeNumber
              closeTimestamp
              openTimestamp
              rollingIntake
            }
          }
        }
      }
    `,
    applicationQuery
  );

  const { allIntakes } = queryFragment;

  const latestIntake = intakeList[0]?.node;
  const latestIntakeNumber = (latestIntake?.ccbcIntakeNumber as number) || 0;
  const latestIntakeCloseTimestamp = latestIntake?.closeTimestamp;
  const newIntakeNumber = latestIntakeNumber + 1;
  const allIntakesConnectionId = allIntakes?.__id;

  // check if the latest intake opens before the current date
  const isNewIntakeAllowed =
    !latestIntake ||
    DateTime.fromISO(latestIntake?.openTimestamp) < DateTime.now();
  const [createIntake] = useCreateIntakeMutation();
  const [updateIntake] = useUpdateIntakeMutation();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const handleResetForm = () => {
    setIsFormSubmitting(false);
    setIsFormEditMode(false);
    setIsIntakeEdit(false);
    setIsIntakeEdit(false);
    setIsStartDateDisabled(false);
    setFormData({
      intakeNumber: newIntakeNumber,
      zones: [...ALL_INTAKE_ZONES],
      allowUnlistedFnLedZones: false,
    });
  };

  const handleSubmit = (e) => {
    const {
      startDate,
      endDate,
      intakeNumber,
      description,
      rollingIntake,
      inviteOnlyIntake,
      zones,
      allowUnlistedFnLedZones,
    } = e.formData;

    if (isIntakeEdit) {
      updateIntake({
        variables: {
          input: {
            intakeNumber,
            startTime: startDate,
            endTime: endDate,
            intakeDescription: description,
            isRollingIntake: rollingIntake,
            intakeZones: zones,
            isAllowUnlistedFnLedZones: allowUnlistedFnLedZones ?? false,
            hiddenIntakeCode: inviteOnlyIntake ? crypto.randomUUID() : null,
          },
        },
        onCompleted: () => {
          handleResetForm();
        },
      });
    } else {
      createIntake({
        variables: {
          connections: [allIntakesConnectionId],
          input: {
            intakeDescription: description,
            endTime: endDate,
            startTime: startDate,
            rollingIntake,
            zones,
            allowUnlistedFnLedZones: allowUnlistedFnLedZones ?? false,
            hiddenCode: inviteOnlyIntake ? crypto.randomUUID() : null,
          },
        },
        onCompleted: () => {
          handleResetForm();
        },
      });
    }
  };

  const currentDateTime = DateTime.now();
  const intakeStartDate =
    formData?.startDate && DateTime.fromISO(formData.startDate);
  const validate: CustomValidator = (jsonData, errors) => {
    const { startDate, endDate } = jsonData;
    const startDateTime = DateTime.fromISO(startDate);
    const endDateTime = DateTime.fromISO(endDate);

    const latestIntakeEndDateTime = DateTime.fromISO(
      latestIntakeCloseTimestamp
    );

    const isEdit = isIntakeEdit || jsonData?.isEdit;

    // get the index of the current intake when editing an intake
    const intakeIndex = intakeList.findIndex(
      (intake) => intake.node.ccbcIntakeNumber === jsonData?.intakeNumber
    );

    // get the previous intake to check for date overlap when editing
    const previousIntake = isEdit && intakeList[intakeIndex + 1]?.node;
    const previousIntakeEndDateTime =
      previousIntake && DateTime.fromISO(previousIntake.closeTimestamp);

    // get the next intake to check for date overlap when editing
    const nextIntake =
      isEdit && intakeIndex !== 0 && intakeList[intakeIndex - 1]?.node;
    const nextIntakeStartDateTime =
      nextIntake && DateTime.fromISO(nextIntake?.openTimestamp);

    if (!startDate && isFormSubmitting) {
      errors?.startDate.addError('Start date & time must be entered');
    }

    if (!endDate && isFormSubmitting) {
      errors?.endDate.addError('End date & time must be entered');
    }

    if ((!jsonData?.zones || jsonData.zones.length === 0) && isFormSubmitting) {
      errors?.zones.addError('At least one zone must be selected');
    }

    if (isEdit && nextIntake && endDateTime >= nextIntakeStartDateTime) {
      errors?.endDate.addError(
        'End date & time must not overlap with the next intake'
      );
    }

    if (
      (!isEdit && startDateTime <= currentDateTime) ||
      // only check start date is in the future if editing an intake that has not started yet and does not have start date locked
      (isEdit &&
        currentDateTime <= intakeStartDate &&
        startDateTime <= currentDateTime)
    ) {
      errors?.startDate.addError(
        'Start date & time must be after current date & time'
      );
    } else if (
      // check latest intake start date overlap if creating a new intake
      (startDateTime <= latestIntakeEndDateTime && !isEdit) ||
      // check previous intake end date overlap if editing an intake
      (isEdit && startDateTime <= previousIntakeEndDateTime)
    ) {
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
            onClick={() => {
              setIsFormEditMode(true);
              setFormData({
                intakeNumber: newIntakeNumber,
                zones: [...ALL_INTAKE_ZONES],
                allowUnlistedFnLedZones: false,
              });
            }}
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
            liveValidate={isFormEditMode || isIntakeEdit}
            schema={intakeSchema}
            uiSchema={{
              ...intakeUiSchema,
              startDate: {
                ...intakeUiSchema.startDate,
                // disable start date when editing an intake if the start date is before the current date
                'ui:disabled': isStartDateDisabled,
              },
            }}
            onSubmit={handleSubmit}
            transformErrors={customTransformErrors}
            theme={IntakeTheme}
            customValidate={validate}
          >
            <StyledSaveBtn
              type="submit"
              onClick={() => {
                setIsFormSubmitting(true);
              }}
            >
              Save
            </StyledSaveBtn>
            <Button onClick={handleResetForm} variant="secondary">
              Cancel
            </Button>
          </FormBase>
        </StyledForm>
      </StyledContainer>
    </section>
  );
};

export default AddIntake;
