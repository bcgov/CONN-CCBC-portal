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

    cy.intercept('POST', '/graphql', (req) => {
      const body = req.body;
      const createAttachmentRequestId = '952d8b3aa0c2b5d39021c0aa9d5768b4';

      if (body?.id === createAttachmentRequestId) {
        req.alias = 'createAttachmentMutation';
        return;
      }

      if (typeof body === 'string' && body.includes(createAttachmentRequestId)) {
        req.alias = 'createAttachmentMutation';
        return;
      }

      if (body?.get && typeof body.get === 'function') {
        const operations = body.get('operations');
        if (
          typeof operations === 'string' &&
          operations.includes(createAttachmentRequestId)
        ) {
          req.alias = 'createAttachmentMutation';
        }
      }
    });

    cy.get('[id="root_copiesOfRegistration-btn"]').click();
    cy.get('[data-testid=file-test]')
      .first()
      .selectFile('cypress/fixtures/doc.txt', { force: true });
    cy.wait('@createAttachmentMutation')
      .its('response.body.data.createAttachment.attachment.rowId')
      .should('exist');
  });

  afterEach(function () {
    cy.sqlFixture('e2e/reset_db');
  });
});
