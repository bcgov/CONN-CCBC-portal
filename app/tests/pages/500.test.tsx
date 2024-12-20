import { GrowthBookProvider } from '@growthbook/growthbook-react';
import { render, screen, within } from '@testing-library/react';
import Error500 from 'pages/500';
import GlobalTheme from 'styles/GlobalTheme';
import mockGrowthBook from 'tests/utils/mockGrowthBook';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const renderStaticLayout = () => {
  return render(
    <GrowthBookProvider growthbook={mockGrowthBook as any}>
      <GlobalTheme>
        <Error500 />
      </GlobalTheme>
    </GrowthBookProvider>
  );
};

describe('The index page', () => {
  beforeEach(() => {
    renderStaticLayout();
  });

  it('displays the title', async () => {
    expect(screen.getByText(`Uh oh, something went wrong`)).toBeVisible();
  });

  it('displays the return Home link', async () => {
    const p = screen.getByText(/Please return/).closest('p');

    expect(within(p).getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/'
    );
  });
});
