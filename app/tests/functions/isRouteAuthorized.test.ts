import isRouteAuthorized from 'utils/isRouteAuthorized';

describe('The isRouteAuthorized function', () => {
  it('allows unauthenticated users to access the / route', () => {
    expect(isRouteAuthorized('/', 'ccbc_guest')).toBe(true);
    expect(isRouteAuthorized('/', '')).toBe(true);
  });

  it('allows unauthenticated users to access the /analystportal route', () => {
    expect(isRouteAuthorized('/analystportal', 'ccbc_guest')).toBe(true);
    expect(isRouteAuthorized('/analystportal', '')).toBe(true);
  });

  it('allows unauthenticated users to access the /applicantportal route', () => {
    expect(isRouteAuthorized('/applicantportal', 'ccbc_guest')).toBe(true);
    expect(isRouteAuthorized('/applicantportal', '')).toBe(true);
  });

  it('allows unauthenticated users to access the /analystportal/request-access route', () => {
    expect(
      isRouteAuthorized('/analystportal/request-access', 'ccbc_guest')
    ).toBe(true);
    expect(isRouteAuthorized('/analystportal/request-access', '')).toBe(true);
  });

  it('does not allow unauthenticated users to access the /analystportal/(.*) route', () => {
    expect(isRouteAuthorized('/analystportal/(.*)', 'ccbc_guest')).toBe(false);
    expect(isRouteAuthorized('/analystportal/(.*)', '')).toBe(false);
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

  it('allows ccbc_admin to access any route under the /analystportal/(.*) route', () => {
    expect(isRouteAuthorized('/analystportal/(.*)', 'ccbc_admin')).toBe(true);
    expect(
      isRouteAuthorized('/analystportal/some/other/route', 'ccbc_admin')
    ).toBe(true);
  });

  it('allows ccbc_analyst to access any route under the /analystportal/(.*) route', () => {
    expect(isRouteAuthorized('/analystportal/(.*)', 'ccbc_analyst')).toBe(true);
    expect(
      isRouteAuthorized('/analystportal/some/other/route', 'ccbc_analyst')
    ).toBe(true);
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

  it('does not allow ccbc_auth_user to access any route under the /analystportal/(.*) route', () => {
    expect(isRouteAuthorized('/analystportal/(.*)', 'ccbc_auth_user')).toBe(
      false
    );
    expect(
      isRouteAuthorized('/analystportal/some/other/route', 'ccbc_auth_user')
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
