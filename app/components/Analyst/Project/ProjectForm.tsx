import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import { BaseAccordion } from '@button-inc/bcgov-theme/Accordion';
import { FormBase } from 'components/Form';
import type { JSONSchema7 } from 'json-schema';
import ProjectTheme from './ProjectTheme';

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
    font-size: 16px;
  }

  ${(props) => props.theme.breakpoint.smallUp} {
    h2 {
      font-size: 24px;
    }
  }

  header {
    padding-bottom: 0px;
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
  padding: 8px 16px;
`;

interface Props {
  additionalContext?: any;
  before?: React.ReactNode;
  children?: React.ReactNode;
  formData: any;
  handleChange: any;
  showEditBtn?: boolean;
  hiddenSubmitRef?: any;
  isFormEditMode: boolean;
  onSubmit: any;
  resetFormData: any;
  saveBtnText?: string;
  schema: JSONSchema7;
  setIsFormEditMode: any;
  theme?: any;
  title: string;
  uiSchema?: any;
  saveDataTestId?: string;
}

const ProjectForm: React.FC<Props> = ({
  additionalContext,
  before,
  children,
  formData,
  handleChange,
  hiddenSubmitRef,
  showEditBtn = true,
  isFormEditMode,
  onSubmit,
  resetFormData,
  saveBtnText,
  schema,
  setIsFormEditMode,
  theme,
  title,
  uiSchema,
  saveDataTestId = 'save',
  ...rest
}) => {
  return (
    <StyledBaseAccordion onToggle={() => {}} {...rest} defaultToggled>
      <StyledHeader>
        <h2>{title}</h2>
        <StyledToggleRight>
          {isFormEditMode ? (
            <>
              <StyledBtn
                data-testid={saveDataTestId}
                size="small"
                onClick={onSubmit}
              >
                {saveBtnText || 'Save'}
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
            <>
              {showEditBtn && (
                <StyledIconBtn
                  onClick={() => setIsFormEditMode(true)}
                  data-testid="project-form-edit-button"
                >
                  <FontAwesomeIcon icon={faPen} size="xs" />
                </StyledIconBtn>
              )}
            </>
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
        <div className="project-form">
          {before}
          <FormBase
            // setting a key here will reset the form
            key={isFormEditMode ? 'edit' : 'view'}
            schema={schema}
            uiSchema={uiSchema}
            formData={formData}
            formContext={{ formData: { ...formData }, ...additionalContext }}
            theme={theme || ProjectTheme}
            omitExtraData={false}
            onChange={handleChange}
          >
            {hiddenSubmitRef ? (
              <button
                type="submit"
                ref={hiddenSubmitRef}
                style={{ display: 'none' }}
              >
                Submit
              </button>
            ) : (
              true
            )}
          </FormBase>
        </div>
        {children}
      </BaseAccordion.Content>
    </StyledBaseAccordion>
  );
};
export default ProjectForm;
