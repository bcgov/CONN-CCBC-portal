import FormTestRenderer from '../../utils/formTestRenderer';
import { render, screen } from '@testing-library/react';
import type { JSONSchema7 } from 'json-schema';

const schema = {
  title: 'Read only submission widget test',
  type: 'object',
  required: ['submissionCompletedFor', 'submissionDate'],
  properties: {
    submissionCompletedFor: {
      title: 'Completed for (Legal organization name)',
      type: 'string',
    },
    submissionDate: {
      title: 'On this date (YYYY-MM-DD)',
      type: 'string',
    },
  },
};

const uiSchema = {
  submissionCompletedFor: {
    'ui:widget': 'ReadOnlySubmissionWidget',
    'ui:options': {
      'field-name': 'submissionCompletedFor',
    },
  },
  submissionDate: {
    'ui:widget': 'ReadOnlySubmissionWidget',
  },
};

jest.mock('next/router', () => ({
  useRouter() {
    return {
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
  },
}));

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
  beforeEach(() => {
    // Mock query params since we use them to generate url in component

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const useRouter = jest.spyOn(require('next/router'), 'useRouter');
    useRouter.mockImplementation(() => ({
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
    }));
  });

  it('should render the titles', () => {
    renderStaticLayout(schema as JSONSchema7, uiSchema as JSONSchema7, {});

    expect(
      screen.getByText('Completed for (Legal organization name)')
    ).toBeInTheDocument();

    expect(screen.getByText('On this date (YYYY-MM-DD)')).toBeInTheDocument();
  });

  it('should render the error message when submissionCompletedFor is empty', () => {
    renderStaticLayout(schema as JSONSchema7, uiSchema as JSONSchema7, {});

    expect(
      screen.getByRole('link', { name: 'Organization Profile' })
    ).toBeInTheDocument();
  });

  it('should not render the error message when submissionCompletedFor is filled', () => {
    renderStaticLayout(schema as JSONSchema7, uiSchema as JSONSchema7, {
      submissionCompletedFor: 'submissionCompletedFor test',
      submissionDate: '2022-09-22',
    });

    expect(screen.queryByRole('link', { name: 'Organization Profile' })).toBe(
      null
    );
  });

  it('should render the values when they exist', () => {
    renderStaticLayout(schema as JSONSchema7, uiSchema as JSONSchema7, {
      submissionCompletedFor: 'submissionCompletedFor test',
      submissionDate: '2022-09-22',
    });

    expect(screen.getByText('submissionCompletedFor test')).toBeInTheDocument();
    expect(screen.getByText('2022-09-22')).toBeInTheDocument();
  });
});
