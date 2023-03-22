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
  });

  it('Applicant side RFI', () => {
    cy.visit('applicantportal/form/1/rfi/1');
    // check if the text rendered for the due date is there
    cy.contains('p', '2023-03-23').should('be.visible');
    cy.get('body').happoScreenshot({ component: 'RFI Upload Page Blank' });
  });
});
