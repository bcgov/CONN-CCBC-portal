describe('The analyst dashboard', () => {
  it('loads', () => {
    cy.mockLogin('ccbc_analyst');
    cy.visit('/analyst/dashboard');
    cy.contains('h1', 'Dashboard');
    cy.get('body').happoScreenshot({ component: 'Analyst Dashboard' });
  });
});
