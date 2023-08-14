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
    cy.intercept('POST', '/graphql').as('graphql');
  });

  it('loads', () => {
    cy.visit('/analyst/application/1/project');

    cy.contains('h2', 'Conditional approval');
    // conditional approval tests here

    cy.contains('h2', 'Announcements');

    cy.wait('@graphql');
    cy.get('button').contains('Add announcement').click();
    cy.get('body').happoScreenshot({ component: 'Project page' });

    cy.contains('h2', 'Funding agreement, statement of work, & map');
    // funding agreement tests here

    cy.contains('h2', 'Community progress report');
  });
});
