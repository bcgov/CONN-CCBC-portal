import FormTestRenderer from '../../utils/formTestRenderer';
import { render, screen, fireEvent } from '@testing-library/react';
import type { JSONSchema7 } from 'json-schema';
import { MoneyWidget } from '../../../lib/theme/widgets';

const schema = {
  title: 'Money widget test',
  type: 'object',
  properties: {
    moneyTestField: { type: 'number', title: 'Number test field' },
  },
};

const uiSchema = {
  moneyTestField: {
    'ui:widget': MoneyWidget,
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
    renderStaticLayout(schema as JSONSchema7, uiSchema as JSONSchema7);
  });

  it('should render the money widget input field', () => {
    expect(screen.getByTestId('root_moneyTestField'));
  });

  it('should contain the correct input value', () => {
    const input = screen.getByTestId('root_moneyTestField');
    fireEvent.change(input, { target: { value: 12345.21 } });
    expect(screen.getByDisplayValue('$12,345.21'));
  });
});
