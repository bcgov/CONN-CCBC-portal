import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toast from '../../components/Toast';
import GlobalTheme from '../../styles/GlobalTheme';

type ToastType = 'success' | 'warning' | 'error';

const renderToast = (type: ToastType, onClose: () => void) => {
  return render(
    <GlobalTheme>
      <Toast type={type} onClose={onClose}>
        This is a {type} message!
      </Toast>
    </GlobalTheme>
  );
};

describe('Toast Component', () => {
  const handleClose = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders success toast', () => {
    renderToast('success', handleClose);

    expect(screen.getByText('This is a success message!')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('renders warning toast', () => {
    renderToast('warning', handleClose);

    expect(screen.getByText('This is a warning message!')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('renders error toast', () => {
    renderToast('error', handleClose);

    expect(screen.getByText('This is a error message!')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    renderToast('success', handleClose);

    fireEvent.click(screen.getByRole('button'));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('closes toast after specified timeout', async () => {
    jest.useFakeTimers();

    renderToast('success', handleClose);

    expect(screen.getByText('This is a success message!')).toBeInTheDocument();

    jest.advanceTimersByTime(10000);

    expect(handleClose).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });

  test('closes toast when close button is clicked before timeout', async () => {
    jest.useFakeTimers();

    renderToast('success', handleClose);

    expect(screen.getByText('This is a success message!')).toBeInTheDocument();

    userEvent.click(screen.getByRole('button'));

    expect(handleClose).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(10000);

    expect(handleClose).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });
});
