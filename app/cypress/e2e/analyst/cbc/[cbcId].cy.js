const loadTest = (role) => {
  cy.visit('/analyst/cbc/1');
  cy.contains('h1', 'Project 1');
  cy.contains('h2', 'Tombstone');
  cy.contains('h2', 'Project type');
  cy.contains('h2', 'Locations');
  cy.contains('h2', 'Counts');
  cy.contains('h2', 'Funding');
  cy.contains('h2', 'Events and dates');
  cy.contains('h2', 'Miscellaneous');
  cy.contains('h2', 'Project data reviews');
  cy.get('body').happoScreenshot({ component: `CBC project view - ${role}` });
};
describe('The cbc project view', () => {
  beforeEach(() => {
    cy.mockLogin('cbc_admin');
    const mockedDateString = '2024-01-03';
    const mockedDate = new Date(mockedDateString);
    cy.useMockedTime(mockedDate);
    cy.sqlFixture('e2e/reset_db');
    cy.sqlFixture('e2e/001_intake');
    cy.sqlFixture('e2e/001_application');
    cy.sqlFixture('e2e/001_application_received');
    cy.sqlFixture('e2e/001_cbc_project');
    cy.sqlFixture('e2e/001_analyst');
  });
  describe('cbc load tests for each role', () => {
    const roles = ['ccbc_analyst', 'ccbc_admin', 'super_admin', 'cbc_admin'];
    roles.forEach((role) => {
      it(`loads for ${role}`, () => {
        loadTest(role);
      });
    });
  });

  it('triggers quick edit cbc_admin', () => {
    cy.visit('/analyst/cbc/1');
    cy.get('button').contains('Quick edit').click();
    cy.get('body').happoScreenshot({
      component: 'CBC project view - quick edit cbc_admin',
    });
  });

  it('triggers quick edit cbc_admin', () => {
    cy.mockLogin('super_admin');
    cy.visit('/analyst/cbc/1');
    cy.get('button').contains('Quick edit').click();
    cy.get('body').happoScreenshot({
      component: 'CBC project view - quick edit super_admin',
    });
  });
});
