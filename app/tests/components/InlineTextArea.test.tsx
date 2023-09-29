import { act, fireEvent, render, screen } from '@testing-library/react';
import InlineTextArea from 'components/InlineTextArea';
import GlobalTheme from 'styles/GlobalTheme';

const renderStaticLayoutEdit = () => {
  return render(
    <GlobalTheme>
      <InlineTextArea
        isEditing
        value="testing edit"
        onSubmit={() => {}}
        setIsEditing={() => {}}
      />
    </GlobalTheme>
  );
};

const renderStaticLayoutReadOnly = (value) => {
  return render(
    <GlobalTheme>
      <InlineTextArea
        isEditing={false}
        value={value}
        onSubmit={() => {}}
        setIsEditing={() => {}}
      />
    </GlobalTheme>
  );
};
describe('The InlineTextArea component', () => {
  it('should render the editable form', async () => {
    renderStaticLayoutEdit();
    // select textarea with value 'testing edit'
    const textarea = screen.getByText('testing edit');
    expect(textarea).toBeInTheDocument();

    // change textarea value
    await act(async () => {
      fireEvent.change(textarea, { target: { value: 'testing edit 2' } });
    });

    // check that textarea value has changed
    expect(textarea).toHaveValue('testing edit 2');
  });

  it('should render the read-only form', async () => {
    renderStaticLayoutReadOnly('testing read-only');
    // select textarea with value 'testing read-only'
    const text = screen.getByText('testing read-only');
    expect(text).toBeInTheDocument();
  });

  it('should render the read-only form with placeholder', async () => {
    renderStaticLayoutReadOnly('');
    // select textarea with placeholder
    const placeholder = screen.getByText('Click to edit project description');
    expect(placeholder).toBeInTheDocument();
  });
});
