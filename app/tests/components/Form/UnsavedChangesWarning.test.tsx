import { RJSFSchema } from '@rjsf/utils';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import * as moduleApi from '@growthbook/growthbook-react';
import FormTestRenderer from '../../utils/formTestRenderer';

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
    'ui:help': 'maximum 200 characters',
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

const mockEnableUnsavedChangesWarning = (
  value: boolean
): moduleApi.FeatureResult<boolean> => ({
  value,
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'enable_unsaved_changes_warning',
});

const renderStaticLayout = (
  rjsfSchema: RJSFSchema,
  rjsfUiSchema: RJSFSchema
) => {
  return render(
    <>
      <FormTestRenderer
        formData={{}}
        onSubmit={jest.fn}
        schema={rjsfSchema}
        uiSchema={rjsfUiSchema}
      />
      <a href="/other-page">Navigate</a>
    </>
  );
};

describe('Unsaved Changes Handling', () => {
  beforeEach(() => {
    jest
      .spyOn(moduleApi, 'useFeature')
      .mockReturnValue(mockEnableUnsavedChangesWarning(true));
    renderStaticLayout(
      {
        ...schema,
        properties: { stringTestField: schema.properties.stringTestField },
      } as RJSFSchema,
      { stringTestField: uiSchema.stringTestField } as RJSFSchema
    );
  });

  it('should allow leaving page with no changes', async () => {
    const navigateLink = screen.getByText('Navigate');
    expect(navigateLink).toBeInTheDocument();
    act(() => {
      fireEvent.click(navigateLink);
    });

    await waitFor(() => {
      expect(screen.queryByText(/Changes not saved/)).not.toBeInTheDocument();
    });
  });

  it('should show confirmation modal when attempting to leave with unsaved changes', async () => {
    const input = screen.getByTestId('root_stringTestField');
    fireEvent.change(input, { target: { value: 'test string' } });
    expect(screen.getByDisplayValue('test string')).toBeInTheDocument();

    const navigateLink = screen.getByText('Navigate');
    expect(navigateLink).toBeInTheDocument();
    act(() => {
      fireEvent.click(navigateLink);
    });

    const confirmationModal = await screen.findByText(/Changes not saved/);
    expect(confirmationModal).toBeInTheDocument();
  });

  it('should allow leaving the page after confirming unsaved changes', async () => {
    const input = screen.getByTestId('root_stringTestField');
    fireEvent.change(input, { target: { value: 'test string' } });
    expect(screen.getByDisplayValue('test string')).toBeInTheDocument();

    // Attempt to logout
    const navigateLink = screen.getByText('Navigate');
    expect(navigateLink).toBeInTheDocument();
    act(() => {
      fireEvent.click(navigateLink);
    });

    // Expect the confirmation modal to appear
    const confirmationModal = await screen.findByText(/Changes not saved/);
    expect(confirmationModal).toBeInTheDocument();

    // Confirm to proceed
    const yesButton = screen.getByText('Yes, Discard Changes');
    act(() => {
      fireEvent.click(yesButton);
    });

    // Verify that the form no longer tracks unsaved changes
    await waitFor(() => {
      expect(screen.queryByText(/Changes not saved/)).not.toBeInTheDocument();
    });
  });

  it('should allow leaving the page without confirmation modal after saving changes', async () => {
    const input = screen.getByTestId('root_stringTestField');
    fireEvent.change(input, { target: { value: 'test string' } });
    expect(screen.getByDisplayValue('test string')).toBeInTheDocument();

    // Simulate saving changes
    const saveButton = screen.getByRole('button', { name: /Submit/i });
    act(() => {
      fireEvent.click(saveButton);
    });

    // Attempt to navigate away
    const navigateLink = screen.getByText('Navigate');
    act(() => {
      fireEvent.click(navigateLink);
    });

    // Ensure the confirmation modal does not appear after saving
    await waitFor(() => {
      expect(screen.queryByText(/Changes not saved/)).not.toBeInTheDocument();
    });
  });

  it('should allow leaving the page without confirmation modal after cancelling changes', async () => {
    const input = screen.getByTestId('root_stringTestField');
    fireEvent.change(input, { target: { value: 'test string' } });
    expect(screen.getByDisplayValue('test string')).toBeInTheDocument();

    // Simulate saving changes
    const saveButton = screen.getByRole('button', { name: /Cancel/i });
    act(() => {
      fireEvent.click(saveButton);
    });

    // Attempt to navigate away
    const navigateLink = screen.getByText('Navigate');
    act(() => {
      fireEvent.click(navigateLink);
    });

    // Ensure the confirmation modal does not appear after saving
    await waitFor(() => {
      expect(screen.queryByText(/Changes not saved/)).not.toBeInTheDocument();
    });
  });
});
