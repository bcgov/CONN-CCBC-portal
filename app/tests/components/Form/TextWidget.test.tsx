import FormTestRenderer from '../../utils/formTestRenderer';
import { render, screen, fireEvent } from '@testing-library/react';
import type { JSONSchema7 } from 'json-schema';

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
    'ui:description': 'maximum 200 characters',
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

const renderStaticLayout = (schema: JSONSchema7, uiSchema: JSONSchema7) => {
  return render(
    <FormTestRenderer
      formData={{}}
      onSubmit={() => console.log('test')}
      schema={schema as JSONSchema7}
      uiSchema={uiSchema}
    />
  );
};

describe('The TextWidget string type input', () => {
  beforeEach(() => {
    renderStaticLayout(
      {
        ...schema,
        properties: { stringTestField: schema.properties.stringTestField },
      } as JSONSchema7,
      { stringTestField: uiSchema.stringTestField } as JSONSchema7
    );
  });

  it('should render the text widget input field', () => {
    expect(screen.getByTestId('root_stringTestField'));
  });

  it('should render the text widget description', () => {
    expect(screen.getByText('maximum 200 characters'));
  });

  it('should rcontain the correct input value', () => {
    const input = screen.getByTestId('root_stringTestField');
    fireEvent.change(input, { target: { value: 'test string' } });
    expect(screen.getByDisplayValue('test string'));
  });
});

describe('The TextWidget email type input', () => {
  beforeEach(() => {
    renderStaticLayout(
      {
        ...schema,
        properties: { emailTestField: schema.properties.emailTestField },
      } as JSONSchema7,
      { emailTestField: uiSchema.emailTestField } as JSONSchema7
    );
  });

  it('should render the text widget input field', () => {
    expect(screen.getByTestId('root_emailTestField'));
  });

  it('should contain the correct input value', () => {
    const input = screen.getByTestId('root_emailTestField');
    fireEvent.change(input, { target: { value: 'test@test.ca' } });
    expect(screen.getByDisplayValue('test@test.ca'));
  });

  it('should rcontain the correct input value', () => {
    const input = screen.getByTestId('root_emailTestField');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(screen.getByText('Please enter a valid email address'));
  });
});
