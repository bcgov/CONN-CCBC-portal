describe('The analyst history page', () => {
  beforeEach(() => {
    cy.mockLogin('ccbc_analyst');
    const mockedDateString = '2022-10-10';
    const mockedDate = new Date(mockedDateString);
    cy.useMockedTime(mockedDate);
    cy.sqlFixture('e2e/reset_db');
    cy.sqlFixture('e2e/001_intake');
    cy.sqlFixture('e2e/001_application');
    cy.sqlFixture('e2e/001_application_received');
    cy.sqlFixture('e2e/001_rfi');
    cy.sqlFixture('e2e/001_history');
    cy.intercept('POST', '/graphql').as('graphql');
  });

  it('loads', () => {
    cy.visit('/analyst/application/1/history');

    cy.contains('h2', 'History');

    // Edit application
    cy.contains(/Annie Analyst edited the Application/);
    cy.contains('Reason For Change: e2e testing', { matchCase: false });

    // Change request
    cy.contains(/Annie Analyst created a Change Request/);
    cy.contains('Updated Statement of Work Excel');
    cy.contains('CCBC-010001-sow_excel.xlsx');

    // Project Information (SoW form)
    cy.contains(/Annie Analyst saved the Project information/, {
      matchCase: false,
    });
    cy.contains('Statement of Work Excel');
    cy.contains('SOW Wireless Table');
    cy.contains('Funding agreement');
    cy.contains('Finalized spatial data');

    // Announcement
    cy.contains('announcement');

    // RFI
    cy.contains(/Annie Analyst saved RFI-CCBC-010001-1/);
    cy.contains('RFI type');
    cy.contains('Missing files or information');
    cy.contains('Due by');
    cy.contains('Logical Network Diagram requested');
    cy.contains('Template 1 - Eligibility and Impacts Calculator requested');
    cy.contains('Template 6 - Community Benefits requested');

    // Assessments
    cy.contains(/Annie Analyst updated the Permitting assessment/, {
      matchCase: false,
    });
    cy.contains(/Annie Analyst updated the Project Management assessment/, {
      matchCase: false,
    });
    cy.contains(/Annie Analyst updated the Financial Risk assessment/, {
      matchCase: false,
    });
    cy.contains(/Annie Analyst updated the GIS assessment/, {
      matchCase: false,
    });
    cy.contains(/Annie Analyst updated the Technical assessment/, {
      matchCase: false,
    });
    cy.contains(/Annie Analyst updated the Screening assessment/, {
      matchCase: false,
    });

    // Status
    cy.contains(
      /Annie Analyst changed the Internal Status to Conditionally approved/,
      {
        matchCase: false,
      }
    );

    cy.contains(/The application was Received/, { matchCase: false });
  });
});
