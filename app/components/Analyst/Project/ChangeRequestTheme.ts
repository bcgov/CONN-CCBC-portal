import { ThemeProps } from '@rjsf/core';
import ChangeRequestFieldTemplate from './fields/ChangeRequestFieldTemplate';
import ProjectTheme from './ProjectTheme';

const ChangeRequestTheme: ThemeProps = {
  ...ProjectTheme,
  FieldTemplate: ChangeRequestFieldTemplate,
};

export default ChangeRequestTheme;
