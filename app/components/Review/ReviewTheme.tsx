import { ThemeProps, getDefaultRegistry } from '@rjsf/core';
import ArrayBooleanField from './fields/ArrayBooleanField';
import ReviewCheckboxField from './fields/ReviewCheckboxField';
import ReviewInlineArrayField from './fields/ReviewInlineArrayField';
import ReviewObjectFieldTemplate from './ReviewObjectFieldTemplate';
import ReviewSectionField from './ReviewSectionField';
import ReviewArrayFieldTemplate from './fields/ReviewArrayFieldTemplate';
import ReviewFieldTemplate from './fields/ReviewFieldTemplate';
import DefaultWidget from './widgets/DefaultWidget';
import MoneyWidget from './widgets/MoneyWidget';
import BooleanWidget from './widgets/BooleanWidget';
import FileWidget from './widgets/FileWidget';
import DateWidget from './widgets/DateWidget';
import LinkArrayWidget from './widgets/LinkArrayWidget';
import MapWidget from './widgets/MapWidget';

const { templates } = getDefaultRegistry();

const ReviewTheme: ThemeProps = {
  fields: {
    SectionField: ReviewSectionField,
    InlineArrayField: ReviewInlineArrayField,
    ArrayBooleanField,
    ReviewCheckboxField,
  },
  widgets: {
    TextAreaWidget: DefaultWidget,
    DatePickerWidget: DefaultWidget,
    CheckboxesWidget: DefaultWidget,
    CheckboxWidget: DefaultWidget,
    FileWidget,
    RadioWidget: BooleanWidget,
    SelectWidget: DefaultWidget,
    TextWidget: DefaultWidget,
    MoneyWidget,
    ReadOnlyMoneyWidget: MoneyWidget,
    NumberWidget: DefaultWidget,
    NumericStringWidget: DefaultWidget,
    ReadOnlyWidget: DefaultWidget,
    ReadOnlyProjectAreaWidget: DefaultWidget,
    DateWidget,
    LinkArrayWidget,
    MapWidget,
  },
  templates: {
    ...templates,
    ObjectFieldTemplate: ReviewObjectFieldTemplate,
    FieldTemplate: ReviewFieldTemplate,
    ArrayFieldTemplate: ReviewArrayFieldTemplate,
  },
};

export default ReviewTheme;
