import FormTestRenderer from '../../utils/formTestRenderer';
import { render, screen } from '@testing-library/react';
import type { JSONSchema7 } from 'json-schema';

const schema = {
  title: 'Read only submission widget test',
  type: 'object',
  required: ['submissionCompletedFor'],
  properties: {
    submissionCompletedFor: {
      title: 'Completed for (Legal organization name)',
      type: 'string',
    },
  },
};

const uiSchema = {
  submissionCompletedFor: {
    'ui:widget': 'SubmissionCompletedForWidget',
  },
};

const mockRouterState = {
  route: '/',
  pathname: '',
  query: { id: 1 },
  asPath: '',
  push: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
  },
  beforePopState: jest.fn(() => null),
  prefetch: jest.fn(() => null),
};

jest.mock('next/router', () => ({
  useRouter() {
    return mockRouterState;
  },
}));

const renderStaticLayout = (schema: JSONSchema7, uiSchema: any, formData) => {
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
  beforeEach(() => {
    // Mock query params since we use them to generate url in component

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const useRouter = jest.spyOn(require('next/router'), 'useRouter');
    useRouter.mockImplementation(() => mockRouterState);
  });

  it('should render the title', () => {
    renderStaticLayout(schema as JSONSchema7, uiSchema, {});

    expect(
      screen.getByText('Completed for (Legal organization name)')
    ).toBeInTheDocument();
  });

  it('should render the error message when submissionCompletedFor is empty', () => {
    renderStaticLayout(schema as JSONSchema7, uiSchema, {});

    expect(
      screen.getByRole('link', { name: 'Organization Profile' })
    ).toBeInTheDocument();
  });

  it('should not render the error message when submissionCompletedFor is filled', () => {
    renderStaticLayout(schema as JSONSchema7, uiSchema, {
      submissionCompletedFor: 'submissionCompletedFor test',
    });

    expect(screen.queryByRole('link', { name: 'Organization Profile' })).toBe(
      null
    );
  });

  it('should render the value', () => {
    renderStaticLayout(schema as JSONSchema7, uiSchema, {
      submissionCompletedFor: 'submissionCompletedFor test',
    });

    expect(screen.getByText('submissionCompletedFor test')).toBeInTheDocument();
  });
});
