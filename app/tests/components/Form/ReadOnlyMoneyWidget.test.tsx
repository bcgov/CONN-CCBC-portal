import { render, screen, fireEvent } from '@testing-library/react';
import { RJSFSchema } from '@rjsf/utils';
import FormTestRenderer from '../../utils/formTestRenderer';
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

describe('The ReadOnlyMoneyWidget', () => {
  beforeEach(() => {
    renderStaticLayout(schema as RJSFSchema, uiSchema as RJSFSchema);
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
    expect(screen.getByDisplayValue('$123')).toBeInTheDocument();
  });

  it('should have disabled attribute', () => {
    const input = screen.getByTestId('root_moneyTestField');

    expect(input.hasAttribute('disabled')).toBeTrue();
  });
});
