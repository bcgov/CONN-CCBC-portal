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
  });
});
