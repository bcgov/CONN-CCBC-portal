import { MAX_TEXTAREA_LENGTH } from '../constants';
import { ProjectBenefits } from '../../../components/Form/CustomTitles';

const benefits = {
  'ui:order': [
    'projectBenefits',
    'numberOfHouseholds',
    'householdsImpactedIndigenous',
  ],
  'ui:title': '',
  projectBenefits: {
    'ui:widget': 'TextAreaWidget',
    'ui:description': 'maximum 3,500 characters',
    'ui:options': {
      maxLength: MAX_TEXTAREA_LENGTH,
      customTitle: ProjectBenefits,
    },
  },
  numberOfHouseholds: {
    'ui:options': {
      decimals: 2,
    },
  },
  householdsImpactedIndigenous: {
    'ui:options': {
      decimals: 2,
    },
  },
};

export default benefits;
