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
    cy.get('body').happoScreenshot({ component: 'Applicant Landing Page' });

    cy.contains('h1', 'Welcome');

    cy.contains('a', 'program details');

    // Todo: find a way around using these wait
    cy.wait(4000);

    cy.contains('button', 'Go to dashboard').click();

    cy.url().should('contain', '/dashboard');

    // Dashboard page
    cy.contains('h1', 'Dashboard');
    // cy.contains('a', 'Edit').click();
    // cy.wait(2000);
    // cy.contains('a', 'Supporting documents').click();
    // cy.wait(2000);

    // cy.get('[id="root_copiesOfRegistration-btn"]').click();
    // cy.get('[data-testid=file-test]')
    //   .first()
    //   .selectFile('cypress/fixtures/doc.txt', { force: true });
    // cy.wait(2000);
    // cy.contains('button', 'doc.txt');
  });

  afterEach(function () {
    cy.sqlFixture('e2e/reset_db');
  });
});
