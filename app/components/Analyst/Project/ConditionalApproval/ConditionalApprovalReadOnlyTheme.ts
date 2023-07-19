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
import HiddenWidget from '../ProjectInformation/widgets/HiddenWidget';

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
  },
  ObjectFieldTemplate: ConditionalApprovalObjectFieldTemplate,
};

export default ConditionalApprovalReadOnlyTheme;
