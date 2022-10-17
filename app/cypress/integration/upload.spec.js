/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="Cypress" />

context('Homepage', () => {
  beforeEach(function () {
    const mockedDateString = '2022-10-10';
    const mockedDate = new Date(mockedDateString);
    cy.useMockedTime(mockedDate);
    cy.sqlFixture('dev/001_intake');
    cy.sqlFixture('dev/reset_db')
    cy.sqlFixture('dev/001_application')
    cy.visit('/');
  });

  it('should start, open dashboard, select draft application and skip to page 12 of the form', () => {
    cy.get('body').happoScreenshot({ component: 'Applicant Landing Page' });

    cy.get('h1').contains('Welcome');

    cy.get('a').contains('program details');

    // Todo: find a way around using these wait
    cy.wait(2000);

    cy.get('button').contains('Go to dashboard').click();

    cy.url().should('contain', '/dashboard');

    // Dashboard page
    cy.get('h1').contains('Dashboard');

    cy.get('body').happoScreenshot({ component: 'Dashboard Page' });

    cy.get('a').contains('Edit').click();
    cy.wait(2000);
    cy.get('a').contains('Supporting documents').click();
    cy.wait(2000);
    
    // cy.visit('http://localhost:3000/applicantportal/form/1/12');
    cy.get('[id="root_copiesOfRegistration-btn"]').click(); 
    cy.get('[data-testid=file-test]').first().selectFile('cypress/fixtures/doc.txt', { force: true });
    cy.wait(2000);
    cy.get('a').contains('doc.txt');

  });
});

