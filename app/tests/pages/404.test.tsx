import { GrowthBookProvider } from '@growthbook/growthbook-react';
import { render, screen, within } from '@testing-library/react';
import Error404 from 'pages/404';
import GlobalTheme from 'styles/GlobalTheme';
import mockGrowthBook from 'tests/utils/mockGrowthBook';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const renderStaticLayout = () => {
  return render(
    <GrowthBookProvider growthbook={mockGrowthBook as any}>
      <GlobalTheme>
        <Error404 />
      </GlobalTheme>
    </GrowthBookProvider>
  );
};

describe('The index page', () => {
  beforeEach(() => {
    renderStaticLayout();
  });

  it('displays the title', async () => {
    expect(
      screen.getByText(/Sorry, requested resource cannot be found/)
    ).toBeVisible();
    expect(screen.getByText(/404 - Not Found/)).toBeVisible();
  });

  it('displays the return Home link', async () => {
    const p = screen.getByText(/Return back to/).closest('p');

    expect(within(p).getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/'
    );
  });
});
