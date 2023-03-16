import { ThemeProps } from '@rjsf/core';
import ProjectTheme from '../ProjectTheme';
import ConditionalApprovalObjectFieldTemplate from './ConditionalApprovalObjectFieldTemplate';

const ConditionalApprovalReadOnlyTheme: ThemeProps = {
  ...ProjectTheme,
  ObjectFieldTemplate: ConditionalApprovalObjectFieldTemplate,
};

export default ConditionalApprovalReadOnlyTheme;
