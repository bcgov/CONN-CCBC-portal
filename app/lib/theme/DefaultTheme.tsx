import { ThemeProps, getDefaultRegistry } from '@rjsf/core';

import FieldTemplate from './FieldTemplate';
import ObjectFieldTemplate from './ObjectFieldTemplate';
import { ArrayFieldTemplate, SubmissionDescriptionField } from './fields';
import * as widgets from './widgets';
import * as customWidgets from './widgets/custom';

const { fields, widgets: defaultWidgets, templates } = getDefaultRegistry();

const formTheme: ThemeProps = {
  fields: {
    ...fields,
    SubmissionField: SubmissionDescriptionField,
  },
  widgets: {
    ...defaultWidgets,
    ...widgets,
    ...customWidgets,
  },
  templates: {
    ...templates,
    ObjectFieldTemplate,
    ArrayFieldTemplate,
    FieldTemplate,
  },
};

export default formTheme;
