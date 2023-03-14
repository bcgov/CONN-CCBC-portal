import { ThemeProps } from '@rjsf/core';
import {
  ReadOnlyDecisionWidget,
  ReadOnlyFileWidget,
  ReadOnlyResponseWidget,
  ReadOnlyStatusWidget,
  ReadOnlyWidget,
} from './widgets';
import TrackingTheme from '../TrackingTheme';

const ConditionalApprovalReadOnlyTheme: ThemeProps = {
  ...TrackingTheme,
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
};

export default ConditionalApprovalReadOnlyTheme;
