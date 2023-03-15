import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import { BaseAccordion } from '@button-inc/bcgov-theme/Accordion';
import { FormBase } from 'components/Form';
import type { JSONSchema7 } from 'json-schema';
import TrackingTheme from './TrackingTheme';

const ToggleRight = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
  font-size: 2em;
`;

const StyledHeader = styled(BaseAccordion.Header)`
  border-bottom: 1px solid #d6d6d6;
  margin-bottom: 16px;
`;

const StyledBaseAccordion = styled(BaseAccordion)`
  border: none;

  h2 {
    margin-bottom: 0;
    display: flex;
    align-items: center;
    font-size: 24px;
  }

  header {
    padding-bottom: 0px;
  }

  // Some overrides for widget styles
  & div > div {
    margin: 0px;
  }

  .pg-select-wrapper {
    width: 100%;
    min-width: 212px;
    margin: 8px 0 !important;
  }

  .file-widget {
    margin-bottom: 8px;
    min-width: 340px;
  }

  .datepicker-widget {
    width: 100%;
    max-width: 212px;
  }
`;

const StyledIconBtn = styled.button`
  border-radius: 0;
  appearance: none;
  margin-right: 8px;

  & svg {
    color: ${(props) => props.theme.color.links};
  }

  &:hover {
    opacity: 0.7;
  }
`;

const StyledToggleRight = styled(ToggleRight)`
  display: flex;
`;

const StyledBtn = styled(Button)`
  margin: 0 8px;
`;

interface Props {
  formData: any;
  handleChange: any;
  isFormEditMode: boolean;
  onSubmit: any;
  resetFormData: any;
  schema: JSONSchema7;
  setIsFormEditMode: any;
  theme?: any;
  title: string;
  uiSchema?: any;
}

const TrackingForm: React.FC<Props> = ({
  formData,
  handleChange,
  isFormEditMode,
  onSubmit,
  resetFormData,
  schema,
  setIsFormEditMode,
  theme,
  title,
  uiSchema,
  ...rest
}) => {
  return (
    <StyledBaseAccordion onToggle={() => {}} {...rest} defaultToggled>
      <StyledHeader>
        <h2>{title}</h2>
        <StyledToggleRight>
          {isFormEditMode ? (
            <>
              <StyledBtn size="small" onClick={onSubmit}>
                Save
              </StyledBtn>
              <StyledBtn
                size="small"
                variant="secondary"
                onClick={() => {
                  resetFormData();
                  setIsFormEditMode(false);
                }}
              >
                Cancel
              </StyledBtn>
            </>
          ) : (
            <StyledIconBtn onClick={() => setIsFormEditMode(true)}>
              <FontAwesomeIcon icon={faPen} size="xs" />
            </StyledIconBtn>
          )}
          <BaseAccordion.ToggleOff>
            <FontAwesomeIcon icon={faPlus} fixedWidth />
          </BaseAccordion.ToggleOff>
          <BaseAccordion.ToggleOn>
            <FontAwesomeIcon icon={faMinus} fixedWidth />
          </BaseAccordion.ToggleOn>
        </StyledToggleRight>
      </StyledHeader>
      <BaseAccordion.Content>
        <FormBase
          schema={schema}
          uiSchema={uiSchema}
          noValidate
          formData={formData}
          formContext={{ formData: { ...formData } }}
          theme={theme || TrackingTheme}
          omitExtraData={false}
          onChange={handleChange}
          // eslint-disable-next-line react/no-children-prop
          children
        />
      </BaseAccordion.Content>
    </StyledBaseAccordion>
  );
};
export default TrackingForm;
