import { ThemeProps, utils } from '@rjsf/core';
import ArrayFieldTemplate from 'lib/theme/fields/ArrayFieldTemplate';
import {
  CheckboxWidget,
  CheckboxesWidget,
  DatePickerWidget,
  FileWidget,
} from 'lib/theme/widgets';
import FieldTemplate from 'lib/theme/FieldTemplate';
import DefaultWidget, { HiddenWidget } from './DefaultWidget';
import RFiFieldTemplate from './FieldTemplate';
import ObjectFieldTemplate from './ObjectFieldTemplate';
import ListFilesWidget from './ListFilesWidget';

const { fields, widgets: defaultWidgets } = utils.getDefaultRegistry();

const RfiTheme: ThemeProps = {
  fields: {
    ...fields,
  },
  widgets: {
    ...defaultWidgets,
    CheckboxWidget,
    CheckboxesWidget,
    DatePickerWidget,
    FileWidget,
  },
  ObjectFieldTemplate,
  FieldTemplate,
  ArrayFieldTemplate,
};

export const RfiViewTheme: ThemeProps = {
  ...RfiTheme,
  widgets: {
    ...RfiTheme.widgets,
    CheckboxesWidget: DefaultWidget,
    DatePickerWidget: DefaultWidget,
    CheckboxWidget: HiddenWidget,
    ListFilesWidget,
  },
  FieldTemplate: RFiFieldTemplate,
};

export default RfiTheme;
