import {
  MAX_TEXTAREA_LENGTH,
  MAX_LONG_INPUT_LENGTH,
  MAX_MED_INPUT_LENGTH,
} from '../constants';
import { IndigenousEntity } from '../../../components/Form/CustomTitles';
import { NumberWidget } from '../../../lib/theme/widgets';

const organizationProfile = {
  typeOfOrganization: {
    'ui:widget': 'RadioWidget',
  },
  organizationName: {
    'ui:options': {
      maxLength: MAX_LONG_INPUT_LENGTH,
    },
  },
  businessNumber: {
    'ui:widget': NumberWidget,
    'ui:options': {
      maxLength: 9,
      inputType: 'wholeNumber',
    },
  },
  isLegalPrimaryName: {
    'ui:widget': 'RadioWidget',
  },
  isNameLegalName: {
    'ui:widget': 'RadioWidget',
  },
  isSubsidiary: {
    'ui:widget': 'RadioWidget',
  },
  isIndigenousEntity: {
    'ui:widget': 'RadioWidget',
    'ui:options': {
      customTitle: IndigenousEntity,
    },
  },
  indigenousEntityDesc: {
    'ui:options': {
      maxLength: MAX_MED_INPUT_LENGTH,
    },
  },
  organizationOverview: {
    'ui:widget': 'TextAreaWidget',
    'ui:options': {
      maxLength: MAX_TEXTAREA_LENGTH,
    },
  },
  orgRegistrationDate: {
    'ui:widget': 'DatePickerWidget',
  },
};

export default organizationProfile;
