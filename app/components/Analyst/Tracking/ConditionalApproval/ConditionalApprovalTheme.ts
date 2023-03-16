import { ThemeProps } from '@rjsf/core';
import TrackingTheme from '../TrackingTheme';
import ConditionalApprovalObjectFieldTemplate from './ConditionalApprovalObjectFieldTemplate';

const ConditionalApprovalReadOnlyTheme: ThemeProps = {
  ...TrackingTheme,
  ObjectFieldTemplate: ConditionalApprovalObjectFieldTemplate,
};

export default ConditionalApprovalReadOnlyTheme;
