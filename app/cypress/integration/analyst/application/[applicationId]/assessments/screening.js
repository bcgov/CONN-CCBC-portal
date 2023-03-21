import assessmentsSetup from './setup.js';

describe('The analyst screening assessment page', () => {
  beforeEach(() => {
    assessmentsSetup();
  });

  it('loads', () => {
    cy.visit('/analyst/application/1/assessments/screening');
    cy.contains('a', 'Screening');
    cy.get('body').happoScreenshot({
      component: 'Analyst screening assessment page',
    });
  });

  it('Filled Screening Page', () => {
    cy.visit('/analyst/application/1/assessments/screening');
    cy.contains('a', 'Screening');
    cy.wait('@graphql');
    cy.get('select[id="root_assignedTo"]').select('Meherzad Romer');
    cy.get('input[id="root_targetDate"]').invoke('val', '2023-03-10');
    cy.get('input[id="root_nextStep-1"]').parent().click();
    cy.get('input[id="root_decision-1"]').parent().click();
    cy.get('input[id="root_contestingMap-0"]').parent().click();
    cy.contains('button', /^Save$/).click();
    cy.contains('button', 'Saved');
    cy.visit('/analyst/application/1/assessments/screening');
    cy.get('body').happoScreenshot({
      component: 'Filled Analyst screening assessment page',
    });
  });
});
