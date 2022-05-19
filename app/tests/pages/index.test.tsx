import Home from '../../pages/index';

import { render, screen } from '@testing-library/react';

const renderStaticLayout = () => {
  return render(<Home />);
};

describe('The index page', () => {
  it('should render Login button', () => {
    renderStaticLayout();
    expect(screen.getByText('Login'));
  });
});
