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

const { fields, widgets } = utils.getDefaultRegistry();

const formTheme: ThemeProps = {
  fields: {
    ...fields,
    DescriptionField: DescriptionField,
  },
  widgets: {
    ...widgets,
    CheckboxesWidget: CheckboxesWidget,
    CheckboxWidget: CheckboxWidget,
    DatePickerWidget: DatePickerWidget,
    FileWidget: FileWidget,
    RadioWidget: RadioWidget,
    SelectWidget: SelectWidget,
    TextWidget: TextWidget,
    TextAreaWidget: TextAreaWidget,
  },
  ObjectFieldTemplate: ObjectFieldTemplate,
  ArrayFieldTemplate: ArrayFieldTemplate,
  FieldTemplate: FieldTemplate,
};

export default formTheme;
