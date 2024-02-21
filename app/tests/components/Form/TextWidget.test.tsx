import { RJSFSchema } from '@rjsf/utils';
import { render, screen, fireEvent } from '@testing-library/react';
import FormTestRenderer from '../../utils/formTestRenderer';

const schema = {
  title: 'Text widget test',
  type: 'object',
  properties: {
    stringTestField: { type: 'string', title: 'String test field' },
    emailTestField: { type: 'string', title: 'String test field' },
  },
};

const uiSchema = {
  stringTestField: {
    'ui:help': 'maximum 200 characters',
    'ui:options': {
      maxLength: 9,
    },
  },
  emailTestField: {
    'ui:options': {
      inputType: 'email',
    },
  },
};

const renderStaticLayout = (
  rjsfSchema: RJSFSchema,
  rjsfUiSchema: RJSFSchema
) => {
  return render(
    <FormTestRenderer
      formData={{}}
      onSubmit={jest.fn}
      schema={rjsfSchema}
      uiSchema={rjsfUiSchema}
    />
  );
};

describe('The TextWidget string type input', () => {
  beforeEach(() => {
    renderStaticLayout(
      {
        ...schema,
        properties: { stringTestField: schema.properties.stringTestField },
      } as RJSFSchema,
      { stringTestField: uiSchema.stringTestField } as RJSFSchema
    );
  });

  it('should render the text widget input field', () => {
    expect(screen.getByTestId('root_stringTestField')).toBeInTheDocument();
  });

  it('should render the text widget help', () => {
    expect(screen.getByText('maximum 200 characters')).toBeInTheDocument();
  });

  it('should rcontain the correct input value', () => {
    const input = screen.getByTestId('root_stringTestField');
    fireEvent.change(input, { target: { value: 'test string' } });
    expect(screen.getByDisplayValue('test string')).toBeInTheDocument();
  });
});

describe('The TextWidget email type input', () => {
  beforeEach(() => {
    renderStaticLayout(
      {
        ...schema,
        properties: { emailTestField: schema.properties.emailTestField },
      } as RJSFSchema,
      { emailTestField: uiSchema.emailTestField } as RJSFSchema
    );
  });

  it('should render the text widget input field', () => {
    expect(screen.getByTestId('root_emailTestField')).toBeInTheDocument();
  });

  it('should contain the correct input value', () => {
    const input = screen.getByTestId('root_emailTestField');
    fireEvent.change(input, { target: { value: 'test@test.ca' } });
    expect(screen.getByDisplayValue('test@test.ca')).toBeInTheDocument();
  });

  it('should rcontain the correct input value', () => {
    const input = screen.getByTestId('root_emailTestField');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(
      screen.getByText('Please enter a valid email address')
    ).toBeInTheDocument();
  });
});
