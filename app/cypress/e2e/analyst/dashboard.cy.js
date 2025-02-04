describe('The Analyst Dashboard', () => {
  // Define the roles to be tested
  const roles = ['cbc_admin', 'ccbc_analyst', 'ccbc_admin', 'super_admin'];

  // Iterate through each role
  roles.forEach((role) => {
    describe(`As ${role}`, () => {
      // Setup before each test for the current role
      beforeEach(() => {
        const mockedDateString = '2022-10-10';
        const mockedDate = new Date(mockedDateString);

        // Mock the current time
        cy.useMockedTime(mockedDate);

        // Load necessary SQL fixtures
        cy.sqlFixture('e2e/reset_db_all');
        cy.sqlFixture('e2e/001_intake');
        cy.sqlFixture('e2e/001_received_applications');
        cy.sqlFixture('e2e/001_cbc_project');
        cy.sqlFixture('e2e/001_analyst');

        // Mock login for the current role
        cy.mockLogin(role);
      });

      it('loads the dashboard', () => {
        cy.visit('/analyst/dashboard');
        cy.contains('a', 'Dashboard');

        // Capture a Happo screenshot with the role specified
        cy.get('body').happoScreenshot({
          component: `Analyst Dashboard - ${role}`,
        });
      });

      it('clicks on a dashboard row', () => {
        cy.visit('/analyst/dashboard');

        // Wait to ensure elements are loaded and prevent "detached from DOM" issues
        cy.wait(2000);

        // Click on a specific dashboard row
        cy.contains('td', 'CCBC-010001').click();

        // Verify the URL after clicking
        cy.url().should('include', '/analyst/application/');
      });

      it('sorts the dashboard', () => {
        cy.visit('/analyst/dashboard');

        // Wait to ensure elements are loaded
        cy.wait(2000);

        // Click on the second table header to sort
        cy.get('tr > th').eq(1).click();

        // Verify that the sorting cookie is set correctly
        cy.getCookie('mrt_sorting_application').should(
          'have.property',
          'value',
          '[{%22id%22:%22intakeNumber%22%2C%22desc%22:true}]'
        );

        // Wait to ensure sorting is complete before taking the screenshot
        cy.wait(2000);

        // Capture a Happo screenshot with the role specified
        cy.get('body').happoScreenshot({
          component: `Sorted Analyst Dashboard - ${role}`,
        });
      });
    });
  });
});
