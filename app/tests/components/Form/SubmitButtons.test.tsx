import { SubmitButtons } from 'components/Form';
import { render, screen } from '@testing-library/react';
import GlobalTheme from 'styles/GlobalTheme';
import userEvent from '@testing-library/user-event';

const renderStaticLayout = ({
  disabled = false,
  isEditable = true,
  formData = {},
  isSubmitPage = false,
  isUpdating = false,
  isAcknowledgementPage = false,
  savedAsDraft = false,
  saveForm,
  status = 'draft',
}) => {
  return render(
    <GlobalTheme>
      <SubmitButtons
        disabled={disabled}
        formData={formData}
        isSubmitPage={isSubmitPage}
        isUpdating={isUpdating}
        isEditable={isEditable}
        isAcknowledgementPage={isAcknowledgementPage}
        savedAsDraft={savedAsDraft}
        saveForm={saveForm}
        status={status}
      />
    </GlobalTheme>
  );
};

const defaultProps = {
  disabled: false,
  formData: {},
  isEditable: true,
  isSubmitPage: false,
  isUpdating: false,
  isAcknowledgementPage: false,
  savedAsDraft: false,
  saveForm: () => {},
  status: 'draft',
};

const mockRouterState = {
  route: '/',
  pathname: '',
  query: { id: 1 },
};

describe('The SubmitButtons component', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    const useRouter = jest.spyOn(require('next/router'), 'useRouter');
    useRouter.mockImplementation(() => mockRouterState);
  });
  it('should render the save and continue button on pages other than submission page', () => {
    renderStaticLayout(defaultProps);

    expect(
      screen.getByRole('button', { name: 'Save and continue' })
    ).toBeInTheDocument();
  });

  it('should render the button label Continue if application is withdrawn on pages other than submission page', () => {
    renderStaticLayout({
      ...defaultProps,
      isEditable: false,
      status: 'withdrawn',
    });

    expect(
      screen.getByRole('button', { name: 'Continue' })
    ).toBeInTheDocument();
  });

  it('should render the submit button when on the submission page', () => {
    const props = {
      ...defaultProps,
      isSubmitPage: true,
    };

    renderStaticLayout(props);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('should render the Save as draft button when on the submission page with a draft application', () => {
    const props = {
      ...defaultProps,
      isSubmitPage: true,
    };
    renderStaticLayout(props);

    expect(
      screen.getByRole('button', { name: 'Save as draft' })
    ).toBeInTheDocument();
  });

  it('should not render the Save as draft button when not on the submission page', () => {
    renderStaticLayout(defaultProps);

    expect(screen.queryByRole('button', { name: 'Save as draft' })).toBeNull();
  });

  it('should not render the Save as draft button when application status is not draft', () => {
    const props = {
      ...defaultProps,
      isSubmitPage: true,
      status: 'withdrawn',
    };
    renderStaticLayout(props);

    expect(screen.queryByRole('button', { name: 'Save as draft' })).toBeNull();
  });

  it('should change the Save as draft button text to Saved once clicked', async () => {
    const props = {
      ...defaultProps,
      isSubmitPage: true,
    };

    const { rerender } = renderStaticLayout(props);

    await userEvent.click(
      screen.getByRole('button', { name: 'Save as draft' })
    );

    // rerender with expected prop change
    rerender(
      <GlobalTheme>
        <SubmitButtons {...props} savedAsDraft />
      </GlobalTheme>
    );

    expect(screen.getByRole('button', { name: 'Saved' })).toBeInTheDocument();
  });

  it('should not initially display the success toast on the submission page', () => {
    const props = {
      ...defaultProps,
      isSubmitPage: true,
    };
    renderStaticLayout(props);

    expect(screen.queryByText('The draft was successfully saved. ')).toBeNull();
  });

  it('should display the success toast once the Save as draft button is clicked', async () => {
    const props = {
      ...defaultProps,
      isSubmitPage: true,
    };

    const { rerender } = renderStaticLayout(props);

    await userEvent.click(
      screen.getByRole('button', { name: 'Save as draft' })
    );

    // rerender with expected prop change
    rerender(
      <GlobalTheme>
        <SubmitButtons {...props} savedAsDraft />
      </GlobalTheme>
    );

    expect(screen.getByText(/The draft was successfully saved./)).toBeVisible();

    expect(
      screen.getByRole('link', { name: 'Return to dashboard' })
    ).toHaveAttribute('href', '/applicantportal/dashboard');
  });

  it('should disable the Save as draft button in the saved state', async () => {
    const props = {
      ...defaultProps,
      isSubmitPage: true,
    };

    const { rerender } = renderStaticLayout(props);

    await userEvent.click(
      screen.getByRole('button', { name: 'Save as draft' })
    );

    // rerender with expected prop change
    rerender(
      <GlobalTheme>
        <SubmitButtons {...props} savedAsDraft />
      </GlobalTheme>
    );

    expect(screen.getByRole('button', { name: 'Saved' })).toBeDisabled();
  });

  it('continue button on submitted acknowledgements page', async () => {
    const props = {
      ...defaultProps,
      isAcknowledgementPage: true,
      status: 'submitted',
    };

    renderStaticLayout(props);

    expect(screen.getByRole('button', { name: 'Continue' })).toBeTruthy();
  });

  it('submit button is disabled on submit page for submitted application', async () => {
    const props = {
      ...defaultProps,
      disabled: true,
      isSubmitPage: true,
      status: 'submitted',
    };

    renderStaticLayout(props);

    const submitButton = screen.getByRole('button', {
      name: 'Changes submitted',
    });

    expect(submitButton).toBeTruthy();
    expect(submitButton.hasAttribute('disabled')).toBeTrue();
  });

  it('return to dashboard button appears on submit page for submitted application', async () => {
    const props = {
      ...defaultProps,
      isSubmitPage: true,
      status: 'submitted',
    };

    renderStaticLayout(props);

    const returnToDashboard = screen.getByRole('button', {
      name: 'Return to dashboard',
    });

    expect(returnToDashboard).toBeInTheDocument();
  });

  it('displays continue button if isEditable is false when not on submit page', () => {
    const props = {
      ...defaultProps,
      isSubmitPage: false,
      isEditable: false,
    };

    renderStaticLayout(props);

    const continueButton = screen.getByRole('button', {
      name: 'Continue',
    });

    expect(continueButton).toBeInTheDocument();
  });
});
