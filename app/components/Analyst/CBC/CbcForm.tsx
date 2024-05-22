/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from 'styled-components';
import { FormBase } from 'components/Form';
import CircularProgress from '@mui/material/CircularProgress';
import { RJSFSchema } from '@rjsf/utils';
import Button from '@button-inc/bcgov-theme/Button';
import ProjectTheme from '../Project/ProjectTheme';

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
  margin: 0 8px;
  padding: 8px 16px;
`;

interface Props {
  additionalContext?: any;
  before?: React.ReactNode;
  children?: React.ReactNode;
  formAnimationHeight?: number;
  formAnimationHeightOffset?: number;
  formData: any;
  formHeader?: string | React.ReactNode | JSX.Element;
  handleChange: any;
  showEditBtn?: boolean;
  /** The hidden submit button's ref, used to enforce validation on the form
   *  (the red-outline we see on widgets) */
  hiddenSubmitRef?: any;
  isExpanded?: boolean;
  isFormEditMode: boolean;
  isFormAnimated?: boolean;
  liveValidate?: boolean;
  onSubmit: any;
  resetFormData: any;
  saveBtnText?: string;
  saveBtnDisabled?: boolean;
  cancelBtnDisabled?: boolean;
  schema: RJSFSchema;
  setFormData?: any;
  setIsFormEditMode: any;
  submitting?: boolean;
  submittingText?: string;
  theme?: any;
  title: string;
  uiSchema?: any;
  saveDataTestId?: string;
  validate?: any;
}

const CbcForm: React.FC<Props> = ({
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
