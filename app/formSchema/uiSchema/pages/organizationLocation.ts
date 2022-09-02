import {
  MAX_SHORT_INPUT_LENGTH,
  MIN_INPUT_LENGTH,
  MAX_LENGTH_POSTAL_CODE,
} from '../constants';

const organizationLocation = {
  isMailingAddress: {
    'ui:widget': 'RadioWidget',
  },
  unitNumber: {
    'ui:options': {
      maxLength: MAX_SHORT_INPUT_LENGTH,
    },
  },
  streetNumber: {
    'ui:options': {
      maxLength: MAX_SHORT_INPUT_LENGTH,
      minLength: MIN_INPUT_LENGTH,
    },
  },
  province: {
    'ui:widget': 'SelectWidget',
  },
  postalCode: {
    'ui:options': {
      maxLength: MAX_LENGTH_POSTAL_CODE,
    },
  },
  POBox: {
    'ui:options': {
      maxLength: MAX_SHORT_INPUT_LENGTH,
    },
  },
};

export default organizationLocation;
