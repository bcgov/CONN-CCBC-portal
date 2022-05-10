import Home from '../../pages/index';

import { render, screen } from '@testing-library/react';

const renderStaticLayout = () => {
  return render(<Home />);
};

describe('The index page', () => {
  it('should render Start Form button', () => {
    renderStaticLayout();
    expect(screen.getByText('Start Form'));
  });
});
