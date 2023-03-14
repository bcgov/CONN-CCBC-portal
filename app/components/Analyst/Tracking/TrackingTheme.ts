import { ThemeProps, utils } from '@rjsf/core';
import ArrayFieldTemplate from 'lib/theme/fields/ArrayFieldTemplate';
import {
  CheckboxWidget,
  CheckboxesWidget,
  DatePickerWidget,
  FileWidget,
  SelectWidget,
} from 'lib/theme/widgets';
import { StatusSelectWidget } from './ConditionalApproval/widgets';
import TrackingFieldTemplate from './fields/TrackingFieldTemplate';
import TrackingObjectFieldTemplate from './fields/TrackingObjectFieldTemplate';
import { TrackingSectionField } from './fields';

const { fields } = utils.getDefaultRegistry();

const TrackingTheme: ThemeProps = {
  fields: {
    ...fields,
    SectionField: TrackingSectionField,
  },
  widgets: {
    CheckboxWidget,
    CheckboxesWidget,
    DatePickerWidget,
    FileWidget,
    SelectWidget,
    StatusSelectWidget,
  },
  ObjectFieldTemplate: TrackingObjectFieldTemplate,
  FieldTemplate: TrackingFieldTemplate,
  ArrayFieldTemplate,
};

export default TrackingTheme;
