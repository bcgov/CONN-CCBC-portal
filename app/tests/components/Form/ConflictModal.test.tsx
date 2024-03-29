import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import ConflictModal from 'components/Form/ConflictModal';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Conflict Modal tests', () => {
  it('renders the modal with error header and text content', () => {
    const { getByText } = render(<ConflictModal isOpen close={jest.fn} />);
    expect(getByText('Error')).toBeInTheDocument();
    expect(
      getByText(
        'The form could not save. This sometimes happens when your application is open in multiple tabs.'
      )
    ).toBeInTheDocument();
    expect(
      getByText(/Unfortunately any recent work on this page has been lost/)
    ).toBeInTheDocument();
  });

  it('calls router.reload() when the button is clicked', () => {
    const mockReload = jest.fn();
    useRouter.mockImplementation(() => ({
      reload: mockReload,
    }));

    const { getByText } = render(<ConflictModal isOpen close={jest.fn} />);
    fireEvent.click(getByText('Refresh & Continue'));
    expect(window.location.hash).toBe('');
    expect(mockReload).toHaveBeenCalled();
  });

  it('closes the modal when close button is clicked', () => {
    const closeModalMock = jest.fn();

    const { getByTestId } = render(
      <ConflictModal isOpen close={closeModalMock} />
    );

    fireEvent.click(getByTestId('close-button'));

    expect(closeModalMock).toHaveBeenCalled();
  });
});
