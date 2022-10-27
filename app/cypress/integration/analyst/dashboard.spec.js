describe('The analyst dashboard', () => {
  it('loads', () => {
    cy.mockLogin('ccbc_analyst');
    cy.visit('/analyst/dashboard');
    cy.get('h1').contains('CCBC Analyst dashboard');
    cy.get('body').happoScreenshot({ component: 'Analyst Dashboard' });
  });
});
