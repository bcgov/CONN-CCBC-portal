import { RJSFSchema } from '@rjsf/utils';

const CHECKBOX_TITLE =
  'By checking this box, you acknowledge that there are incomplete fields and incomplete applications may not be assessed. ' +
  'If the incomplete fields are not applicable to you, please check the box and continue to the acknowledgements page.';

const review: Record<string, RJSFSchema> = {
  review: {
    type: 'object',
    title: 'Review',
    properties: {
      acknowledgeIncomplete: {
        type: 'boolean',
        title: CHECKBOX_TITLE,
      },
    },
  },
};

export default review;
