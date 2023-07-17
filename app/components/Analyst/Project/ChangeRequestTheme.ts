import { ThemeProps, utils } from '@rjsf/core';
import ArrayFieldTemplate from 'lib/theme/fields/ArrayFieldTemplate';
import * as widgets from 'lib/theme/widgets';
import ReadOnlyWidget from 'components/Analyst/Project/ConditionalApproval/widgets/ReadOnlyWidget';
import SowImportFileWidget from 'components/Analyst/Project/ProjectInformation/widgets/SowImportFileWidget';
import { StatusSelectWidget } from './ConditionalApproval/widgets';
import ProjectObjectFieldTemplate from './fields/ProjectObjectFieldTemplate';
import { ProjectSectionField } from './fields';
import CcbcIdWidget from './widgets/CcbcIdWidget';
import ChangeRequestFieldTemplate from './fields/ChangeRequestFieldTemplate';

const { fields } = utils.getDefaultRegistry();

const ChangeRequestTheme: ThemeProps = {
  fields: {
    ...fields,
    SectionField: ProjectSectionField,
  },
  widgets: {
    ...widgets,
    ReadOnlyWidget,
    SowImportFileWidget,
    StatusSelectWidget,
    CcbcIdWidget,
  },
  ObjectFieldTemplate: ProjectObjectFieldTemplate,
  // ObjectFieldTemplate: ObjectFieldTemplate,
  FieldTemplate: ChangeRequestFieldTemplate,
  // FieldTemplate: FieldTemplate,
  ArrayFieldTemplate,
};

export default ChangeRequestTheme;
