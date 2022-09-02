import { NumberWidget } from '../../../lib/theme/widgets';

const contactInformation = {
  contactEmail: {
    'ui:options': {
      inputType: 'email',
    },
  },
  contactTelephoneNumber: {
    'ui:widget': NumberWidget,
    'ui:options': {
      inputType: 'phone',
    },
  },
  contactExtension: {
    'ui:widget': NumberWidget,
    'ui:options': {
      maxLength: 9,
      inputType: 'wholeNumber',
    },
  },
};

export default contactInformation;
