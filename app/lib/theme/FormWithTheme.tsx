import { ThemeProps, utils } from '@rjsf/core';
import FieldTemplate from './FieldTemplate';
import ObjectFieldTemplate from './ObjectFieldTemplate';
import {
  TextWidget,
  TextAreaWidget,
  RadioWidget,
  DatePickerWidget,
} from './widgets';

const { fields, widgets } = utils.getDefaultRegistry();

const formTheme: ThemeProps = {
  fields: { ...fields },
  widgets: {
    ...widgets,
    TextWidget: TextWidget,
    TextAreaWidget: TextAreaWidget,
    RadioWidget: RadioWidget,
    DatePickerWidget: DatePickerWidget,
  },
  ObjectFieldTemplate: ObjectFieldTemplate,
  FieldTemplate: FieldTemplate,
};

export default formTheme;
