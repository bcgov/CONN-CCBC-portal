import { ThemeProps, utils } from '@rjsf/core';
import ReviewInlineArrayField from './fields/ReviewInlineArrayField';
import ReviewBooleanField from './fields/ReviewBooleanField';
import ReviewObjectField from './fields/ReviewObjectField';
import ReviewStringField from './fields/ReviewStringField';
import SchemaField from './fields/ReviewSchemaField';
import ReviewObjectFieldTemplate from './ReviewObjectFieldTemplate';
import ReviewSectionField from './ReviewSectionField';
import ReviewArrayField from './fields/ReviewArrayField';

const { widgets, fields } = utils.getDefaultRegistry();

const ReadOnlyTheme: ThemeProps = {
  fields: {
    SectionField: ReviewSectionField,
    StringField: ReviewStringField,
    NumberField: ReviewStringField,
    BooleanField: ReviewBooleanField,
    ArrayField: ReviewArrayField,
    InlineArrayField: ReviewInlineArrayField,
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
