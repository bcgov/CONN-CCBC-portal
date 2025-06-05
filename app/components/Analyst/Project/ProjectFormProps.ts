import { RJSFSchema } from '@rjsf/utils';

export interface ProjectFormProps {
  additionalContext?: any;
  before?: React.ReactNode;
  children?: React.ReactNode;
  clearFormDataOnEdit?: boolean;
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
  onCancelFormData?: any;
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
