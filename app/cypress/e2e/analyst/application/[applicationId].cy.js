describe('The analyst application view', () => {
  beforeEach(() => {
    cy.mockLogin('ccbc_analyst');
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
    cy.get('body').happoScreenshot({ component: 'Analyst application view' });
  });
});
