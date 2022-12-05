import { ThemeProps, utils } from '@rjsf/core';
import ObjectFieldTemplate from 'lib/theme/ObjectFieldTemplate';
import ArrayFieldTemplate from 'lib/theme/fields/ArrayFieldTemplate';
import FileWidget from 'lib/theme/widgets/FileWidget';
import DefaultWidget from './DefaultWidget';
import FieldTemplate from './FieldTemplate';

const { fields, widgets: defaultWidgets } = utils.getDefaultRegistry();

const RfiTheme: ThemeProps = {
  fields: {
    ...fields,
  },
  widgets: {
    ...defaultWidgets,
    CheckboxesWidget: DefaultWidget,
    DatePickerWidget: DefaultWidget,
    FileWidget,
  },
  ObjectFieldTemplate,
  FieldTemplate,
  ArrayFieldTemplate,
};

export default RfiTheme;
