import { ThemeProps, utils } from '@rjsf/core';
import FieldTemplate from './FieldTemplate';
import ObjectFieldTemplate from './ObjectFieldTemplate';
import { ArrayFieldTemplate, SubmissionDescriptionField } from './fields';
import * as widgets from './widgets';
import * as customWidgets from './widgets/custom';
import ReviewField from 'components/Review/ReviewPageField';

const { fields, widgets: defaultWidgets } = utils.getDefaultRegistry();

const formTheme: ThemeProps = {
  fields: {
    ...fields,
    ReviewField: ReviewField,
    SubmissionField: SubmissionDescriptionField,
  },
  widgets: {
    ...defaultWidgets,
    ...widgets,
    ...customWidgets,
  },
  ObjectFieldTemplate: ObjectFieldTemplate,
  ArrayFieldTemplate: ArrayFieldTemplate,
  FieldTemplate: FieldTemplate,
};

export default formTheme;
