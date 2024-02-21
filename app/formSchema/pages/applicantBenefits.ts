import { RJSFSchema } from '@rjsf/utils';
import benefits from './benefits';

const applicantBenefits: Record<string, RJSFSchema> = {
  benefits: {
    ...benefits.benefits,
    required: ['projectBenefits'],
  },
};

export default applicantBenefits;
