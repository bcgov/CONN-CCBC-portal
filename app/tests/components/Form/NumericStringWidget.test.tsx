import FormTestRenderer from '../../utils/formTestRenderer';
import { render, screen, fireEvent } from '@testing-library/react';
import type { JSONSchema7 } from 'json-schema';

const schema: JSONSchema7 = {
  type: 'object',
  properties: {
    numericString: {
      type: 'number',
      title: 'Numeric string test field',
    },
    phone: { type: 'string', title: 'Phone test field' },
    maxLength: {
      type: 'string',
      maxLength: 4,
      title: 'max length text field',
    },
  },
};

const uiSchema = {
  numericString: {
    'ui:widget': 'NumericStringWidget',
  },
  phone: {
    'ui:widget': 'NumericStringWidget',
    'ui:options': {
      inputType: 'phone',
    },
  },
  maxLength: { 'ui:widget': 'NumericStringWidget' },
};

const renderStaticLayout = (schema: JSONSchema7, uiSchema: any) => {
  return render(
    <FormTestRenderer
      formData={{}}
      onSubmit={() => console.log('test')}
      schema={schema as JSONSchema7}
      uiSchema={uiSchema}
    />
  );
};

describe('The NumericStringWidget', () => {
  beforeEach(() => {
    renderStaticLayout(schema, uiSchema);
  });

  it('should display numbers', () => {
    const input = screen.getByLabelText(/Numeric string/i);
    fireEvent.change(input, { target: { value: '12345' } });
    expect(screen.getByDisplayValue('12345')).toBeInTheDocument();
  });

  it('should never allow non-numeric input', () => {
    const inputs = screen.getAllByLabelText(/field/i);
    inputs.forEach((input) =>
      fireEvent.change(input, { target: { value: 'test string' } })
    );
    expect(screen.queryByDisplayValue('test string')).toBeNull();
  });

  it('should format phone numbers', () => {
    const input = screen.getByLabelText(/phone/i);

    fireEvent.change(input, { target: { value: 1234567890 } });
    expect(screen.getByDisplayValue('123-456-7890')).toBeInTheDocument();
  });

  it('should truncate values to the max length', () => {
    const input = screen.getByLabelText(/max length/i);

    fireEvent.change(input, { target: { value: '1234567890' } });
    expect(screen.getByDisplayValue('1234')).toBeInTheDocument();
  });
});
