import { fireEvent, screen } from '@testing-library/react';
import { act } from 'react';
import userEvent from '@testing-library/user-event';
import coverages from 'pages/analyst/gis/coverages';

import compiledCoveragesQuery, {
  coveragesQuery,
} from '__generated__/coveragesQuery.graphql';
import PageTestingHelper from '../../../utils/pageTestingHelper';

const mockQueryPayload = {
  Query() {
    return {
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
        authRole: 'ccbc_admin',
      },
    };
  },
};

jest.mock('@bcgov-cas/sso-express/dist/helpers');

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

const pageTestingHelper = new PageTestingHelper<coveragesQuery>({
  pageComponent: coverages,
  compiledQuery: compiledCoveragesQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {},
});

describe('The Gis coverages upload page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      pathname: '/analyst/gis/coverages',
    });
  });

  it('highlights the correct nav tabs', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const tabName = 'Application Coverages Upload';

    expect(
      screen.getByRole('link', {
        name: tabName,
      })
    ).toBeVisible();
  });

  it('renders correct controls', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;

    expect(screen.getByTestId('file-test')).toBeInTheDocument();

    const button = screen.getByRole('button', {
      name: 'Upload',
    });
    expect(button.parentElement).toHaveAttribute('href', '/#');
    await act(async () => {
      await userEvent.click(button);
    });
  });

  it('handles incorrect file extension', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();
    const badfile = new File([new ArrayBuffer(1)], 'file.kmz', {
      type: 'application/vnd.google-earth.kmz',
    });

    const goodfile = new File(
      [new ArrayBuffer(1)],
      'CCBC_APPLICATION_COVERAGES_AGGREGATED_NoDATA.zip',
      {
        type: 'application/zip',
      }
    );

    const inputFile = screen.getAllByTestId('file-test')[0];
    const uploadBtn = screen.getByRole('button', {
      name: 'Upload Drop files (or click to upload)',
    });

    fireEvent.change(inputFile, { target: { files: [badfile] } });
    await act(async () => {
      await userEvent.click(uploadBtn);
    });

    expect(
      screen.getByText(
        'Please use an accepted file type. Accepted type for this field is: .zip'
      )
    ).toBeVisible();

    fireEvent.change(inputFile, { target: { files: [goodfile] } });
    await act(async () => {
      await userEvent.click(uploadBtn);
    });

    expect(
      screen.queryAllByText(
        'Please use an accepted file type. Accepted type for this field is: .zip'
      ).length
    ).toBe(0);
  });

  it('handles success response from backend', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ status: 'success' }),
      })
    ) as jest.Mock;
    global.alert = jest.fn() as jest.Mock;

    const goodfile = new File(
      [new ArrayBuffer(1)],
      'CCBC_APPLICATION_COVERAGES_AGGREGATED_NoDATA.zip',
      {
        type: 'application/zip',
      }
    );

    const inputFile = screen.getAllByTestId('file-test')[0];

    fireEvent.change(inputFile, { target: { files: [goodfile] } });

    const button = screen.getByRole('button', { name: 'Upload' });
    expect(button.parentElement).toHaveAttribute('href', '/#');
    await act(async () => {
      await userEvent.click(button);
    });
  });

  it('handles fetch error from backend', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.reject(new Error('oops')),
      })
    ) as jest.Mock;
    global.alert = jest.fn() as jest.Mock;

    const goodfile = new File(
      [new ArrayBuffer(1)],
      'CCBC_APPLICATION_COVERAGES_AGGREGATED_NoDATA.zip',
      {
        type: 'application/zip',
      }
    );

    const inputFile = screen.getAllByTestId('file-test')[0];

    fireEvent.change(inputFile, { target: { files: [goodfile] } });

    const button = screen.getByRole('button', { name: 'Upload' });
    expect(button.parentElement).toHaveAttribute('href', '/#');

    await act(async () => {
      await userEvent.click(button);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
