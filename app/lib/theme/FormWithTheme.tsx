import { ThemeProps, utils } from '@rjsf/core';
import FieldTemplate from './FieldTemplate';
import TextWidget from './widgets/TextWidget';
import TextAreaWidget from './widgets/TextareaWidget';
import RadioWidget from './widgets/RadioWidget';

const { fields, widgets } = utils.getDefaultRegistry();

const formTheme: ThemeProps = {
  children: <></>,
  fields: { ...fields },
  widgets: {
    ...widgets,
    TextWidget: TextWidget,
    TextAreaWidget: TextAreaWidget,
    // RadioWidget: RadioWidget,
  },
  FieldTemplate: FieldTemplate,
};

export default formTheme;
