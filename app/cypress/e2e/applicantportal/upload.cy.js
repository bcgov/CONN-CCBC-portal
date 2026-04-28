/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable cypress/no-unnecessary-waiting */

context('Homepage', () => {
  beforeEach(function () {
    const mockedDateString = '2022-10-10';
    const mockedDate = new Date(mockedDateString);
    cy.useMockedTime(mockedDate);
    cy.sqlFixture('e2e/reset_db');
    cy.sqlFixture('e2e/001_intake');
    cy.sqlFixture('e2e/001_application');
    cy.mockLogin('ccbc_auth_user');
    cy.visit('/applicantportal');
  });

  it('should start, open dashboard, select draft application and skip to page 12 of the form', () => {
    cy.stableHappoScreenshot({ component: 'Applicant Landing Page' });

    cy.contains('h1', 'Welcome');

    cy.contains('a', 'program details');
    cy.contains('a', 'Go to dashboard')
      .should('have.attr', 'href', '/applicantportal/dashboard');

    cy.visit('/applicantportal/form/1/12');
    cy.findByRole('heading', { name: /^Supporting documents/i }).should(
      'exist'
    );

    cy.get('[id="root_copiesOfRegistration-btn"]').click();
    cy.get('[data-testid=file-test]')
      .first()
      .selectFile('cypress/fixtures/doc.txt', { force: true });
    cy.contains('[data-testid="file-download-link"]', 'doc.txt').should(
      'exist'
    );
  });

  afterEach(function () {
    cy.sqlFixture('e2e/reset_db');
  });
});
