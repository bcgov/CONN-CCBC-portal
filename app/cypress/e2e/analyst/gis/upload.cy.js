import gisSetup from './setup.cy';

describe('GIS Upload', () => {
  beforeEach(() => {
    gisSetup();
  });

  it('upload new gis', () => {
    cy.visit('/analyst/dashboard');
    cy.wait('@get-features');
    cy.contains('a', 'GIS').click();
    cy.url().should('include', '/analyst/gis');
    cy.contains('h2', 'GIS Input');
    cy.wait('@graphql');
    cy.get('[data-testid=file-test]')
      .first()
      .selectFile('cypress/fixtures/gis.json', { force: true });
    cy.contains('gis.json');
    cy.contains('button', 'Continue').click();
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
  });

  it('upload invalid json with invalid schema', () => {
    cy.visit('/analyst/dashboard');
    cy.wait('@get-features');
    cy.contains('a', 'GIS').click();
    cy.url().should('include', '/analyst/gis');
    cy.contains('h2', 'GIS Input');
    cy.wait('@graphql');
    cy.get('[data-testid=file-test]')
      .first()
      .selectFile('cypress/fixtures/gis_invalid.json', { force: true });
    cy.contains('gis_invalid.json');
    cy.contains('button', 'Continue').click();
    cy.contains(/Error uploading JSON file/);
    cy.contains(/GIS_TOTAL_HH must be number/);
    cy.contains(/GIS_PERCENT_OVERBUILD must be number/);
  });

  it('upload invalid json - not an array', () => {
    cy.visit('/analyst/dashboard');
    cy.wait('@get-features');
    cy.contains('a', 'GIS').click();
    cy.url().should('include', '/analyst/gis');
    cy.contains('h2', 'GIS Input');
    cy.wait('@graphql');
    cy.get('[data-testid=file-test]')
      .first()
      .selectFile('cypress/fixtures/gis_invalid_2.json', { force: true });
    cy.contains('gis_invalid_2.json');
    cy.contains('button', 'Continue').click();
    cy.contains(/Error uploading JSON file/);
    cy.contains(/must be array at line 1/);
  });
});
