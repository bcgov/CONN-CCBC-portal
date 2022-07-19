import FormTestRenderer from '../../utils/formTestRenderer';
import { render, screen, fireEvent } from '@testing-library/react';
import type { JSONSchema7 } from 'json-schema';
import { NumberWidget } from '../../../lib/theme/widgets';

const schema = {
  title: 'Number widget test',
  type: 'object',
  properties: {
    numberTestField: { type: 'number', title: 'Number test field' },
    wholeNumberTestField: { type: 'number', title: 'Whole number test field' },
    phoneTestField: { type: 'string', title: 'Phone test field' },
  },
};

const uiSchema = {
  numberTestField: {
    'ui:widget': NumberWidget,
  },
  wholeNumberTestField: {
    'ui:widget': NumberWidget,
    'ui:options': {
      inputType: 'wholeNumber',
    },
  },
  phoneTestField: {
    'ui:widget': NumberWidget,
    'ui:options': {
      inputType: 'phone',
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

describe('The NumberWidget number type input', () => {
  beforeEach(() => {
    renderStaticLayout(
      {
        ...schema,
        properties: { numberTestField: schema.properties.numberTestField },
      } as JSONSchema7,
      { numberTestField: uiSchema.numberTestField } as JSONSchema7
    );
  });

  it('should render the number widget input field', () => {
    expect(screen.getByTestId('root_numberTestField'));
  });

  it('should contain the correct input value', () => {
    const input = screen.getByTestId('root_numberTestField');
    fireEvent.change(input, { target: { value: 12345.21 } });
    expect(screen.getByDisplayValue(12345.21));
  });
});

describe('The NumberWidget whole number type input', () => {
  beforeEach(() => {
    renderStaticLayout(
      {
        ...schema,
        properties: {
          wholeNumberTestField: schema.properties.wholeNumberTestField,
        },
      } as JSONSchema7,
      { wholeNumberTestField: uiSchema.wholeNumberTestField } as JSONSchema7
    );
  });

  it('should render the number widget input field', () => {
    expect(screen.getByTestId('root_wholeNumberTestField'));
  });

  it('should not allow string input', () => {
    const input = screen.getByTestId('root_wholeNumberTestField');
    fireEvent.change(input, { target: { value: 'test string' } });
  });

  it('should contain the correct input value', () => {
    const input = screen.getByTestId('root_wholeNumberTestField');
    fireEvent.change(input, { target: { value: 123456789 } });
    expect(screen.getByDisplayValue(123456789));
  });
});

describe('The NumberWidget phone input', () => {
  beforeEach(() => {
    renderStaticLayout(
      {
        ...schema,
        properties: {
          phoneTestField: schema.properties.phoneTestField,
        },
      } as JSONSchema7,
      { phoneTestField: uiSchema.phoneTestField } as JSONSchema7
    );
  });

  it('should render the phone field', () => {
    expect(screen.getByTestId('root_phoneTestField'));
  });

  it('should contain the correct input value', () => {
    const input = screen.getByTestId('root_phoneTestField');
    fireEvent.change(input, { target: { value: 1234567890 } });
    expect(screen.getByDisplayValue('123-456-7890'));
  });
});
