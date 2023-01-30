describe('The analyst dashboard', () => {
  beforeEach(function () {
    const mockedDateString = '2022-10-10';
    const mockedDate = new Date(mockedDateString);
    cy.useMockedTime(mockedDate);
    cy.sqlFixture('e2e/reset_db');
    cy.sqlFixture('dev/001_intake');
    cy.sqlFixture('e2e/001_received_applications');
    cy.mockLogin('ccbc_analyst');
  });

  it('loads', () => {
    cy.visit('/analyst/dashboard');
    cy.contains('a', 'Dashboard');
    cy.get('body').happoScreenshot({ component: 'Analyst Dashboard' });
  });

  it('click on dashboard row', () => {
    cy.visit('/analyst/dashboard');
    // need to add to prevent "is detached from the dom" issue
    cy.wait(2000);
    cy.get('tbody > tr').click();
    cy.url().should('include', '/analyst/application/');
  });
});
