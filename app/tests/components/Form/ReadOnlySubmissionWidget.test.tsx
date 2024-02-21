import { render, screen } from '@testing-library/react';
import { uiSchema } from 'formSchema';
import { RJSFSchema } from '@rjsf/utils';
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

const renderStaticLayout = (
  s: RJSFSchema,
  u: any,
  formData,
  formContext: any = {}
) => {
  return render(
    <FormTestRenderer
      formData={formData}
      onSubmit={jest.fn}
      schema={s as RJSFSchema}
      uiSchema={u}
      formContext={{
        finalUiSchema: uiSchema,
        formErrorSchema: {},
        ...formContext,
      }}
    />
  );
};

describe('The ReadOnlySubmissionWidget', () => {
  it('should render the title', () => {
    renderStaticLayout(schema as RJSFSchema, ui, {});

    expect(screen.getByText('On this date (YYYY-MM-DD)')).toBeInTheDocument();
  });

  it('should render the value', () => {
    renderStaticLayout(schema as RJSFSchema, ui, {
      submissionDate: '2022-09-22',
    });

    expect(screen.getByText('2022-09-22')).toBeInTheDocument();
  });

  it('should render error when project area not selected', () => {
    renderStaticLayout(
      schema as RJSFSchema,
      ui,
      {
        submissionDate: '2022-09-22',
      },
      { isProjectAreaSelected: false }
    );

    expect(screen.getByText(/You must select a zone/)).toBeInTheDocument();
  });

  it('should render error when project area selected but an invalid selection', () => {
    renderStaticLayout(
      schema as RJSFSchema,
      ui,
      {
        submissionDate: '2022-09-22',
      },
      { isProjectAreaSelected: true, isProjectAreaInvalid: true }
    );

    expect(
      screen.getByText(
        /For this intake CCBC is considering 2 types of projects/
      )
    ).toBeInTheDocument();
  });
});
