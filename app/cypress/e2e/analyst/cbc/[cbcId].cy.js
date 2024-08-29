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
    cy.sqlFixture('e2e/001_analyst');
  });

  it('loads', () => {
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
    cy.get('body').happoScreenshot({ component: 'CBC project view' });
  });

  it('triggers quick edit', () => {
    cy.visit('/analyst/cbc/1');
    cy.get('button').contains('Quick edit').click();
    cy.get('body').happoScreenshot({
      component: 'CBC project view - quick edit',
    });
  });
});
