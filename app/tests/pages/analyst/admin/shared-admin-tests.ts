/* eslint-disable import/no-extraneous-dependencies */
import { mocked } from 'jest-mock';
import { screen } from '@testing-library/react';
import { isAuthenticated } from '@bcgov-cas/sso-express/dist/helpers';
import defaultRelayOptions from 'lib/relay/withRelayOptions';

const checkTabStyles = (subTab) => {
  const adminTab = screen.getByRole('link', { name: 'Administrative' });
  const dashboardTab = screen.getByRole('link', { name: 'Dashboard' });

  const applicationIntakesTab = screen.getByRole('link', {
    name: 'Application intakes',
  });
  const downloadAttachmentsTab = screen.getByRole('link', {
    name: 'Download attachments',
  });
  const listOfAnalystsTab = screen.getByRole('link', {
    name: 'List of analysts',
  });

  expect(dashboardTab).toBeVisible();
  expect(adminTab).toBeVisible();
  expect(applicationIntakesTab).toBeVisible();
  expect(downloadAttachmentsTab).toBeVisible();
  expect(listOfAnalystsTab).toBeVisible();

  expect(dashboardTab).toHaveStyle('font-weight: 400;');
  expect(adminTab).toHaveStyle('font-weight: 700;');

  expect(applicationIntakesTab).toHaveStyle(
    `font-weight: ${subTab === 'Application intakes' ? 700 : 400};`
  );
  expect(downloadAttachmentsTab).toHaveStyle(
    `font-weight: ${subTab === 'Download attachments' ? 700 : 400};`
  );
  expect(listOfAnalystsTab).toHaveStyle(
    `font-weight: ${subTab === 'List of analysts' ? 700 : 400};`
  );
};

const checkRouteAuthorization = () => {
  it('should redirect an unauthorized user', async () => {
    const ctx = {
      req: {
        url: '/analyst/admin/application-intakes',
        claims: {
          client_roles: ['analyst'],
          identity_provider: 'idir',
        },
      },
    } as any;

    expect(await defaultRelayOptions.serverSideProps(ctx)).toEqual({
      redirect: {
        destination: '/analyst',
      },
    });
  });

  it('should not redirect a user with admin privileges', async () => {
    mocked(isAuthenticated).mockReturnValue(true);

    const ctx = {
      req: {
        url: '/analyst/admin/application-intakes',
        claims: {
          client_roles: ['admin'],
          identity_provider: 'idir',
        },
      },
    } as any;

    expect(await defaultRelayOptions.serverSideProps(ctx)).toEqual({});
  });
};

// eslint-disable-next-line jest/no-export
export { checkRouteAuthorization, checkTabStyles };
