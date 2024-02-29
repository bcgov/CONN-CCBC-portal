import { render, screen, fireEvent } from '@testing-library/react';
import { RJSFSchema } from '@rjsf/utils';
import FormTestRenderer from '../../utils/formTestRenderer';

const options = {
  enumOptions: [1, 2, 3],
};

const mockSchema = {
  title: 'Checkboxes widget test',
  type: 'object',
  required: ['checkboxesWidgetTestField'],
  properties: {
    checkboxesWidgetTestField: {
      title: 'Checkboxes widget test field',
      type: 'array',
      items: {
        type: 'number',
        enum: options.enumOptions,
      },
      uniqueItems: true,
    },
  },
};

const mockUiSchema = {
  checkboxesWidgetTestField: {
    'ui:widget': 'CheckboxesWidget',
  },
};

const mockUiSchemaSingleSelection = {
  checkboxesWidgetTestField: {
    'ui:widget': 'CheckboxesWidget',
    'ui:options': {
      singleSelection: true,
    },
  },
};

const renderStaticLayout = (schema: RJSFSchema, uiSchema) =>
  render(
    <FormTestRenderer
      formData={{}}
      onSubmit={jest.fn}
      schema={schema as RJSFSchema}
      uiSchema={uiSchema}
    />
  );

describe('The Checkboxes widget', () => {
  beforeEach(() => {});

  it('should render the checkboxes widget title', () => {
    renderStaticLayout(mockSchema as RJSFSchema, mockUiSchema);

    expect(screen.getByText('Checkboxes widget test field')).toBeVisible();
  });

  it('renders checkboxes correctly', () => {
    renderStaticLayout(mockSchema as RJSFSchema, mockUiSchema);
    options.enumOptions.forEach((option) => {
      const checkbox = screen.getByText(option);
      expect(checkbox).toBeInTheDocument();
    });
  });

  it('allows multiple checkboxes to be checked', () => {
    const { container } = renderStaticLayout(
      mockSchema as RJSFSchema,
      mockUiSchema
    );

    const checkbox1 = container.querySelector(
      `input[name="root_checkboxesWidgetTestField-0-checkbox"]`
    );
    const checkbox2 = container.querySelector(
      `input[name="root_checkboxesWidgetTestField-1-checkbox"]`
    );
    fireEvent.click(checkbox1);
    fireEvent.click(checkbox2);

    expect(checkbox1).toBeChecked();
    expect(checkbox2).toBeChecked();
  });

  it('allows checkboxes to be deselected', () => {
    const { container } = renderStaticLayout(
      mockSchema as RJSFSchema,
      mockUiSchema
    );

    const checkbox1 = container.querySelector(
      `input[name="root_checkboxesWidgetTestField-0-checkbox"]`
    );
    const checkbox2 = container.querySelector(
      `input[name="root_checkboxesWidgetTestField-1-checkbox"]`
    );
    fireEvent.click(checkbox1);
    fireEvent.click(checkbox2);

    expect(checkbox1).toBeChecked();
    expect(checkbox2).toBeChecked();

    fireEvent.click(checkbox1);

    expect(checkbox1).not.toBeChecked();
    expect(checkbox2).toBeChecked();
  });

  it('allows only one checkbox to be checked in singleSelection mode', () => {
    const { container } = renderStaticLayout(
      mockSchema as RJSFSchema,
      mockUiSchemaSingleSelection
    );

    const checkbox1 = container.querySelector(
      `input[name="root_checkboxesWidgetTestField-0-checkbox"]`
    );
    const checkbox2 = container.querySelector(
      `input[name="root_checkboxesWidgetTestField-1-checkbox"]`
    );
    fireEvent.click(checkbox1);
    fireEvent.click(checkbox2);

    expect(checkbox1).not.toBeChecked();
    expect(checkbox2).toBeChecked();
  });

  it('unchecks checkbox when checked one is clicked in singleSelection', () => {
    const { container } = renderStaticLayout(
      mockSchema as RJSFSchema,
      mockUiSchemaSingleSelection
    );

    const checkbox1 = container.querySelector(
      `input[name="root_checkboxesWidgetTestField-0-checkbox"]`
    );
    fireEvent.click(checkbox1);
    expect(checkbox1).toBeChecked();

    fireEvent.click(checkbox1);
    expect(checkbox1).not.toBeChecked();
  });
});
