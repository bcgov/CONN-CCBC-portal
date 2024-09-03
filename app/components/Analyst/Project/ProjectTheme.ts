import { ThemeProps, getDefaultRegistry } from '@rjsf/core';
import ArrayFieldTemplate from 'lib/theme/fields/ArrayFieldTemplate';
import * as widgets from 'lib/theme/widgets';
import ReadOnlyWidget from 'components/Analyst/Project/ConditionalApproval/widgets/ReadOnlyWidget';
import ExcelImportFileWidget from 'components/Analyst/Project/ProjectInformation/widgets/ExcelImportFileWidget';
import CommunitySourceWidget from 'lib/theme/widgets/custom/CommunitySourceWidget';
import { StatusSelectWidget } from './ConditionalApproval/widgets';
import ProjectFieldTemplate from './fields/ProjectFieldTemplate';
import ProjectObjectFieldTemplate from './fields/ProjectObjectFieldTemplate';
import { ProjectSectionField } from './fields';
import {
  AmendmentNumberWidget,
  CcbcIdWidget,
  ContextErrorWidget,
  HiddenWidget,
} from './widgets';

const { fields, templates } = getDefaultRegistry();

const ProjectTheme: ThemeProps = {
  fields: {
    ...fields,
    SectionField: ProjectSectionField,
  },
  widgets: {
    ...widgets,
    AmendmentNumberWidget,
    ReadOnlyWidget,
    ExcelImportFileWidget,
    StatusSelectWidget,
    CcbcIdWidget,
    HiddenWidget,
    ContextErrorWidget,
    CommunitySourceWidget,
  },
  templates: {
    ...templates,
    ObjectFieldTemplate: ProjectObjectFieldTemplate,
    FieldTemplate: ProjectFieldTemplate,
    ArrayFieldTemplate,
  },
};

export default ProjectTheme;
