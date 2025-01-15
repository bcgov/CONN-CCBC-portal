import { render, screen } from '@testing-library/react';
import { uiSchema } from 'formSchema';
import { RJSFSchema } from '@rjsf/utils';
import FormTestRenderer from '../../utils/formTestRenderer';

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

const ui = {
  submissionCompletedFor: {
    'ui:widget': 'SubmissionCompletedForWidget',
  },
};

const mockRouterState = {
  route: '/',
  pathname: '',
  query: { id: 1 },
};

const renderStaticLayout = (s: RJSFSchema, u: any, formData) => {
  return render(
    <FormTestRenderer
      formData={formData}
      onSubmit={jest.fn}
      schema={s as RJSFSchema}
      uiSchema={u}
      formContext={{ finalUiSchema: uiSchema }}
    />
  );
};

describe('The ReadOnlySubmissionWidget', () => {
  beforeEach(() => {
    // Mock query params since we use them to generate url in component

    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    const useRouter = jest.spyOn(require('next/router'), 'useRouter');
    useRouter.mockImplementation(() => mockRouterState);
  });

  it('should render the title', () => {
    renderStaticLayout(schema as RJSFSchema, ui, {});

    expect(
      screen.getByText('Completed for (Legal organization name)')
    ).toBeInTheDocument();
  });

  it('should render the error message when submissionCompletedFor is empty', () => {
    renderStaticLayout(schema as RJSFSchema, ui, {});

    expect(
      screen.getByRole('link', { name: 'Organization Profile' })
    ).toBeInTheDocument();
  });

  it('should not render the error message when submissionCompletedFor is filled', () => {
    renderStaticLayout(schema as RJSFSchema, ui, {
      submissionCompletedFor: 'submissionCompletedFor test',
    });

    expect(screen.queryByRole('link', { name: 'Organization Profile' })).toBe(
      null
    );
  });

  it('should render the value', () => {
    renderStaticLayout(schema as RJSFSchema, ui, {
      submissionCompletedFor: 'submissionCompletedFor test',
    });

    expect(screen.getByText('submissionCompletedFor test')).toBeInTheDocument();
  });
});
