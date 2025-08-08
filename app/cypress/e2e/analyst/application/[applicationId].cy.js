const setups = ['ccbc_analyst', 'ccbc_admin', 'super_admin', 'cbc_admin'];

describe('The analyst application view', () => {
  setups.forEach((role) => {
    describe(`As ${role}`, () => {
      beforeEach(() => {
        cy.mockLogin(role);
        const mockedDateString = '2022-10-10';
        const mockedDate = new Date(mockedDateString);
        cy.useMockedTime(mockedDate);
        cy.sqlFixture('e2e/reset_db');
        cy.sqlFixture('e2e/001_intake');
        cy.sqlFixture('e2e/001_application');
        cy.sqlFixture('e2e/001_application_received');
        cy.sqlFixture('e2e/001_analyst');
      });

      it('loads', () => {
        cy.visit('/analyst/application/1');
        cy.contains('h1', 'Test application');

        // Wait for the application view to fully load
        cy.waitForElementStable('h1:contains("Test application")', {
          timeout: 10000,
          stabilityTime: 500,
        });

        cy.stableHappoScreenshot({
          component: `Analyst application view - ${role}`,
          clearHovers: false,
          ensureConsistent: false,
        });
      });
    });
  });
});
