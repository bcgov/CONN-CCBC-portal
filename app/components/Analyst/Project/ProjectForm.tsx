import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import { BaseAccordion } from '@button-inc/bcgov-theme/Accordion';
import { FormBase } from 'components/Form';
import type { JSONSchema7 } from 'json-schema';
import CircularProgress from '@mui/material/CircularProgress';
import ProjectTheme from './ProjectTheme';

const ToggleRight = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
  font-size: 2em;
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

interface AnimateFormProps {
  formAnimationHeight: number;
  formAnimationHeightOffset: number;
  isAnimated: boolean;
  isFormExpanded: boolean;
  overflow: string;
  onClick?: () => void;
}

// form animation height is the height of the form when it is expanded.
// The children of the form (eg the ViewAnnouncements or ChangeRequestCard)
// may need a z-index of 1 to prevent visual glitches while expanding/retracting
const StyledAnimateForm = styled.div<AnimateFormProps>`
  padding-left: 4px;
  ${({
    formAnimationHeight,
    formAnimationHeightOffset,
    isAnimated,
    isFormExpanded,
    overflow,
  }) =>
    isAnimated &&
    `
    position: relative;
    z-index: ${isFormExpanded ? 100 : 1};
    overflow: ${overflow};
    max-height: ${
      isFormExpanded
        ? `${formAnimationHeight}px`
        : `${formAnimationHeightOffset}px`
    };
    transition: max-height 0.7s;
  `}
`;

interface Props {
  additionalContext?: any;
  before?: React.ReactNode;
  children?: React.ReactNode;
  formAnimationHeight?: number;
  formAnimationHeightOffset?: number;
  formData: any;
  handleChange: any;
  showEditBtn?: boolean;
  /** The hidden submit button's ref, used to enforce validation on the form
   *  (the red-outline we see on widgets) */
  hiddenSubmitRef?: any;
  isFormEditMode: boolean;
  isFormAnimated?: boolean;
  onSubmit: any;
  resetFormData: any;
  saveBtnText?: string;
  saveBtnDisabled?: boolean;
  schema: JSONSchema7;
  setFormData?: any;
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
  formAnimationHeight = 300,
  formAnimationHeightOffset = 30,
  isFormAnimated,
  isFormEditMode,
  onSubmit,
  resetFormData,
  saveBtnDisabled,
  saveBtnText,
  schema,
  setFormData = () => {},
  setIsFormEditMode,
  theme,
  title,
  uiSchema,
  saveDataTestId = 'save',
  ...rest
}) => {
  // Overflow hidden is needed for animated edit transition though
  // visible is needed for the datepicker so we needed to set it on a
  // timeout to prevent buggy visual transition
  const [overflow, setOverflow] = useState(
    isFormEditMode ? 'visible' : 'hidden'
  );
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isFormEditMode && !isFirstRender) {
        setOverflow('visible');
      } else {
        setOverflow('hidden');
      }
      setIsFirstRender(false);
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormEditMode]);

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
                disabled={saveBtnDisabled}
                onClick={onSubmit}
              >
                {saveBtnText || 'Save'}
              </StyledBtn>
              <StyledBtn
                size="small"
                variant="secondary"
                onClick={() => {
                  setFormData();
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
          <BaseAccordion.ToggleOff>
            <FontAwesomeIcon icon={faPlus} fixedWidth />
          </BaseAccordion.ToggleOff>
          <BaseAccordion.ToggleOn>
            <FontAwesomeIcon icon={faMinus} fixedWidth />
          </BaseAccordion.ToggleOn>
        </StyledToggleRight>
      </StyledHeader>
      <BaseAccordion.Content>
        <StyledAnimateForm
          formAnimationHeight={formAnimationHeight}
          formAnimationHeightOffset={formAnimationHeightOffset}
          isAnimated={isFormAnimated}
          isFormExpanded={isFormEditMode}
          overflow={overflow}
        >
          {before}
          {saveBtnDisabled ? (
            <LoadingContainer>
              <LoadingItem>
                <CircularProgress color="inherit" />
              </LoadingItem>
              <LoadingItem>
                <p>Importing Statement of Work. Please wait.</p>
              </LoadingItem>
            </LoadingContainer>
          ) : (
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
          )}
        </StyledAnimateForm>
        {children}
      </BaseAccordion.Content>
    </StyledBaseAccordion>
  );
};
export default ProjectForm;
