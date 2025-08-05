import gisSetup from './setup.cy';

describe('GIS Upload', () => {
  beforeEach(() => {
    gisSetup();
  });

  it('upload new gis', () => {
    cy.visit('/analyst/dashboard');
    cy.contains('a', 'GIS').click();

    // Wait for page navigation and loading to complete
    cy.url().should('include', '/analyst/gis');
    cy.contains('h2', 'GIS Input');

    // Wait for the file input to be ready
    cy.get('[data-testid=file-test], input[type="file"]').should('exist');
    cy.waitForStableUI({ stabilityTimeout: 500 });

    cy.stableHappoScreenshot({
      component: 'GIS upload page',
      ensureConsistent: false,
      clearHovers: false,
    });

    cy.get('[data-testid=file-test]')
      .first()
      .selectFile('cypress/fixtures/gis.json', { force: true });

    // Wait for file to be processed and UI to update
    cy.contains('gis.json');
    cy.contains('button', 'Continue')
      .should('be.visible')
      .and('not.be.disabled');

    cy.contains('button', 'Continue').click();

    // Wait for navigation and table to load
    cy.url().should('include', '/analyst/gis/1');

    // Wait for table to appear and be stable
    cy.get('table').should('be.visible');
    cy.get('table tbody tr').should('have.length.at.least', 1);
    cy.waitForStableUI({ timeout: 10000, stabilityTimeout: 1000 });

    cy.get('table tbody tr')
      .first()
      .within(() => {
        cy.contains('td', 'CCBC-010001').should('exist');
        cy.contains('td', '61').should('exist');
        cy.contains('td', '52').should('exist');
        cy.contains('td', '20').should('exist');
        cy.contains('td', '30').should('exist');
        cy.contains('td', '1').should('exist');
      });

    cy.contains('button', 'Import').click();

    // Wait for import completion
    cy.contains('h1', 'GIS Analysis Import');
    cy.contains(/GIS analysis added to 1 projects for the first time/);
    cy.contains(/GIS analysis updated for 0 projects/);
    cy.contains(/Total processed 1/);

    // Ensure all success messages are loaded before screenshot
    cy.waitForStableUI({ stabilityTimeout: 500 });
    cy.stableHappoScreenshot({
      component: 'GIS upload success page',
      ensureConsistent: false,
      clearHovers: false,
    });
  });

  it('upload invalid json with invalid schema', () => {
    cy.intercept('POST', '/api/analyst/gis').as('gisUpload');
    cy.visit('/analyst/dashboard');
    cy.contains('a', 'GIS').click();

    // Wait for page to load
    cy.url().should('include', '/analyst/gis');
    cy.get('[data-testid=file-test], input[type="file"]').should('exist');
    cy.waitForStableUI({ stabilityTimeout: 500 });

    cy.get('[data-testid=file-test]')
      .first()
      .selectFile('cypress/fixtures/gis-data-errors.json', { force: true });

    // Wait for file to be processed
    cy.contains('gis-data-errors.json');
    cy.contains('button', 'Continue')
      .should('be.visible')
      .and('not.be.disabled');

    cy.contains('button', 'Continue').click();

    // Wait for API response and error state to stabilize
    cy.wait('@gisUpload').its('response.statusCode').should('eq', 400);
    cy.waitForStableUI({ stabilityTimeout: 1000 });

    cy.stableHappoScreenshot({
      component: 'GIS invalid json with invalid schema',
      ensureConsistent: false,
      clearHovers: false,
    });

    // cy.contains(/Error uploading JSON file/);
    // cy.contains(/GIS_TOTAL_HH must be number/);
    // cy.contains(/GIS_PERCENT_OVERBUILD must be number/);
  });

  it('upload invalid json wrong format', () => {
    cy.intercept('POST', '/api/analyst/gis').as('gisUpload');
    cy.visit('/analyst/dashboard');
    cy.contains('a', 'GIS').click();

    cy.url().should('include', '/analyst/gis');
    cy.get('[data-testid=file-test], input[type="file"]').should('exist');
    cy.waitForStableUI({ stabilityTimeout: 500 });

    cy.get('[data-testid=file-test]')
      .first()
      .selectFile('cypress/fixtures/gis-data-400a.json', { force: true });

    cy.contains('gis-data-400a.json');
    cy.contains('button', 'Continue')
      .should('be.visible')
      .and('not.be.disabled');

    cy.contains('button', 'Continue').click();

    // Wait for API response and error state
    cy.wait('@gisUpload').its('response.statusCode').should('eq', 400);
    cy.waitForStableUI({ stabilityTimeout: 1000 });

    cy.stableHappoScreenshot({
      component: 'GIS upload invalid json wrong format',
      ensureConsistent: false,
      clearHovers: false,
    });

    // cy.contains(/Error uploading JSON file/);
    // cy.contains(/must be array at line 1/);
  });

  it('upload invalid json with empty values', () => {
    cy.intercept('POST', '/api/analyst/gis').as('gisUpload');
    cy.visit('/analyst/dashboard');
    cy.contains('a', 'GIS').click();

    cy.url().should('include', '/analyst/gis');
    cy.get('[data-testid=file-test], input[type="file"]').should('exist');
    cy.waitForStableUI({ stabilityTimeout: 500 });

    cy.get('[data-testid=file-test]')
      .first()
      .selectFile('cypress/fixtures/gis-data-400b.json', { force: true });

    // Wait for file selection UI to stabilize
    cy.waitForStableUI({ stabilityTimeout: 500 });
    cy.stableHappoScreenshot({
      component: 'GIS invalid json upload empty',
      ensureConsistent: false,
      clearHovers: false,
    });

    cy.contains('gis-data-400b.json');
    cy.contains('button', 'Continue')
      .should('be.visible')
      .and('not.be.disabled');
    cy.contains('button', 'Continue').click();

    // Wait for API response and error state
    cy.wait('@gisUpload').its('response.statusCode').should('eq', 400);
    cy.waitForStableUI({ stabilityTimeout: 1000 });

    cy.stableHappoScreenshot({
      component: 'GIS invalid json with empty',
      ensureConsistent: false,
      clearHovers: false,
    });

    // cy.contains(/Error uploading JSON file/);
    // cy.contains(/Value expected at line 2/);
    // cy.contains(/Expected comma at line 5/);
    // cy.contains(/Value expected at line 10/);
  });
});
