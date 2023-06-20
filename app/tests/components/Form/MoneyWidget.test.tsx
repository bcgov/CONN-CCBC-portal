import FormTestRenderer from 'tests/utils/formTestRenderer';
import { render, screen, fireEvent } from '@testing-library/react';
import type { JSONSchema7 } from 'json-schema';
import { MoneyWidget } from 'lib/theme/widgets';

const mockSchema = {
  title: 'Money widget test',
  type: 'object',
  properties: {
    moneyTestField: { type: 'number', title: 'Number test field' },
  },
};

const mockUiSchema = {
  moneyTestField: {
    'ui:widget': MoneyWidget,
    'ui:help': 'This is a test help message',
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

describe('The Money Widget number type input', () => {
  beforeEach(() => {
    renderStaticLayout(mockSchema as JSONSchema7, mockUiSchema as JSONSchema7);
  });

  it('should render the money widget input field', () => {
    expect(screen.getByTestId('root_moneyTestField')).toBeInTheDocument();
  });

  it('should contain the correct input value', () => {
    const input = screen.getByTestId('root_moneyTestField');
    fireEvent.change(input, { target: { value: 12345.21 } });
    expect(screen.getByDisplayValue('$12,345.21')).toBeInTheDocument();
  });

  it('displays the help message', () => {
    expect(screen.getByText('This is a test help message')).toBeInTheDocument();
  });
});
