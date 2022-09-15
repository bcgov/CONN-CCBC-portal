import { SubmitBtns } from 'components/Form';
import { render, screen } from '@testing-library/react';
import GlobalTheme from 'styles/GlobalTheme';
import userEvent from '@testing-library/user-event';

const renderStaticLayout = ({
  disabled = false,
  formData = {},
  isSubmitPage = false,
  isUpdating = false,
  isWithdrawn = false,
  saveAsDraft = true,
  saveForm,
}) => {
  return render(
    <GlobalTheme>
      <SubmitBtns
        disabled={disabled}
        formData={formData}
        isSubmitPage={isSubmitPage}
        isUpdating={isUpdating}
        isWithdrawn={isWithdrawn}
        saveAsDraft={saveAsDraft}
        saveForm={saveForm}
      />
    </GlobalTheme>
  );
};

const defaultProps = {
  disabled: false,
  formData: {},
  isSubmitPage: false,
  isUpdating: false,
  isWithdrawn: false,
  saveAsDraft: true,
  saveForm: () => {},
};

describe('The SubmitBtns component', () => {
  it('should render the save and continue button on pages other than submission page', () => {
    renderStaticLayout(defaultProps);

    expect(
      screen.getByRole('button', { name: 'Save and continue' })
    ).toBeInTheDocument();
  });

  it('should render the button label Continue if application is withdrawn on pages other than submission page', () => {
    renderStaticLayout({
      ...defaultProps,
      isWithdrawn: true,
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

  it('should render the submit button when on the submission page', () => {
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

  it('should not initially display the success toast on the submission page', () => {
    const props = {
      ...defaultProps,
      isSubmitPage: true,
    };
    renderStaticLayout(props);

    expect(screen.queryByText('The draft was successfully saved. ')).toBeNull();
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

    //rerender with expected prop change
    rerender(
      <GlobalTheme>
        <SubmitBtns {...props} saveAsDraft={false} />
      </GlobalTheme>
    );

    expect(screen.getByRole('button', { name: 'Saved' })).toBeInTheDocument();
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

    //rerender with expected prop change
    rerender(
      <GlobalTheme>
        <SubmitBtns {...props} saveAsDraft={false} />
      </GlobalTheme>
    );

    expect(screen.getByText(/The draft was successfully saved./)).toBeVisible();

    expect(
      screen.getByRole('link', { name: 'Return to dashboard' })
    ).toHaveAttribute('href', '/dashboard');
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

    //rerender with expected prop change
    rerender(
      <GlobalTheme>
        <SubmitBtns {...props} saveAsDraft={false} />
      </GlobalTheme>
    );

    expect(
      screen.getByRole('button', { name: 'Saved' }).hasAttribute('disabled')
    );
  });
});
