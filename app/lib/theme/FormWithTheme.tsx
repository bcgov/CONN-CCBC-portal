import { ThemeProps, utils } from '@rjsf/core';
import FieldTemplate from './FieldTemplate';
import ObjectFieldTemplate from './ObjectFieldTemplate';
import {
  CheckboxesWidget,
  DatePickerWidget,
  RadioWidget,
  TextAreaWidget,
  TextWidget,
  SelectWidget,
} from './widgets';

const { fields, widgets } = utils.getDefaultRegistry();

const formTheme: ThemeProps = {
  fields: { ...fields },
  widgets: {
    ...widgets,
    CheckboxesWidget: CheckboxesWidget,
    TextWidget: TextWidget,
    TextAreaWidget: TextAreaWidget,
    RadioWidget: RadioWidget,
    DatePickerWidget: DatePickerWidget,
    SelectWidget: SelectWidget,
  },
  ObjectFieldTemplate: ObjectFieldTemplate,
  FieldTemplate: FieldTemplate,
};

export default formTheme;
