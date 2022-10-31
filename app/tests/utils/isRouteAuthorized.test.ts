import isRouteAuthorized from 'utils/isRouteAuthorized';

describe('The isRouteAuthorized function', () => {
  it('allows unauthenticated users to access the / route', () => {
    expect(isRouteAuthorized('/', 'ccbc_guest')).toBe(true);
    expect(isRouteAuthorized('/', '')).toBe(true);
  });

  it('allows unauthenticated users to access the /analyst route', () => {
    expect(isRouteAuthorized('/analyst', 'ccbc_guest')).toBe(true);
    expect(isRouteAuthorized('/analyst', '')).toBe(true);
  });

  it('allows unauthenticated users to access the /applicantportal route', () => {
    expect(isRouteAuthorized('/applicantportal', 'ccbc_guest')).toBe(true);
    expect(isRouteAuthorized('/applicantportal', '')).toBe(true);
  });

  it('allows unauthenticated users to access the /analyst/request-access route', () => {
    expect(isRouteAuthorized('/analyst/request-access', 'ccbc_guest')).toBe(
      true
    );
    expect(isRouteAuthorized('/analyst/request-access', '')).toBe(true);
  });

  it('allows unauthenticated users to access the /error-500 route', () => {
    expect(isRouteAuthorized('/analyst/request-access', 'ccbc_guest')).toBe(
      true
    );
    expect(isRouteAuthorized('/analyst/request-access', '')).toBe(true);
  });

  it('does not allow unauthenticated users to access the /analyst/(.*) route', () => {
    expect(isRouteAuthorized('/analyst/(.*)', 'ccbc_guest')).toBe(false);
    expect(isRouteAuthorized('/analyst/(.*)', '')).toBe(false);
  });

  it('does not allow unauthenticated users to access the /applicantportal/(.*) route', () => {
    expect(isRouteAuthorized('/applicantportal/(.*)', 'ccbc_guest')).toBe(
      false
    );
    expect(isRouteAuthorized('/applicantportal/(.*)', '')).toBe(false);
  });

  it('does not allow routes that are not specified', () => {
    expect(isRouteAuthorized('/some/other/route', 'ccbc_admin')).toBe(false);
  });

  it('allows ccbc_admin to access any route under the /analyst/(.*) route', () => {
    expect(isRouteAuthorized('/analyst/(.*)', 'ccbc_admin')).toBe(true);
    expect(isRouteAuthorized('/analyst/some/other/route', 'ccbc_admin')).toBe(
      true
    );
  });

  it('allows ccbc_analyst to access any route under the /analyst/(.*) route', () => {
    expect(isRouteAuthorized('/analyst/(.*)', 'ccbc_analyst')).toBe(true);
    expect(isRouteAuthorized('/analyst/some/other/route', 'ccbc_analyst')).toBe(
      true
    );
  });

  it('does not allow ccbc_admin to access any route under the /applicantportal/(.*) route', () => {
    expect(isRouteAuthorized('/applicantportal/(.*)', 'ccbc_admin')).toBe(
      false
    );
    expect(
      isRouteAuthorized('/applicantportal/some/other/route', 'ccbc_admin')
    ).toBe(false);
  });

  it('does not allow ccbc_analyst to access any route under the /applicantportal/(.*) route', () => {
    expect(isRouteAuthorized('/applicantportal/(.*)', 'ccbc_analyst')).toBe(
      false
    );
    expect(
      isRouteAuthorized('/applicantportal/some/other/route', 'ccbc_analyst')
    ).toBe(false);
  });

  it('does not allow ccbc_auth_user to access any route under the /analyst/(.*) route', () => {
    expect(isRouteAuthorized('/analyst/(.*)', 'ccbc_auth_user')).toBe(false);
    expect(
      isRouteAuthorized('/analyst/some/other/route', 'ccbc_auth_user')
    ).toBe(false);
  });

  it('allows ccbc_auth_user to access any route under the /applicantportal/(.*) route', () => {
    expect(isRouteAuthorized('/applicantportal/(.*)', 'ccbc_auth_user')).toBe(
      true
    );
    expect(
      isRouteAuthorized('/applicantportal/some/other/route', 'ccbc_auth_user')
    ).toBe(true);
  });
});
