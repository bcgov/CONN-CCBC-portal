import gcpeSetup from './setup.cy';

const roles = ['ccbc_admin', 'ccbc_analyst', 'super_admin'];
const interactionRole = 'ccbc_admin';

const loadGcpeReportingPage = (role, { captureScreenshot = true } = {}) => {
  gcpeSetup(role);
  cy.visit('/analyst/reporting/gcpe');
  cy.waitForStableUI({ timeout: 15000, stabilityTimeout: 750 });

  cy.contains('h2', 'Generate a new report').should('be.visible');
  cy.contains('h2', 'Download an existing report').should('be.visible');
  cy.contains('h2', 'Generate and compare').should('be.visible');
  cy.contains('h2', 'Compare').should('be.visible');
  cy.get('[data-testid="reportToDownload"]').should('exist');
  cy.get('[data-testid="reportToCompare"]').should('exist');
  cy.get('[data-testid="reportSource"]').should('exist');
  cy.get('[data-testid="reportTarget"]').should('exist');

  cy.window().then((win) => {
    cy.stub(win.URL, 'createObjectURL').returns('blob:mock-url');
    cy.stub(win.URL, 'revokeObjectURL').as('revokeObjectURL');
    cy.stub(win.HTMLAnchorElement.prototype, 'click').as('downloadClick');
  });

  if (captureScreenshot) {
    cy.stableHappoScreenshot({
      component: `GCPE reporting page - ${role}`,
      ensureConsistent: false,
    });
  }
};

describe('GCPE Reporting', () => {
  roles.forEach((role) => {
    it(`loads the GCPE reporting page as ${role}`, () => {
      loadGcpeReportingPage(role);
    });
  });

  describe('report actions', () => {
    beforeEach(() => {
      loadGcpeReportingPage(interactionRole, { captureScreenshot: false });
    });

    it('generates a new report and populates the dropdown', () => {
      cy.get('[data-testid="reportToDownload"] option').should(
        'have.length',
        3
      );

      cy.intercept('GET', '/api/reporting/gcpe', (req) => {
        req.reply({
          statusCode: 200,
          headers: { rowId: '3' },
          body: 'fake-binary',
        });
      }).as('generateReport');

      cy.contains('button', 'Generate').click();

      cy.wait('@generateReport');
      cy.contains(
        'The report has been generated and downloaded successfully'
      ).should('be.visible');
      cy.get('@downloadClick').should('have.been.called');

      cy.get('[data-testid="reportToDownload"] option').should(
        'have.length',
        4
      );
      cy.get('[data-testid="reportToDownload"] option')
        .eq(1)
        .should('have.value', '3');
    });

    it('downloads an existing report', () => {
      cy.intercept('POST', '/api/reporting/gcpe/regenerate', (req) => {
        expect(req.body).to.deep.equal({ rowId: '2' });
        req.reply({
          statusCode: 200,
          body: 'fake-binary',
        });
      }).as('regenerateReport');

      cy.contains('button', 'Download').should('be.disabled');
      cy.get('[data-testid="reportToDownload"]').select('2');
      cy.contains('button', 'Download').should('not.be.disabled');
      cy.contains('button', 'Download').click();

      cy.wait('@regenerateReport');
      cy.contains(
        'The report has been regenerated and downloaded successfully'
      ).should('be.visible');
      cy.get('@downloadClick').should('have.been.called');
      cy.get('[data-testid="reportToDownload"] option').should(
        'have.length',
        3
      );
    });

    it('generates and compares against an existing report', () => {
      cy.intercept('POST', '/api/reporting/gcpe/generateAndCompare', (req) => {
        expect(req.body).to.deep.equal({ rowId: '2' });
        req.reply({
          statusCode: 200,
          headers: { rowId: '3' },
          body: 'fake-binary',
        });
      }).as('generateAndCompare');

      cy.contains('button', 'Generate & Compare').should('be.disabled');
      cy.get('[data-testid="reportToCompare"]').select('2');
      cy.contains('button', 'Generate & Compare').should('not.be.disabled');
      cy.contains('button', 'Generate & Compare').click();

      cy.wait('@generateAndCompare');
      cy.contains(
        'The comparison report has been generated and downloaded successfully'
      ).should('be.visible');
      cy.get('@downloadClick').should('have.been.called');

      cy.get('[data-testid="reportToDownload"] option').should(
        'have.length',
        4
      );
      cy.get('[data-testid="reportToDownload"] option')
        .eq(1)
        .should('have.value', '3');
    });

    it('compares two existing reports', () => {
      cy.intercept('POST', '/api/reporting/gcpe/compare', (req) => {
        expect(req.body).to.deep.equal({
          sourceRowId: '2',
          targetRowId: '1',
        });
        req.reply({
          statusCode: 200,
          body: 'fake-binary',
        });
      }).as('compareReports');

      cy.contains('button', /^Compare$/).should('be.disabled');

      cy.get('[data-testid="reportSource"]').select('2');
      cy.get('[data-testid="reportTarget"]').select('1');

      cy.contains('button', /^Compare$/).should('not.be.disabled');
      cy.contains('button', /^Compare$/).click();

      cy.wait('@compareReports');
      cy.contains(
        'The comparison has been generated and downloaded successfully'
      ).should('be.visible');
      cy.get('@downloadClick').should('have.been.called');
      cy.get('[data-testid="reportToDownload"] option').should(
        'have.length',
        3
      );
    });
  });
});
