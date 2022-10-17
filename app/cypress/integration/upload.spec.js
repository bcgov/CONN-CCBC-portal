/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="Cypress" />

context('Homepage', () => {
  beforeEach(function () {
    const mockedDateString = '2022-10-10';
    const mockedDate = new Date(mockedDateString);
    cy.useMockedTime(mockedDate);
    cy.sqlFixture('dev/001_intake');
    cy.visit('/');
  });

  // Commenting out radio inputs until we pass in proper names or ids to select from

  it('should start and fill the first page of the form', () => {
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
    cy.get('#root_copiesOfRegistration-btn').click(); 
    cy.get('[data-testid=file-test]').first().selectFile('cypress/fixtures/doc.txt', { force: true });
    cy.wait(2000);
    cy.get('a').contains('doc.txt');

});
});

