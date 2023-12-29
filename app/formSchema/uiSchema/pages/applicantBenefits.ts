import { MAX_TEXTAREA_LENGTH } from '../constants';
import { ProjectBenefits } from '../../../components/Form/CustomTitles';

const applicantBenefits = {
  'ui:order': [
    'projectBenefits',
    'numberOfHouseholds',
    'householdsImpactedIndigenous',
  ],
  'ui:title': '',
  projectBenefits: {
    'ui:widget': 'TextAreaWidget',
    'ui:help': 'maximum 3,500 characters',
    'ui:options': {
      maxLength: MAX_TEXTAREA_LENGTH,
      customTitle: ProjectBenefits,
    },
  },
  numberOfHouseholds: {
    'ui:options': {
      decimals: 2,
      // This is to hide the title without presenting any extra text
      customTitle: true,
    },
    'ui:widget': 'HiddenWidget',
    'ui:hidden': true,
  },
  householdsImpactedIndigenous: {
    // This is to hide the title without presenting any extra text
    'ui:options': { customTitle: true },
    'ui:widget': 'HiddenWidget',
    'ui:hidden': true,
  },
};

export default applicantBenefits;
