import FormTestRenderer from '../../utils/formTestRenderer';
import { render, screen } from '@testing-library/react';
import type { JSONSchema7 } from 'json-schema';

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

const uiSchema = {
  submissionDate: {
    'ui:widget': 'ReadOnlySubmissionWidget',
  },
};

const renderStaticLayout = (
  schema: JSONSchema7,
  uiSchema: JSONSchema7,
  formData
) => {
  return render(
    <FormTestRenderer
      formData={formData}
      onSubmit={() => console.log('test')}
      schema={schema as JSONSchema7}
      uiSchema={uiSchema}
    />
  );
};

describe('The ReadOnlySubmissionWidget', () => {
  it('should render the title', () => {
    renderStaticLayout(schema as JSONSchema7, uiSchema as JSONSchema7, {});

    expect(screen.getByText('On this date (YYYY-MM-DD)')).toBeInTheDocument();
  });

  it('should render the value', () => {
    renderStaticLayout(schema as JSONSchema7, uiSchema as JSONSchema7, {
      submissionDate: '2022-09-22',
    });

    expect(screen.getByText('2022-09-22')).toBeInTheDocument();
  });
});
