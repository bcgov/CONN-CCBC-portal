import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import GlobalTheme from 'styles/GlobalTheme';
import FileComponent from 'lib/theme/components/FileComponent';

const onChangeMock = jest.fn();

const renderStaticLayout = (
  allowMultipleFiles: boolean,
  allowDragAndDrop: boolean,
  errors?: Array<any>
) => {
  return render(
    <GlobalTheme>
      <FileComponent
        allowDragAndDrop={allowDragAndDrop}
        onChange={onChangeMock}
        id="test-file-component"
        label="Test Label"
        allowMultipleFiles={allowMultipleFiles}
        fileTypes=".xls, .xlsx, .xlsm"
        errors={errors}
      />
    </GlobalTheme>
  );
};

describe('FileComponent', () => {
  beforeEach(() => {});

  it('should handle file drop correctly', async () => {
    renderStaticLayout(false, true);
    const dropzoneInput = screen.getByTestId('file-test');
    const dropzone = dropzoneInput.closest(
      '[class*="FileComponent__StyledContainer"]'
    );
    expect(dropzone).toHaveStyle('border: 1px dashed rgba(0, 0, 0, 0.16)');

    fireEvent.dragOver(dropzone);
    expect(dropzone).toHaveStyle('border: 2px dashed #3b99fc');

    fireEvent.dragLeave(dropzone);
    expect(dropzone).not.toHaveStyle('border: 2px dashed #3b99fc');

    const files = [
      new File([new ArrayBuffer(1)], 'template_one.xlsx', {
        type: 'application/excel',
      }),
    ];

    await act(async () => {
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files,
          items: files,
        },
      });
    });

    expect(onChangeMock).toHaveBeenCalled();
  });

  it('should handle multiple file drops correctly', async () => {
    renderStaticLayout(true, true);
    const dropzoneInput = screen.getAllByTestId('file-test')[0];
    const dropzone = dropzoneInput.parentElement;

    const files = [
      new File([new ArrayBuffer(1)], 'template_one.xlsx', {
        type: 'application/excel',
      }),
      new File([new ArrayBuffer(1)], 'template_two.xlsx', {
        type: 'application/excel',
      }),
    ];

    await act(async () => {
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files,
          items: files,
        },
      });
    });

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock.mock.calls[0][0].target.files.length).toBe(2);
  });

  it('should show error when multiple files dropped and allowMultipleFiles is false', async () => {
    renderStaticLayout(false, true);
    const dropzoneInput = screen.getAllByTestId('file-test')[0];
    const dropzone = dropzoneInput.parentElement;

    const files = [
      new File([new ArrayBuffer(1)], 'template_one.xlsx', {
        type: 'application/excel',
      }),
      new File([new ArrayBuffer(1)], 'template_two.xlsx', {
        type: 'application/excel',
      }),
    ];

    fireEvent.dragOver(dropzone, {
      dataTransfer: {
        files,
        items: files,
      },
    });
    expect(dropzone).not.toHaveStyle('border: 2px dashed #3b99fc');
    expect(
      screen.getByText('Multiple file upload not allowed.')
    ).toBeInTheDocument();

    await act(async () => {
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files,
          items: files,
        },
      });
    });

    expect(onChangeMock).not.toHaveBeenCalled();
    expect(
      screen.getByText('Multiple file upload not allowed.')
    ).toBeInTheDocument();
  });

  it('should show errors with filenames when multiple errors are passed', async () => {
    renderStaticLayout(true, true, [
      { fileName: 'test.kmz', error: 'fileType' },
      { fileName: 'test2.pdf', error: 'uploadFailed' },
    ]);

    expect(screen.getByText(/test.kmz/)).toBeInTheDocument();
    expect(
      screen.getByText(/File failed to upload, please try again/)
    ).toBeInTheDocument();
    expect(screen.getByText(/test2.pdf/)).toBeInTheDocument();
    expect(
      screen.getByText(/Please use an accepted file type/)
    ).toBeInTheDocument();
  });
});
