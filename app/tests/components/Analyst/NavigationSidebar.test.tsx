import { render, screen } from '@testing-library/react';
import GlobalTheme from 'styles/GlobalTheme';
import NavigationSidebar from 'components/Analyst/NavigationSidebar';

const mockRouterState = {
  query: { applicationId: 1 },
  asPath: '/analyst/application/1',
};

jest.mock('next/router', () => ({
  useRouter() {
    return mockRouterState;
  },
}));

const renderStaticLayout = () => {
  return render(
    <GlobalTheme>
      <NavigationSidebar />
    </GlobalTheme>
  );
};

// eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
const useRouter = jest.spyOn(require('next/router'), 'useRouter');

describe('The NavigationSidebar', () => {
  beforeEach(() => {
    // Mock query params since we use them to generate url in component
  });

  it('should render the links with correct href', () => {
    useRouter.mockImplementation(() => mockRouterState);
    renderStaticLayout();

    expect(
      screen.getByText('Dashboard').parentElement.parentElement
    ).toHaveAttribute('href', '/analyst/dashboard');

    expect(
      screen.getByText('Application').parentElement.parentElement
    ).toHaveAttribute('href', '/analyst/application/1');

    expect(
      screen.getByText('Assessments').parentElement.parentElement
    ).toHaveAttribute('href', '/analyst/application/1/assessments');

    expect(screen.getByText('RFI').parentElement.parentElement).toHaveAttribute(
      'href',
      '/analyst/application/1/rfi'
    );

    expect(
      screen.getByText('History').parentElement.parentElement
    ).toHaveAttribute('href', '/analyst/application/1/history');
  });

  it('should have the selected colour when on the same url', () => {
    useRouter.mockImplementation(() => mockRouterState);
    renderStaticLayout();

    const element = screen.getByText('Application').parentElement;
    const style = window.getComputedStyle(element);

    expect(style.backgroundColor).toBe('rgb(248, 248, 248)');

    expect(screen.getByText('Dashboard').parentElement).not.toHaveStyle({
      backgroundColor: 'rgb(241, 242, 243)',
    });
  });

  it('should not have the selected colour when on a different url', () => {
    const mockRouter = {
      query: { applicationId: 2 },
      asPath: '/analyst/application/2/assessments',
    };

    useRouter.mockImplementation(() => mockRouter);
    renderStaticLayout();

    expect(screen.getByText('Application').parentElement).not.toHaveStyle({
      backgroundColor: 'rgb(241, 242, 243)',
    });

    const element = screen.getByText('Assessments').parentElement;
    const style = window.getComputedStyle(element);

    expect(style.backgroundColor).toBe('rgb(248, 248, 248)');
  });
});
