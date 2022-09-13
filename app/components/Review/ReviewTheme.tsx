import { ThemeProps } from '@rjsf/core';
import ReviewInlineArrayField from './fields/ReviewInlineArrayField';
import ReviewObjectFieldTemplate from './ReviewObjectFieldTemplate';
import ReviewSectionField from './ReviewSectionField';
import ReviewArrayFieldTemplate from './fields/ReviewArrayFieldTemplate';
import ReviewFieldTemplate from './fields/ReviewFieldTemplate';
import DefaultWidget from './widgets/DefaultWidget';
import MoneyWidget from './widgets/MoneyWidget';
import BooleanWidget from './widgets/BooleanWidget';
import FileWidget from './widgets/FileWidget';

const ReadOnlyTheme: ThemeProps = {
  fields: {
    SectionField: ReviewSectionField,
    InlineArrayField: ReviewInlineArrayField,
  },
  widgets: {
    TextAreaWidget: DefaultWidget,
    DatePickerWidget: DefaultWidget,
    CheckboxesWidget: DefaultWidget,
    CheckboxWidget: DefaultWidget,
    FileWidget: FileWidget,
    RadioWidget: BooleanWidget,
    SelectWidget: DefaultWidget,
    TextWidget: DefaultWidget,
    MoneyWidget: MoneyWidget,
    ReadOnlyMoneyWidget: MoneyWidget,
    NumberWidget: DefaultWidget,
    ReadOnlyWidget: DefaultWidget,
  },
  ObjectFieldTemplate: ReviewObjectFieldTemplate,
  FieldTemplate: ReviewFieldTemplate,
  ArrayFieldTemplate: ReviewArrayFieldTemplate,
};

export default ReadOnlyTheme;
