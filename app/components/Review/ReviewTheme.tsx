import { ThemeProps } from '@rjsf/core';
import ReviewInlineArrayField from './fields/ReviewInlineArrayField';
import ReviewBooleanField from './fields/ReviewBooleanField';
import ReviewStringField from './fields/ReviewStringField';
import SchemaField from './fields/ReviewSchemaField';
import ReviewObjectFieldTemplate from './ReviewObjectFieldTemplate';
import ReviewSectionField from './ReviewSectionField';
import ReviewArrayField from './fields/ReviewArrayField';
import ReviewFilesField from './fields/ReviewFilesField';

const ReadOnlyTheme: ThemeProps = {
  fields: {
    SectionField: ReviewSectionField,
    StringField: ReviewStringField,
    NumberField: ReviewStringField,
    BooleanField: ReviewBooleanField,
    ArrayField: ReviewArrayField,
    InlineArrayField: ReviewInlineArrayField,
    SchemaField: SchemaField,
    FilesField: ReviewFilesField,
    HiddenField: () => null,
  },
  ObjectFieldTemplate: ReviewObjectFieldTemplate,
  FieldTemplate: (props) => props.children,
};

export default ReadOnlyTheme;
