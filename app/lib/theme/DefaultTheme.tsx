import { ThemeProps, utils } from '@rjsf/core';
import FieldTemplate from './FieldTemplate';
import ObjectFieldTemplate from './ObjectFieldTemplate';
import { ArrayFieldTemplate, DescriptionField } from './fields';
import * as widgets from './widgets';
import * as customWidgets from './widgets/custom';
import { ReviewField } from 'components/Review';

const { fields, widgets: defaultWidgets } = utils.getDefaultRegistry();

const formTheme: ThemeProps = {
  fields: {
    ...fields,
    DescriptionField: DescriptionField,
    ReviewField: ReviewField,
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
