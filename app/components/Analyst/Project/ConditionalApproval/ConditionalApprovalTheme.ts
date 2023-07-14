import { ThemeProps } from '@rjsf/core';
import ProjectTheme from '../ProjectTheme';
import ConditionalApprovalObjectFieldTemplate from './ConditionalApprovalObjectFieldTemplate';

const ConditionalApprovalReadOnlyTheme: ThemeProps = {
  ...ProjectTheme,
  templates: {
    ...ProjectTheme.templates,
    ObjectFieldTemplate: ConditionalApprovalObjectFieldTemplate,
  },
};

export default ConditionalApprovalReadOnlyTheme;
