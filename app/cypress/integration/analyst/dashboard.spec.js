describe('The analyst dashboard', () => {
  it('loads', () => {
    cy.mockLogin('ccbc_analyst');
    cy.visit('/analyst/dashboard');
    cy.contains('h1', 'CCBC Analyst dashboard');
    cy.get('body').happoScreenshot({ component: 'Analyst Dashboard' });
  });
});
