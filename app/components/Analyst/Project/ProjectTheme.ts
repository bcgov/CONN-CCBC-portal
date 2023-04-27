import { ThemeProps, utils } from '@rjsf/core';
import ArrayFieldTemplate from 'lib/theme/fields/ArrayFieldTemplate';
import * as widgets from 'lib/theme/widgets';
import { StatusSelectWidget } from './ConditionalApproval/widgets';
import ProjectFieldTemplate from './fields/ProjectFieldTemplate';
import ProjectObjectFieldTemplate from './fields/ProjectObjectFieldTemplate';
import { ProjectSectionField } from './fields';

const { fields } = utils.getDefaultRegistry();

const ProjectTheme: ThemeProps = {
  fields: {
    ...fields,
    SectionField: ProjectSectionField,
  },
  widgets: {
    ...widgets,
    StatusSelectWidget,
  },
  ObjectFieldTemplate: ProjectObjectFieldTemplate,
  FieldTemplate: ProjectFieldTemplate,
  ArrayFieldTemplate,
};

export default ProjectTheme;
