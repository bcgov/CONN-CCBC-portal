import { TextWidget } from '../../../lib/theme/widgets';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { makeWidgetProps } from '../../helpers/createMocks';
// please provide feedback on this test setup
const setup = () => {
  const utils = render(
    <TextWidget {...makeWidgetProps({ placeholder: 'test' })} />
  );
  const input = utils.getByPlaceholderText('test') as HTMLInputElement;
  return {
    input,
    ...utils,
  };
};

describe('TextWidget', () => {
  it('simple without errors', () => {
    const { container } = render(<TextWidget {...makeWidgetProps({})} />);
    expect(container.getElementsByClassName('pg-input-input')).toBeTruthy();
  });
  xit('simple with errors', () => {
    // Arrange
    // Act
    // Assert
  });
  xit('simple with required', () => {
    // Arrange
    // Act
    // Assert
  });
  xit('simple without required', () => {
    // Arrange
    // Act
    // Assert
  });
  it('returns the value in the input', async () => {
    const { input } = setup();
    screen.debug();
    fireEvent.change(input, { target: { value: 'test value' } });
    expect(input.value).toBe('test value');

    // const user = userEvent.setup();
    // render(<TextWidget {...makeWidgetProps({ placeholder: 'test' })} />);
    // const input = screen.queryByPlaceholderText('test') as HTMLInputElement;
    // screen.debug();
    // await user.type(input, 'Some test value');
    // expect(input).toHaveValue('Some test value');
  });
});
