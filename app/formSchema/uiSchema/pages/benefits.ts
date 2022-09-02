import { MAX_TEXTAREA_LENGTH } from '../constants';
import { NumberWidget } from '../../../lib/theme/widgets';
import { ProjectBenefits } from '../../../components/Form/CustomTitles';

const benefits = {
  uiOrder: [
    'projectBenefits',
    'numberOfHouseholds',
    'householdsImpactedIndigenous',
  ],
  projectBenefits: {
    'ui:widget': 'TextAreaWidget',
    'ui:description': 'maximum 3,500 characters',
    'ui:options': {
      maxLength: MAX_TEXTAREA_LENGTH,
      customTitle: ProjectBenefits,
    },
  },
  numberOfHouseholds: {
    'ui:widget': NumberWidget,
    'ui:options': {
      inputType: 'wholeNumber',
    },
  },
  householdsImpactedIndigenous: {
    'ui:widget': NumberWidget,
    'ui:options': {
      inputType: 'wholeNumber',
    },
  },
};

export default benefits;
