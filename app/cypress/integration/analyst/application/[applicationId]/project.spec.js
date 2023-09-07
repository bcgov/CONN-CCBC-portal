describe('The analyst application view', () => {
  beforeEach(() => {
    cy.mockLogin('ccbc_analyst');
    const mockedDateString = '2022-10-10';
    const mockedDate = new Date(mockedDateString);
    cy.useMockedTime(mockedDate);
    cy.sqlFixture('e2e/reset_db');
    cy.sqlFixture('e2e/001_intake');
    cy.sqlFixture('e2e/001_application');
    cy.sqlFixture('e2e/001_application_received');
    cy.intercept('POST', '/graphql').as('graphql');

    cy.intercept('POST', '/api/analyst/sow/1/CCBC-010001/*/?validate=true', {
      statusCode: 200,
      body: {},
    }).as('sow-upload-validate');

    cy.intercept('POST', '/api/analyst/community-report/1/*/?validate=true', {
      statusCode: 200,
      body: {},
    }).as('community-report-validate');

    cy.intercept(
      'POST',
      '/api/analyst/claims/1/CCBC-010001/*/*/?validate=true',
      {
        statusCode: 200,
        body: {},
      }
    ).as('claims-validate');
  });

  it('loads', () => {
    cy.visit('/analyst/application/1/project');

    cy.contains('h2', 'Conditional approval');

    cy.wait(500);

    cy.get('body').happoScreenshot({ component: 'Conditional approval form' });
    // Province decision section
    cy.get('select[id="root_decision_ministerDecision"]').select('Approved');

    cy.get('[id="root_decision_ministerDate"]')
      .parent()
      .find('.MuiButtonBase-root')
      .click();
    cy.get('button').contains('1').click();

    cy.get('select[id="root_decision_ministerAnnouncement"]').select(
      'Announce immediately'
    );
    cy.get('[id="root_decision_provincialRequested"]').type(10);

    // ISED decision section
    cy.get('select[id="root_isedDecisionObj_isedDecision"]').select('Approved');

    cy.get('[id="root_isedDecisionObj_isedDate"]')
      .parent()
      .find('.MuiButtonBase-root')
      .click();
    cy.get('button').contains('1').click();

    cy.contains('h2', 'Announcements');
    cy.get('select[id="root_isedDecisionObj_isedAnnouncement"]').select(
      'Announce immediately'
    );
    cy.get('[id="root_isedDecisionObj_federalRequested"]').type(120);

    // Minister decision, letter and response file upload
    cy.get('[id="root_letterOfApproval_letterOfApprovalUpload-btn"]').click();
    cy.get('[data-testid=file-test]')
      .first()
      .selectFile('cypress/fixtures/doc.txt', { force: true });
    cy.wait(2000);
    cy.contains('button', 'doc.txt');

    // Applicant response
    cy.get('[id="root_letterOfApproval_letterOfApprovalDateSent"]')
      .parent()
      .find('.MuiButtonBase-root')
      .click();
    cy.get('button').contains('1').click();

    cy.get('select[id="root_response_applicantResponse"]').select('Accepted');

    cy.get('select[id="root_response_statusApplicantSees"]').select(
      'Conditionally Approved'
    );

    // Save conditional approval
    cy.get('#conditional-approval-save-button').click();

    cy.get('button').contains('Yes, change it').click();
    cy.wait('@graphql');

    // Announcements test
    cy.get('button').contains('Add announcement').click();

    cy.wait(500);

    cy.get('body').happoScreenshot({ component: 'Announcements form' });

    cy.get('select[id="root_announcementType"]').select('Primary');

    cy.get('[id="root_announcementUrl"]').type('www.e2e-testing.com');

    cy.get('[id="root_announcementDate"]')
      .parent()
      .find('.MuiButtonBase-root')
      .click();
    cy.get('button').contains('1').click();

    // Save announcement
    cy.get('#announcements-save-button').click();

    // Add secondary announcement
    cy.get('button').contains('Add announcement').click();

    cy.get('select[id="root_announcementType"]').select('Secondary');

    cy.get('[id="root_announcementUrl"]').type('www.e2e-testing.com');

    cy.get('[id="root_announcementDate"]')
      .parent()
      .find('.MuiButtonBase-root')
      .click();
    cy.get('button').contains('1').click();

    // Save announcement
    cy.get('#announcements-save-button').click();

    cy.wait('@graphql');

    // SoW/Change request form
    cy.contains('h2', 'Funding agreement, statement of work, & map');

    cy.get('[id="root_hasFundingAgreementBeenSigned-0"]')
      .parent()
      .click({ force: true });

    cy.get('body').happoScreenshot({ component: 'Statement of work form' });

    cy.get('[id="root_dateFundingAgreementSigned"]')
      .parent()
      .find('.MuiButtonBase-root')
      .click();
    cy.get('button').contains('1').click();

    // Funding agreement upload
    cy.get('[id="root_fundingAgreementUpload-btn"]').click();
    cy.get('[data-testid=file-test]')
      .first()
      .selectFile('cypress/fixtures/doc.txt', { force: true });
    cy.wait(2000);
    cy.contains('button', 'doc.txt');

    // Statement of work excel import

    cy.get('[id="root_statementOfWorkUpload-btn"]').click();
    cy.get('[data-testid=file-test]')
      .eq(1)
      .selectFile('cypress/fixtures/mock_excel.xlsx', {
        force: true,
      });
    cy.wait('@sow-upload-validate', { timeout: 50000 });
    cy.contains('button', 'mock_excel.xlsx');

    // Save statement of work
    cy.contains('Save & Import Data').click();

    cy.wait(2000);

    // Add change request
    cy.get('button').contains('Add change request').click();

    cy.wait(1000);

    cy.get('body').happoScreenshot({ component: 'Change request form' });

    cy.get('[id="root_amendmentNumber"]').type(1);

    cy.get('[id="root_dateRequested"]')
      .parent()
      .find('.MuiButtonBase-root')
      .click();
    cy.get('button').contains('1').click();

    cy.get('[id="root_dateApproved"]')
      .parent()
      .find('.MuiButtonBase-root')
      .click();
    cy.get('button').contains('1').click();

    cy.get('[id="root_descriptionOfChanges"]').type('test');

    cy.get('[id="root_levelOfAmendment-0"]').parent().click({ force: true });

    cy.get('[id="root_additionalComments"]').type('test');

    // Change request excel upload
    cy.get('[id="root_statementOfWorkUpload-btn"]').click();
    cy.get('[data-testid=file-test]')
      .eq(1)
      .selectFile('cypress/fixtures/mock_excel.xlsx', {
        force: true,
      });
    cy.wait('@sow-upload-validate', { timeout: 50000 });
    cy.contains('button', 'mock_excel.xlsx');

    // Save change request
    cy.contains('Save & Import Data').click();

    // Community progress report
    cy.get('button').contains('Add community progress report').click();

    cy.contains('h2', 'Community progress report');

    cy.wait(1000);
    cy.get('body').happoScreenshot({ component: 'Community progress form' });

    cy.get('[id="root_dueDate"]').parent().find('.MuiButtonBase-root').click();
    cy.get('button').contains('1').click();
    cy.wait(1000);
    cy.get('[id="root_dateReceived"]')
      .parent()
      .find('.MuiButtonBase-root')
      .click();
    cy.get('button').contains('1').click();

    // Community progress report excel upload
    cy.get('[id="root_progressReportFile-btn"]').click();
    cy.get('[data-testid=file-test]')
      .eq(3)
      .selectFile('cypress/fixtures/mock_excel.xlsx', {
        force: true,
      });
    cy.wait('@community-report-validate', { timeout: 50000 });
    cy.contains('button', 'mock_excel.xlsx');

    // Community progress report
    cy.contains('Save & Import').click();

    // Claims
    cy.get('button').contains('Add claim').click();

    cy.wait(1000);
    cy.get('body').happoScreenshot({ component: 'Claims form' });

    // Claim excel upload
    cy.get('[id="root_claimsFile-btn"]').click();
    cy.get('[data-testid=file-test]')
      .eq(4)
      .selectFile('cypress/fixtures/mock_excel.xlsx', {
        force: true,
      });
    cy.wait('@claims-validate', { timeout: 50000 });
    cy.contains('button', 'mock_excel.xlsx');

    // Save claim
    cy.contains('Save & Import').click();
  });
});
