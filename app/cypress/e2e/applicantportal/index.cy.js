describe('The applicant landing page', () => {
  beforeEach(() => {
    cy.useMockedTime(new Date('2022-10-10'));
    cy.sqlFixture('e2e/reset_db');
    cy.sqlFixture('e2e/001_intake');
    cy.visit('/applicantportal');
  });

  it('Should render the expected elements ', () => {
    cy.contains('h1', 'Welcome');

    cy.contains('a', 'program details');

    cy.contains('header', 'Email us');
    cy.get('header .banner img');
    cy.contains('.pg-menu-group a', 'Dashboard');
    cy.contains('.pg-menu-group form button', 'Logout');

    cy.contains('footer', 'Program details');
    cy.contains('footer', 'Disclaimer');
    cy.contains('footer', 'Privacy');
    cy.contains('footer', 'Accessibility');
    cy.contains('footer', 'Copyright');

    cy.get('body').happoScreenshot({ component: 'Applicant Landing Page' });
  });
});
