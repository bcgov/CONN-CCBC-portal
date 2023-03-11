import { ThemeProps, utils } from '@rjsf/core';
import {
  CheckboxWidget,
  CheckboxesWidget,
  DatePickerWidget,
  FileWidget,
  SelectWidget,
} from 'lib/theme/widgets';
import ArrayFieldTemplate from 'lib/theme/fields/ArrayFieldTemplate';
import FieldTemplate from 'lib/theme/FieldTemplate';
import TrackingObjectFieldTemplate from './fields/TrackingObjectFieldTemplate';

import { TrackingSectionField } from './fields';

const { fields } = utils.getDefaultRegistry();

const TrackingTheme: ThemeProps = {
  fields: {
    ...fields,
    SectionField: TrackingSectionField,
  },
  widgets: {
    // ...defaultWidgets,
    CheckboxWidget,
    CheckboxesWidget,
    DatePickerWidget,
    FileWidget,
    SelectWidget,
  },
  ObjectFieldTemplate: TrackingObjectFieldTemplate,
  FieldTemplate,
  ArrayFieldTemplate,
};

export default TrackingTheme;
