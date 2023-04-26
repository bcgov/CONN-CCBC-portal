import { render, screen } from '@testing-library/react';
import Tooltip from '../../components/Tooltip';
import GlobalTheme from '../../styles/GlobalTheme';

const renderStaticLayout = () => {
  return render(
    <GlobalTheme>
      <Tooltip customId="test-custom-id" message="Test message">
        <div>Renders the children</div>
      </Tooltip>
    </GlobalTheme>
  );
};

describe('The Tooltip component', () => {
  it('should render the children', () => {
    renderStaticLayout();
    expect(screen.getByText('Renders the children')).toBeInTheDocument();
  });

  it('should render the tooltip message', () => {
    renderStaticLayout();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should render the tooltip with the custom id', () => {
    renderStaticLayout();
    expect(screen.getByText('Test message')).toHaveAttribute(
      'id',
      'test-custom-id'
    );
  });

  it('should render the tooltip with the default id', () => {
    render(
      <GlobalTheme>
        <Tooltip message="Test message">
          <div>Renders the children</div>
        </Tooltip>
      </GlobalTheme>
    );
    expect(screen.getByText('Test message')).toHaveAttribute('id', 'tooltip');
  });
});
