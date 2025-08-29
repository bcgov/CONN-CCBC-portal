/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from 'styled-components';
import { FormBase } from 'components/Form';
import CircularProgress from '@mui/material/CircularProgress';
import { RJSFSchema } from '@rjsf/utils';
import Button from '@button-inc/bcgov-theme/Button';
import ProjectTheme from '../Project/ProjectTheme';
import { ProjectFormProps } from '../Project/ProjectFormProps';

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

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 20px auto;
`;

const StyledBtn = styled(Button)`
  @media (min-width: 1024px) {
    position: fixed;
    bottom: 5vh;
    left: 80vw;

    &:nth-child(2) {
      left: 85vw;
    }
  }
  @media (max-width: 1900px) {
    margin: 0 8px;
    padding: 8px 16px;
  }
`;

const CbcForm: React.FC<ProjectFormProps> = ({
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
  return (
    <>
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
      {/* We only show the  readonly form if there are no children */}
      {!children && (
        <div style={{ marginBottom: '0px' }}>
          <FormBase
            // setting a key here will reset the form
            key={isFormEditMode ? 'edit' : 'view'}
            schema={schema}
            uiSchema={uiSchema}
            formData={formData}
            formContext={{
              formData: { ...formData },
              skipUnsavedWarning: !isFormEditMode,
              ...additionalContext,
            }}
            theme={theme || ProjectTheme}
            liveValidate={liveValidate}
            omitExtraData={false}
            onChange={handleChange}
            customValidate={validate}
            tagName="div"
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
          {isFormEditMode && (
            <StyledContainer>
              <StyledBtn
                data-testid={saveDataTestId}
                id={`${title.toLowerCase().split(' ').join('-')}-save-button`}
                size="small"
                disabled={saveBtnDisabled}
                onClick={onSubmit}
              >
                {saveBtnText || 'Save'}
              </StyledBtn>
              <StyledBtn
                size="small"
                variant="secondary"
                disabled={cancelBtnDisabled}
                onClick={() => {
                  resetFormData();
                  setIsFormEditMode(false);
                }}
              >
                Cancel
              </StyledBtn>
            </StyledContainer>
          )}
        </div>
      )}
      {children}
    </>
  );
};
export default CbcForm;
