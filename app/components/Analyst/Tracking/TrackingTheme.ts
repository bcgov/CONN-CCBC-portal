import { ThemeProps, utils } from '@rjsf/core';
import ArrayFieldTemplate from 'lib/theme/fields/ArrayFieldTemplate';
import FieldTemplate from 'lib/theme/FieldTemplate';
import * as widgets from 'lib/theme/widgets';
import TrackingObjectFieldTemplate from './fields/TrackingObjectFieldTemplate';

import { TrackingSectionField } from './fields';

const { fields, widgets: defaultWidgets } = utils.getDefaultRegistry();

const TrackingTheme: ThemeProps = {
  fields: {
    ...fields,
    SectionField: TrackingSectionField,
  },
  widgets: {
    ...defaultWidgets,
    ...widgets,
  },
  ObjectFieldTemplate: TrackingObjectFieldTemplate,
  FieldTemplate,
  ArrayFieldTemplate,
};

export default TrackingTheme;
