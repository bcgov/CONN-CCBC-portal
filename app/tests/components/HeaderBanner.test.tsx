import { render, screen } from '@testing-library/react';
import HeaderBanner from 'components/HeaderBanner';
import GlobalTheme from 'styles/GlobalTheme';

const mockOpenshiftNamespace = jest.fn(() => 'environment-dev');
jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {
    OPENSHIFT_APP_NAMESPACE: mockOpenshiftNamespace(),
  },
}));

const renderStaticLayout = (
  environmentIndicator = false,
  type: 'success' | 'warn' | 'error' = 'success',
  message = 'test message'
) => {
  return render(
    <GlobalTheme>
      <HeaderBanner
        message={message}
        type={type}
        environmentIndicator={environmentIndicator}
      />
    </GlobalTheme>
  );
};

describe('The Header Banner component', () => {
  it('should render the correct banner when environment indicator on', () => {
    renderStaticLayout(true);
    const alert = screen.getByText(
      /Connected Communities BC portal Development environment/
    );

    expect(alert).toBeInTheDocument();
  });

  it('should not render the correct banner when environment indicator off', () => {
    renderStaticLayout(false);
    expect(
      screen.queryByText(
        /Connected Communities BC portal Development environment/
      )
    ).not.toBeInTheDocument();
  });

  it('should render the correct banner when message and warning provided', () => {
    renderStaticLayout(true, 'error');
    const alert = screen.getByText(/test message/);

    expect(alert).toBeInTheDocument();
  });

  test('applies correct message type styling', () => {
    renderStaticLayout(false, 'warn');
    expect(screen.getByText(/test message/)).toHaveStyle(
      'background-color: rgb(227 168 43)'
    );
  });

  test('does not display environment indicator content for prod environment', () => {
    mockOpenshiftNamespace.mockImplementationOnce(() => 'environment-prod');
    renderStaticLayout(true);
    expect(
      screen.queryByText(/Connected Communities BC portal/)
    ).not.toBeInTheDocument();
  });

  test('displays correct environment indicator content for test environment', () => {
    mockOpenshiftNamespace.mockImplementationOnce(() => 'environment-test');
    renderStaticLayout(true);
    expect(screen.getByText(/Test environment/)).toBeInTheDocument();
  });

  test('displays correct icon when type success', () => {
    renderStaticLayout(false);
    const icon = screen.getByTestId('header-banner-icon');
    expect(icon).toHaveClass('fa-square-check');
  });

  test('displays correct icon when type error or warn', () => {
    renderStaticLayout(false, 'warn');
    const iconWarn = screen.getByTestId('header-banner-icon');
    expect(iconWarn).toHaveClass('fa-triangle-exclamation');
  });
});
