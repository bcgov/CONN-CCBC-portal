import { JSONSchema7 } from 'json-schema';
import benefits from './benefits';

const applicantBenefits: Record<string, JSONSchema7> = {
  benefits: {
    ...benefits.benefits,
    required: ['projectBenefits'],
  },
};

export default applicantBenefits;
