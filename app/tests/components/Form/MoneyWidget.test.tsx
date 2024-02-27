import FormTestRenderer from 'tests/utils/formTestRenderer';
import { render, screen, fireEvent } from '@testing-library/react';
import { MoneyWidget } from 'lib/theme/widgets';
import { RJSFSchema } from '@rjsf/utils';

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

const renderStaticLayout = (schema: RJSFSchema, uiSchema: RJSFSchema) => {
  return render(
    <FormTestRenderer
      formData={{}}
      onSubmit={jest.fn}
      schema={schema as RJSFSchema}
      uiSchema={uiSchema}
    />
  );
};

describe('The Money Widget number type input', () => {
  beforeEach(() => {
    renderStaticLayout(mockSchema as RJSFSchema, mockUiSchema as RJSFSchema);
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
