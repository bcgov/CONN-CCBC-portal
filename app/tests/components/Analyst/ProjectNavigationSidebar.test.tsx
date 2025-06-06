import { graphql } from 'react-relay';
import { screen, fireEvent } from '@testing-library/react';
import * as nextRouter from 'next/router';
import { ProjectNavigationSidebar } from 'components/Analyst';
import compiledQuery, {
  ProjectNavigationSidebarTestQuery,
} from '__generated__/ProjectNavigationSidebarTestQuery.graphql';
import ComponentTestingHelper from '../../utils/componentTestingHelper';

const testQuery = graphql`
  query ProjectNavigationSidebarTestQuery {
    ...ProjectNavigationSidebar_query
  }
`;

const mockQueryPayload = {
  Query() {
    return {
      allCcbcApplicationData: {
        nodes: [
          {
            ccbcNumber: 'CCBC-010020',
            rowId: 1,
            program: 'CCBC',
            id: 'WyJhcHBsaWNhdGlvbnMiLDFd',
          },
          {
            ccbcNumber: 'CCBC-010018',
            rowId: 6,
            program: 'CCBC',
            id: 'WyJhcHBsaWNhdGlvbnMiLDZd',
          },
          {
            ccbcNumber: 'CCBC-010027',
            rowId: 41,
            program: 'CCBC',
            id: 'WyJhcHBsaWNhdGlvbnMiLDQxXQ==',
          },
          {
            ccbcNumber: 'CCBC-010030',
            rowId: 42,
            program: 'CCBC',
            id: 'WyJhcHBsaWNhdGlvbnMiLDQyXQ==',
          },
        ],
      },
      allCbcData: {
        edges: [
          {
            node: {
              projectNumber: 5054,
              cbcId: 5,
              id: 'WyJjYmNfZGF0YSIsOF0=',
            },
          },
          {
            node: {
              projectNumber: 5057,
              cbcId: 10,
              id: 'WyJjYmNfZGF0YSIsNF0=',
            },
          },
          {
            node: {
              projectNumber: 5058,
              cbcId: 12,
              id: 'WyJjYmNfZGF0YSIsN10=',
            },
          },
        ],
      },
    };
  },
};

const componentTestingHelper =
  new ComponentTestingHelper<ProjectNavigationSidebarTestQuery>({
    component: ProjectNavigationSidebar as any,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayload,
    getPropsFromTestQuery: (data) => ({
      query: data,
    }),
  });

describe('The application navigation bar component', () => {
  let pushMock;
  let routerState;

  beforeAll(() => {
    pushMock = jest.fn();
    routerState = {
      push: pushMock,
      query: {},
      asPath: '',
      route: '/analyst/application/[applicationId]',
      pathname: '/analyst/application/[applicationId]',
      basePath: '',
      isLocaleDomain: false,
      prefetch: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
      isReady: true,
      isPreview: false,
      isMounted: true,
    };
    jest.spyOn(nextRouter, 'useRouter').mockImplementation(() => routerState);
  });

  beforeEach(() => {
    componentTestingHelper.reinit();
    pushMock.mockClear();
    // Reset routerState for each test
    routerState.query = {};
    routerState.asPath = '';
  });

  it('renders project navigation correctly with initial data', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getByLabelText('Go to project')).toBeInTheDocument();
    expect(screen.getByTestId('project-nav-prev-icon')).toBeInTheDocument();
    expect(screen.getByTestId('project-nav-next-icon')).toBeInTheDocument();
  });

  it('disables previous navigation button if no previous project exists', () => {
    componentTestingHelper.setMockRouterValues({
      query: { applicationId: '1' },
    });
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const prevButton = screen.getByTestId('project-nav-prev-icon');
    expect(prevButton).toBeDisabled();
  });

  it('disables next navigation button if no next project exists', () => {
    componentTestingHelper.setMockRouterValues({
      query: { cbcId: '12' },
      asPath: '/analyst/cbc/12',
    });
    // Update routerState for this test
    routerState.query = { cbcId: '12' };
    routerState.asPath = '/analyst/cbc/12';
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const nextButton = screen.getByTestId('project-nav-next-icon');
    expect(nextButton).toBeDisabled();
  });

  it('navigates to the next project on next button click', async () => {
    componentTestingHelper.setMockRouterValues({
      query: { cbcId: '6' },
      asPath: '/analyst/application/6',
    });
    // Update routerState for this test
    routerState.query = { cbcId: '6' };
    routerState.asPath = '/analyst/application/6';
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const nextButton = screen.getByTestId('project-nav-next-icon');
    expect(nextButton).toBeEnabled();

    fireEvent.click(nextButton);

    expect(pushMock).toHaveBeenCalledWith(
      '/analyst/application/41',
      undefined,
      { shallow: true }
    );
  });

  it('navigates to the next project on previous button click', async () => {
    componentTestingHelper.setMockRouterValues({
      query: { cbcId: '6' },
      asPath: '/analyst/application/6',
    });
    routerState.query = { cbcId: '6' };
    routerState.asPath = '/analyst/application/6';
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const prevButton = screen.getByTestId('project-nav-prev-icon');
    expect(prevButton).toBeEnabled();

    fireEvent.click(prevButton);

    expect(pushMock).toHaveBeenCalledWith('/analyst/application/1', undefined, {
      shallow: true,
    });
  });

  it('renders the autocomplete dropdown and selects an option', async () => {
    componentTestingHelper.setMockRouterValues({
      query: { cbcId: '6' },
      asPath: '/analyst/application/6',
    });
    routerState.query = { cbcId: '6' };
    routerState.asPath = '/analyst/application/6';
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    const autocompleteInput = screen.getByTestId(
      'project-nav-option-textfield'
    );
    expect(autocompleteInput).toBeInTheDocument();

    fireEvent.change(autocompleteInput.querySelector('input'), {
      target: { value: 'CCBC-010020' },
    });

    const option = await screen.findByText('CCBC-010020');
    expect(option).toBeInTheDocument();

    fireEvent.click(option);

    expect(pushMock).toHaveBeenCalledWith('/analyst/application/1', undefined, {
      shallow: true,
    });
  });

  it('reads and loads correct options from last visited list in storage', async () => {
    componentTestingHelper.setMockRouterValues({
      query: { cbcId: '1' },
      asPath: '/analyst/application/1',
    });
    // Update routerState for this test
    routerState.query = { cbcId: '1' };
    routerState.asPath = '/analyst/application/1';
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();

    const mockValue = JSON.stringify([
      { program: 'CCBC', rowId: '1', projectId: 'CCBC-112333' },
      { program: 'CCBC', rowId: '2', projectId: 'CCBC-233333' },
    ]);
    (Storage.prototype.getItem as jest.Mock).mockReturnValue(mockValue);

    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.getByText(/CCBC-233333/)).toBeInTheDocument();
  });
});
