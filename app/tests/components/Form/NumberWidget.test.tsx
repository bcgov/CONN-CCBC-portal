import { RJSFSchema } from '@rjsf/utils';
import { render, screen, fireEvent } from '@testing-library/react';
import FormTestRenderer from '../../utils/formTestRenderer';

const schema: RJSFSchema = {
  title: 'Number widget test',
  type: 'object',
  properties: {
    numberTestField: { type: 'number', title: 'Number test field' },
    decimalNumberTestField: {
      type: 'number',
      title: 'Decimal number test field',
    },
    maxNumberTestField: {
      type: 'number',
      title: 'Max number test field',
      maximum: 42,
    },
  },
};

const uiSchema = {
  decimalNumberTestField: {
    'ui:options': {
      decimals: 3,
    },
  },
};

const renderStaticLayout = (rjsfSchema: RJSFSchema, rjsfUiSchema: any) => {
  return render(
    <FormTestRenderer
      formData={{}}
      onSubmit={jest.fn}
      schema={rjsfSchema}
      uiSchema={rjsfUiSchema}
    />
  );
};

describe('The NumberWidget', () => {
  beforeEach(() => {
    renderStaticLayout(schema, uiSchema);
  });

  it('should format numbers', () => {
    const input = screen.getByLabelText(/^Decimal number/i);
    fireEvent.change(input, { target: { value: 12345.21 } });
    expect(screen.getByDisplayValue('12,345.21')).toBeInTheDocument();
  });

  it('should never allow non-numeric input', () => {
    const inputs = screen.getAllByLabelText(/field/i);
    inputs.forEach((input) =>
      fireEvent.change(input, { target: { value: 'test string' } })
    );
    expect(screen.queryByDisplayValue('test string')).toBeNull();
  });

  it('should enforce the maximum value', () => {
    const input = screen.getByLabelText(/^Max number/i);
    fireEvent.change(input, { target: { value: 43 } });
    expect(screen.getByDisplayValue('42')).toBeInTheDocument();
  });
});
