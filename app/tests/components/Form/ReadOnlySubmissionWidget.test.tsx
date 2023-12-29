import { render, screen } from '@testing-library/react';
import type { JSONSchema7 } from 'json-schema';
import { uiSchema } from 'formSchema';
import FormTestRenderer from '../../utils/formTestRenderer';

const schema = {
  title: 'Read only submission widget test',
  type: 'object',
  required: ['submissionDate'],
  properties: {
    submissionDate: {
      title: 'On this date (YYYY-MM-DD)',
      type: 'string',
    },
  },
};

const ui = {
  'ui:order': ['submissionDate'],
  submissionDate: {
    'ui:widget': 'ReadOnlySubmissionWidget',
  },
};

const renderStaticLayout = (s: JSONSchema7, u: any, formData) => {
  return render(
    <FormTestRenderer
      formData={formData}
      onSubmit={() => console.log('test')}
      schema={s as JSONSchema7}
      uiSchema={u}
      formContext={{ finalUiSchema: uiSchema, formErrorSchema: {} }}
    />
  );
};

describe('The ReadOnlySubmissionWidget', () => {
  it('should render the title', () => {
    renderStaticLayout(schema as JSONSchema7, ui, {});

    expect(screen.getByText('On this date (YYYY-MM-DD)')).toBeInTheDocument();
  });

  it('should render the value', () => {
    renderStaticLayout(schema as JSONSchema7, ui, {
      submissionDate: '2022-09-22',
    });

    expect(screen.getByText('2022-09-22')).toBeInTheDocument();
  });
});
