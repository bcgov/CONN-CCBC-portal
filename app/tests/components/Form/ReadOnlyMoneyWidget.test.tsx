import FormTestRenderer from '../../utils/formTestRenderer';
import { render, screen, fireEvent } from '@testing-library/react';
import type { JSONSchema7 } from 'json-schema';
import { ReadOnlyMoneyWidget } from '../../../lib/theme/widgets';

const schema = {
  title: 'Read only money widget test',
  type: 'object',
  properties: {
    moneyTestField: {
      type: 'number',
      title: 'Read only money widget test field',
    },
  },
};

const uiSchema = {
  moneyTestField: {
    'ui:widget': ReadOnlyMoneyWidget,
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

describe('The ReadOnlyMoneyWidget', () => {
  beforeEach(() => {
    renderStaticLayout(schema as JSONSchema7, uiSchema as JSONSchema7);
  });

  it('should render the read only money widget input field', () => {
    expect(screen.getByTestId('root_moneyTestField')).toBeInTheDocument();
  });

  it('should render the title', () => {
    expect(
      screen.getByText('Read only money widget test field (optional)')
    ).toBeInTheDocument();
  });

  it('should contain the correct input value', () => {
    const input = screen.getByTestId('root_moneyTestField');
    fireEvent.change(input, { target: { value: 123 } });
    expect(screen.getByDisplayValue('$123'));
  });

  it('should have disabled attribute', () => {
    const input = screen.getByTestId('root_moneyTestField');

    expect(input.hasAttribute('disabled')).toBeTrue();
  });
});
