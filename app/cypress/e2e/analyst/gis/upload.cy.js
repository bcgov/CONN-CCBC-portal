import gisSetup from './setup.cy';

describe('GIS Upload', () => {
  beforeEach(() => {
    gisSetup();
  });

  it('upload new gis', () => {
    cy.visit('/analyst/dashboard');
    cy.contains('a', 'GIS').click();
    cy.wait(10000);
    cy.url().should('include', '/analyst/gis');
    cy.contains('h2', 'GIS Input');
    cy.get('body').happoScreenshot({ component: 'GIS upload page' });
    cy.get('[data-testid=file-test]')
      .first()
      .selectFile('cypress/fixtures/gis.json', { force: true });
    cy.wait(500);
    cy.contains('gis.json');
    cy.contains('button', 'Continue').click();
    cy.wait(500);
    cy.url().should('include', '/analyst/gis/1');

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
    cy.contains('h1', 'GIS Analysis Import');
    cy.contains(/GIS analysis added to 1 projects for the first time/);
    cy.contains(/GIS analysis updated for 0 projects/);
    cy.contains(/Total processed 1/);
    cy.get('body').happoScreenshot({ component: 'GIS upload success page' });
  });

  it('upload invalid json with invalid schema', () => {
    cy.intercept('POST', '/api/analyst/gis').as('gisUpload');
    cy.visit('/analyst/dashboard');
    cy.contains('a', 'GIS').click();
    cy.wait(10000);
    cy.url().should('include', '/analyst/gis');
    cy.get('[data-testid=file-test]')
      .first()
      .selectFile('./tests/backend/lib/gis-data-errors.json', { force: true });
    cy.wait(10000);
    cy.contains('gis-data-errors.json');
    cy.contains('button', 'Continue').click();
    cy.wait('@gisUpload');
    cy.wait(10000);
    cy.contains(/Error uploading JSON file/);
    cy.contains(/GIS_TOTAL_HH must be number/);
    cy.contains(/GIS_PERCENT_OVERBUILD must be number/);
  });

  it('upload invalid json wrong format', () => {
    cy.intercept('POST', '/api/analyst/gis').as('gisUpload');
    cy.visit('/analyst/dashboard');
    cy.contains('a', 'GIS').click();
    cy.wait(10000);
    cy.url().should('include', '/analyst/gis');
    cy.get('[data-testid=file-test]')
      .first()
      .selectFile('./tests/backend/lib/gis-data-400a.json', { force: true });
    cy.wait(10000);
    cy.contains('gis-data-400a.json');
    cy.contains('button', 'Continue').click();
    cy.wait('@gisUpload');
    cy.wait(10000);
    cy.contains(/Error uploading JSON file/);
    cy.contains(/must be array at line 1/);
  });

  it('upload invalid json with empty values', () => {
    cy.intercept('POST', '/api/analyst/gis').as('gisUpload');
    cy.visit('/analyst/dashboard');
    cy.contains('a', 'GIS').click();
    cy.wait(10000);
    cy.url().should('include', '/analyst/gis');
    cy.get('[data-testid=file-test]')
      .first()
      .selectFile('./tests/backend/lib/gis-data-400b.json', { force: true });
    cy.wait(10000);
    cy.contains('gis-data-400b.json');
    cy.contains('button', 'Continue').click();
    cy.wait('@gisUpload');
    cy.wait(10000);
    cy.contains(/Error uploading JSON file/);
    cy.contains(/Value expected at line 2/);
    cy.contains(/Expected comma at line 5/);
    cy.contains(/Value expected at line 10/);
  });
});
