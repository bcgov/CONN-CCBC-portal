import assessmentsSetup from './setup.js';

describe('The analyst technical assessment page', () => {
  beforeEach(() => {
    assessmentsSetup();
  });

  it('loads', () => {
    cy.visit('/analyst/application/1/assessments/gis');
    cy.contains('a', 'GIS');
    cy.get('body').happoScreenshot({
      component: 'Analyst GIS assessment page',
    });
  });

  it('Filled GIS Assessment Page', () => {
    cy.visit('/analyst/application/1/assessments/gis');
    cy.contains('a', 'GIS');
    cy.wait('@graphql');
    cy.get('select[id="root_assignedTo"]').select('Meherzad Romer');
    cy.get('input[id="root_targetDate"]').invoke('val', '2023-03-10');
    cy.contains('button', /^Save$/).click();
    cy.contains('button', 'Saved');
    cy.visit('/analyst/application/1/assessments/gis');
    cy.get('body').happoScreenshot({
      component: 'Filled Analyst GIS Assessment Page',
    });
  });
});
