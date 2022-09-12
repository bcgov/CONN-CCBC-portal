import { ThemeProps, utils } from '@rjsf/core';
import ReviewArrayField from './fields/ReviewArrayField';
import ReviewBooleanField from './fields/ReviewBooleanField';
import ReviewObjectField from './fields/ReviewObjectField';
import ReviewStringField from './fields/ReviewStringField';
import SchemaField from './fields/ReviewSchemaField';
import ReviewObjectFieldTemplate from './ReviewObjectFieldTemplate';
import ReviewSectionField from './ReviewSectionField';

const { widgets, fields } = utils.getDefaultRegistry();

const ReadOnlyTheme: ThemeProps = {
  fields: {
    ReviewSectionField: ReviewSectionField,
    StringField: ReviewStringField,
    NumberField: ReviewStringField,
    BooleanField: ReviewBooleanField,
    ArrayField: ReviewArrayField,
    SchemaField: SchemaField,
    // ObjectField: ReviewObjectField,
    // DefaultObjectField: fields.ObjectField,
    HiddenField: () => null,
  },
  widgets: {
    ...widgets,
  },
  ObjectFieldTemplate: ReviewObjectFieldTemplate,
  FieldTemplate: (props) => props.children,
};

export default ReadOnlyTheme;
