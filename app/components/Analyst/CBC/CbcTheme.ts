import { ThemeProps, getDefaultRegistry } from '@rjsf/core';
import {
  CheckboxWidget,
  CheckboxesWidget,
  MoneyWidget,
  NumberWidget,
  NumericStringWidget,
  RadioWidget,
  SelectWidget,
  TextAreaWidget,
  TextWidget,
  DatePickerWidget,
  LinkArrayWidget,
} from 'lib/theme/widgets';
import ArrayLocationFieldTemplate from 'lib/theme/fields/ArrayLocationDataField';
import CommunitySourceWidget from 'lib/theme/widgets/custom/CommunitySourceWidget';
import ArrayBooleanField from '../../Review/fields/ArrayBooleanField';
import ReviewCheckboxField from '../../Review/fields/ReviewCheckboxField';
import ReviewInlineArrayField from '../../Review/fields/ReviewInlineArrayField';
import ReviewObjectFieldTemplate from '../../Review/ReviewObjectFieldTemplate';
import ReviewSectionField from '../../Review/ReviewSectionField';
import ReviewFieldTemplate from '../../Review/fields/ReviewFieldTemplate';
import DefaultWidget from '../../Review/widgets/DefaultWidget';
import BooleanWidget from '../../Review/widgets/BooleanWidget';
import FileWidget from '../../Review/widgets/FileWidget';

const { templates } = getDefaultRegistry();

const CbcTheme: ThemeProps = {
  fields: {
    SectionField: ReviewSectionField,
    InlineArrayField: ReviewInlineArrayField,
    ArrayBooleanField,
    ReviewCheckboxField,
  },
  widgets: {
    TextAreaWidget,
    DatePickerWidget,
    CheckboxesWidget,
    CheckboxWidget,
    FileWidget,
    RadioWidget,
    SelectWidget,
    TextWidget,
    MoneyWidget,
    BooleanWidget,
    DefaultWidget,
    ReadOnlyMoneyWidget: DefaultWidget,
    NumberWidget,
    NumericStringWidget,
    ReadOnlyWidget: DefaultWidget,
    CommunitySourceWidget,
    LinkArrayWidget,
  },
  templates: {
    ...templates,
    ObjectFieldTemplate: ReviewObjectFieldTemplate,
    FieldTemplate: ReviewFieldTemplate,
    ArrayFieldTemplate: ArrayLocationFieldTemplate,
  },
};

export default CbcTheme;
