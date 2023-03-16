import { ThemeProps } from '@rjsf/core';
import {
  ReadOnlyDecisionWidget,
  ReadOnlyFileWidget,
  ReadOnlyResponseWidget,
  ReadOnlyStatusWidget,
  ReadOnlyWidget,
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
    SelectWidget: ReadOnlyWidget,
    ReadOnlyDecisionWidget,
    ReadOnlyResponseWidget,
    ReadOnlyStatusWidget,
  },
  ObjectFieldTemplate: ConditionalApprovalObjectFieldTemplate,
};

export default ConditionalApprovalReadOnlyTheme;
