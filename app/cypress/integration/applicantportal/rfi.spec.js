/// <reference types="Cypress" />

describe('Rfi on Applicant side', () => {
  beforeEach(() => {
    cy.mockLogin('ccbc_auth_user');
    const mockedDateString = '2022-10-10';
    const mockedDate = new Date(mockedDateString);
    cy.useMockedTime(mockedDate);
    cy.sqlFixture('e2e/reset_db');
    cy.sqlFixture('e2e/001_intake');
    cy.sqlFixture('e2e/001_application');
    cy.sqlFixture('e2e/001_application_received');
    cy.sqlFixture('e2e/001_rfi');
    cy.intercept('POST', '/graphql').as('graphql');
  });

  it('Applicant side RFI', () => {
    cy.visit('applicantportal/form/1/rfi/1');
    // check if the text rendered for the due date is there
    cy.contains('p', '2023-03-23').should('be.visible');
    cy.get('body').happoScreenshot({ component: 'RFI Upload Page Blank' });
    cy.get('[data-testid=file-test]')
      .first()
      .selectFile('cypress/fixtures/doc.txt', { force: true });
    // Wait for upload to finish
    cy.contains('button', 'doc.txt').should('be.visible');
    cy.contains('button', /^Save$/).click();
    cy.url().should('include', '/applicantportal/form/1/rfi/2');
    // Ensure the page has rendered after refreshing
    cy.contains('p', '2023-03-23').should('be.visible');
    cy.get('body').happoScreenshot({
      component: 'RFI Upload Page Field Filled',
    });
    cy.mockLogin('ccbc_analyst');
    cy.visit('analyst/application/1/rfi');
    // Wait for page to render fully and expect to find RFI file
    cy.contains('button', 'doc.txt').should('be.visible');
    cy.get('body').happoScreenshot({
      component: 'RFI Analyst Side After Applicant Upload',
    });
  });
});
