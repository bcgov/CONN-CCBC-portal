describe('The applicant landing page', () => {
  beforeEach(() => {
    cy.useMockedTime(new Date('2022-10-10'));
    cy.sqlFixture('e2e/reset_db');
    cy.sqlFixture('dev/001_intake');
    cy.visit('/applicantportal');
  });

  it('Should render the expected elements ', () => {
    cy.get('h1').contains('Welcome');

    cy.get('a').contains('program details');

    cy.get('header').contains('Email us');
    cy.get('header').get('.banner').find('img');
    cy.get('.pg-menu-group').find('a').contains('Dashboard');
    cy.get('.pg-menu-group').find('form').get('button').contains('Logout');

    cy.get('footer').contains('Program details');
    cy.get('footer').contains('Disclaimer');
    cy.get('footer').contains('Privacy');
    cy.get('footer').contains('Accessibility');
    cy.get('footer').contains('Copyright');

    cy.get('body').happoScreenshot({ component: 'Applicant Landing Page' });
  });
});
