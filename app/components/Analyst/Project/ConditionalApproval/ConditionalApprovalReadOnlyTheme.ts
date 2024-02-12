import { ThemeProps } from '@rjsf/core';
import {
  HiddenWidget,
  ReadOnlyDecisionWidget,
  ReadOnlyFileWidget,
  ReadOnlyResponseWidget,
  ReadOnlyStatusWidget,
  ReadOnlyWidget,
  ReadOnlyRequestedMoneyWidget,
} from './widgets';
import ProjectTheme from '../ProjectTheme';
import ConditionalApprovalObjectFieldTemplate from './ConditionalApprovalObjectFieldTemplate';

const ConditionalApprovalReadOnlyTheme: ThemeProps = {
  ...ProjectTheme,
  widgets: {
    CheckboxWidget: ReadOnlyWidget,
    CheckboxesWidget: ReadOnlyWidget,
    DatePickerWidget: ReadOnlyWidget,
    FileWidget: ReadOnlyFileWidget,
    HiddenWidget,
    SelectWidget: ReadOnlyWidget,
    ReadOnlyDecisionWidget,
    ReadOnlyResponseWidget,
    ReadOnlyStatusWidget,
    ReadOnlyRequestedMoneyWidget,
  },
  templates: { ObjectFieldTemplate: ConditionalApprovalObjectFieldTemplate },
};

export default ConditionalApprovalReadOnlyTheme;
