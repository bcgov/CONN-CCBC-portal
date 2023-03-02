import React from 'react';
import { render } from '@testing-library/react';
import GlobalTheme from 'styles/GlobalTheme';
import StyledSelect from '../../../../lib/theme/components/StyledDropdown';

describe('StyledSelect component', () => {
  it('should render select element with correct styles', () => {
    const screen = render(
      <GlobalTheme>
        <StyledSelect />
      </GlobalTheme>
    );
    const select = screen.getByRole('combobox');

    // Check that select element has the correct margin
    expect(select).toHaveStyle('margin: 0.25em 0;');

    // Check that disabled select element has the correct styles
    select.setAttribute('disabled', 'true');
    expect(select).toHaveStyle('opacity: 0;');

    // Check that select wrapper element has the correct margin and width
    const selectWrapper = select.parentElement;
    expect(selectWrapper).toHaveStyle('margin: 12px 0;');
  });
});
