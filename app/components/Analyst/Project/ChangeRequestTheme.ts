import { ThemeProps } from '@rjsf/core';
import ChangeRequestFieldTemplate from './fields/ChangeRequestFieldTemplate';
import ProjectTheme from './ProjectTheme';

const ChangeRequestTheme: ThemeProps = {
  ...ProjectTheme,
  templates: {
    ...ProjectTheme.templates,
    FieldTemplate: ChangeRequestFieldTemplate,
  },
};

export default ChangeRequestTheme;
