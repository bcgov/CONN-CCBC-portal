import { ThemeProps, utils } from '@rjsf/core';
import ReviewField from 'components/Review/ReviewPageField';
import FieldTemplate from './FieldTemplate';
import ObjectFieldTemplate from './ObjectFieldTemplate';
import { ArrayFieldTemplate, SubmissionDescriptionField } from './fields';
import * as widgets from './widgets';
import * as customWidgets from './widgets/custom';

const { fields, widgets: defaultWidgets } = utils.getDefaultRegistry();

const formTheme: ThemeProps = {
  fields: {
    ...fields,
    ReviewField,
    SubmissionField: SubmissionDescriptionField,
  },
  widgets: {
    ...defaultWidgets,
    ...widgets,
    ...customWidgets,
  },
  ObjectFieldTemplate,
  ArrayFieldTemplate,
  FieldTemplate,
};

export default formTheme;
