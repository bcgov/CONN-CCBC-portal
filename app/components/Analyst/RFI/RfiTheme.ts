import { ThemeProps, utils } from '@rjsf/core';
import ArrayFieldTemplate from 'lib/theme/fields/ArrayFieldTemplate';
import { CheckboxWidget, FileWidget } from 'lib/theme/widgets';
import DefaultWidget from './DefaultWidget';
import FieldTemplate from './FieldTemplate';
import ObjectFieldTemplate from './ObjectFieldTemplate';

const { fields, widgets: defaultWidgets } = utils.getDefaultRegistry();

const RfiTheme: ThemeProps = {
  fields: {
    ...fields,
  },
  widgets: {
    ...defaultWidgets,
    CheckboxWidget,
    CheckboxesWidget: DefaultWidget,
    DatePickerWidget: DefaultWidget,
    FileWidget,
  },
  ObjectFieldTemplate,
  FieldTemplate,
  ArrayFieldTemplate,
};

export default RfiTheme;
