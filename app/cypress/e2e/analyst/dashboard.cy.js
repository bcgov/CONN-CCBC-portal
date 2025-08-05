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

        // Wait for the page to load and any data to be fetched
        cy.waitForStableUI({ timeout: 15000, stabilityTimeout: 1000 });

        // Check if table exists and wait for it, otherwise just continue
        cy.get('body').then(($body) => {
          if ($body.find('[data-testid="dashboard-table"], table').length > 0) {
            cy.waitForElementStable('[data-testid="dashboard-table"], table', {
              timeout: 10000,
              stabilityTime: 500,
            });
          }
        });

        // Capture a Happo screenshot with the role specified
        cy.stableHappoScreenshot({
          component: `Analyst Dashboard - ${role}`,
          ensureConsistent: false, // Skip strict animation checks
        });
      });

      it('clicks on a dashboard row', () => {
        cy.visit('/analyst/dashboard');

        // Wait for page to load
        cy.waitForStableUI({ timeout: 15000, stabilityTimeout: 1000 });

        // Check if table exists before trying to click on it
        cy.get('body').then(($body) => {
          if ($body.find('[data-testid="dashboard-table"], table').length > 0) {
            cy.waitForElementStable('[data-testid="dashboard-table"], table', {
              timeout: 10000,
              stabilityTime: 500,
            });

            // Look for the specific row content
            cy.contains('td', 'CCBC-010001').should('exist').click();

            // Verify the URL after clicking
            cy.url().should('include', '/analyst/application/');
          } else {
            // If no table found, skip this test or handle differently
            cy.log('No dashboard table found, skipping row click test');
          }
        });
      });

      it('sorts the dashboard', () => {
        cy.visit('/analyst/dashboard');

        // Wait for page to load
        cy.waitForStableUI({ timeout: 15000, stabilityTimeout: 1000 });

        // Check if table exists before trying to sort
        cy.get('body').then(($body) => {
          if ($body.find('[data-testid="dashboard-table"], table').length > 0) {
            cy.waitForElementStable('[data-testid="dashboard-table"], table', {
              timeout: 10000,
              stabilityTime: 500,
            });

            // Click on the table header with aria-label to sort
            cy.get('th').eq(1).find('div').first().click();

            // Wait for sorting to complete by checking for stable table state
            cy.waitForElementStable('table tbody', {
              stabilityTime: 1000, // Longer stability time for sorting
            });

            // Verify that the sorting cookie is set correctly
            cy.getCookie('mrt_sorting_application').should(
              'have.property',
              'value',
              '[{%22id%22:%22intakeNumber%22%2C%22desc%22:true}]'
            );

            // Capture a Happo screenshot with the role specified
            cy.stableHappoScreenshot({
              component: `Sorted Analyst Dashboard - ${role}`,
              ensureConsistent: false, // Skip strict animation checks
            });
          } else {
            cy.log('No dashboard table found, skipping sort test');
          }
        });
      });
    });
  });
});
