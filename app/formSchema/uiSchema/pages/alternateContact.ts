import { MAX_CONTACT_INPUT_LENGTH } from '../constants';
import { NumberWidget } from '../../../lib/theme/widgets';

const alternateContact = {
  uiOrder: [
    'altFamilyName',
    'altGivenName',
    'altPositionTitle',
    'altEmail',
    'altTelephone',
    'altExtension',
    'isAltContactSigningOfficer',
  ],
  altFamilyName: {
    'ui:options': {
      maxLength: MAX_CONTACT_INPUT_LENGTH,
      altOptionalText: 'if applicable',
    },
  },
  altGivenName: {
    'ui:options': {
      maxLength: MAX_CONTACT_INPUT_LENGTH,
    },
  },
  altPositionTitle: {
    'ui:options': {
      maxLength: MAX_CONTACT_INPUT_LENGTH,
    },
  },
  altEmail: {
    'ui:options': {
      inputType: 'email',
      maxLength: MAX_CONTACT_INPUT_LENGTH,
    },
  },
  altTelephone: {
    'ui:widget': NumberWidget,
    'ui:options': {
      inputType: 'phone',
    },
  },
  altExtension: {
    'ui:widget': NumberWidget,
    'ui:options': {
      maxLength: 9,
      inputType: 'wholeNumber',
    },
  },
  isAltContactSigningOfficer: {
    'ui:widget': 'RadioWidget',
  },
};

export default alternateContact;
