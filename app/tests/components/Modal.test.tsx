import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Modal from 'components/Modal';
import GlobalTheme from 'styles/GlobalTheme';

const renderStaticLayout = (onCloseMock, onClickMock) => {
  return render(
    <GlobalTheme>
      <Modal
        id="test-modal"
        onClose={onCloseMock}
        open
        title="Test Modal"
        actions={[
          {
            id: 'test-btn',
            label: 'Test Button',
            onClick: onClickMock,
          },
        ]}
      >
        <p>Modal content</p>
      </Modal>
    </GlobalTheme>
  );
};

describe('Modal', () => {
  it('renders without crashing', () => {
    renderStaticLayout(jest.fn, jest.fn);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('closes the modal when close button is clicked', () => {
    const setModalOpenMock = jest.fn();

    renderStaticLayout(() => {
      setModalOpenMock(false);
    }, jest.fn);
    fireEvent.click(screen.getByTestId('close-button'));

    expect(setModalOpenMock).toHaveBeenCalledWith(false);
  });

  it('handles action button click', () => {
    const onClickMock = jest.fn();
    renderStaticLayout(jest.fn, () => {
      onClickMock();
    });
    fireEvent.click(screen.getByTestId('test-btn'));

    expect(onClickMock).toHaveBeenCalled();
  });
});
