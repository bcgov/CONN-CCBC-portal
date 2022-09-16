import { ThemeProps, utils } from '@rjsf/core';
import FieldTemplate from './FieldTemplate';
import ObjectFieldTemplate from './ObjectFieldTemplate';
import { ArrayFieldTemplate, DescriptionField } from './fields';
import {
  CheckboxesWidget,
  CheckboxWidget,
  DatePickerWidget,
  FileWidget,
  RadioWidget,
  TextAreaWidget,
  TextWidget,
  SelectWidget,
} from './widgets';
import {
  ReadOnlySubmissionWidget,
  SubmissionCompletedForWidget,
} from './widgets/custom';
import { ReviewField } from 'components/Review';

const { fields, widgets } = utils.getDefaultRegistry();

const formTheme: ThemeProps = {
  fields: {
    ...fields,
    DescriptionField: DescriptionField,
    ReviewField: ReviewField,
  },
  widgets: {
    ...widgets,
    CheckboxesWidget: CheckboxesWidget,
    CheckboxWidget: CheckboxWidget,
    DatePickerWidget: DatePickerWidget,
    FileWidget: FileWidget,
    RadioWidget: RadioWidget,
    ReadOnlySubmissionWidget: ReadOnlySubmissionWidget,
    SelectWidget: SelectWidget,
    SubmissionCompletedForWidget: SubmissionCompletedForWidget,
    TextWidget: TextWidget,
    TextAreaWidget: TextAreaWidget,
  },
  ObjectFieldTemplate: ObjectFieldTemplate,
  ArrayFieldTemplate: ArrayFieldTemplate,
  FieldTemplate: FieldTemplate,
};

export default formTheme;
