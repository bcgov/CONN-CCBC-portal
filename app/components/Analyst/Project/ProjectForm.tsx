import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import Accordion from 'components/Accordion';
import { FormBase } from 'components/Form';
import CircularProgress from '@mui/material/CircularProgress';
import { Collapse } from '@mui/material';
import { FormBaseRef } from 'components/Form/FormBase';
import { useRef } from 'react';
import ProjectTheme from './ProjectTheme';
import { ProjectFormProps } from './ProjectFormProps';

const ToggleRight = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
  font-size: 2em;
  cursor: default;
`;

const LoadingContainer = styled.div`
  display: block;
  margin-right: 200px;
  margin-left: 200px;
  & > * {
    margin-bottom: 16px;
  }
`;

const LoadingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledIconBtn = styled.button`
  border-radius: 0;
  appearance: none;
  margin-right: 8px;
  font-size: 28px;

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

const ProjectForm: React.FC<ProjectFormProps> = ({
  additionalContext,
  before,
  children,
  formData,
  formHeader,
  handleChange,
  hiddenSubmitRef,
  showEditBtn = true,
  isExpanded = false,
  isFormAnimated,
  isFormEditMode,
  liveValidate,
  onSubmit,
  resetFormData,
  saveBtnDisabled,
  cancelBtnDisabled,
  saveBtnText,
  schema,
  setFormData = () => {},
  setIsFormEditMode,
  submitting = false,
  submittingText,
  theme,
  title,
  uiSchema,
  validate,
  saveDataTestId = 'save',
  ...rest
}) => {
  const stopPropagation = (e) => e.stopPropagation();
  const formRef = useRef<FormBaseRef>(null);

  return (
    <Accordion
      isExpanded={isExpanded}
      headerContent={
        <StyledToggleRight onClick={stopPropagation}>
          {isFormEditMode ? (
            <>
              <StyledBtn
                data-testid={saveDataTestId}
                id={`${title.toLowerCase().split(' ').join('-')}-save-button`}
                size="small"
                disabled={saveBtnDisabled}
                onClick={(e) => {
                  onSubmit(e);
                  formRef.current?.resetFormState(e.formData);
                }}
              >
                {saveBtnText || 'Save'}
              </StyledBtn>
              <StyledBtn
                size="small"
                variant="secondary"
                disabled={cancelBtnDisabled}
                onClick={() => {
                  setFormData({});
                  setIsFormEditMode(false);
                  formRef.current?.resetFormState({});
                }}
              >
                Cancel
              </StyledBtn>
            </>
          ) : (
            <>
              {showEditBtn && (
                <StyledIconBtn
                  onClick={() => {
                    setFormData({});
                    setIsFormEditMode(true);
                  }}
                  data-testid="project-form-edit-button"
                >
                  <FontAwesomeIcon icon={faPen} size="xs" />
                </StyledIconBtn>
              )}
            </>
          )}
        </StyledToggleRight>
      }
      title={title}
      {...rest}
    >
      {before}
      {submitting && (
        <LoadingContainer>
          <LoadingItem>
            <CircularProgress color="inherit" />
          </LoadingItem>
          <LoadingItem>
            <p>{`${submittingText}`}</p>
          </LoadingItem>
        </LoadingContainer>
      )}
      <Collapse
        unmountOnExit
        mountOnEnter={false}
        timeout={isFormAnimated ? 'auto' : 0}
        in={isFormEditMode}
      >
        {formHeader}
        <FormBase
          // setting a key here will reset the form
          ref={formRef}
          key={isFormEditMode ? 'edit' : 'view'}
          schema={schema}
          uiSchema={uiSchema}
          formData={formData}
          formContext={{
            formData: { ...formData },
            ...additionalContext,
          }}
          theme={theme || ProjectTheme}
          liveValidate={liveValidate}
          omitExtraData={false}
          onChange={handleChange}
          customValidate={validate}
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
      </Collapse>
      {/* We only show the  readonly form if there are no children */}
      {!children && (
        <Collapse
          unmountOnExit
          mountOnEnter={false}
          in={!isFormEditMode}
          timeout={isFormAnimated ? 'auto' : 0}
        >
          <FormBase
            // setting a key here will reset the form
            key={isFormEditMode ? 'edit' : 'view'}
            schema={schema}
            uiSchema={uiSchema}
            formData={formData}
            formContext={{
              formData: { ...formData },
              ...additionalContext,
            }}
            theme={theme || ProjectTheme}
            liveValidate={liveValidate}
            omitExtraData={false}
            onChange={handleChange}
            customValidate={validate}
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
        </Collapse>
      )}
      {children}
    </Accordion>
  );
};
export default ProjectForm;
