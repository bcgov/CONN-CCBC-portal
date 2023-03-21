import assessmentsSetup from './setup.js';

describe('The analyst financial risk assessment page', () => {
  beforeEach(() => {
    assessmentsSetup();
  });

  it('loads', () => {
    cy.visit('/analyst/application/1/assessments/financial-risk');
    cy.contains('a', 'Financial Risk');
    cy.get('body').happoScreenshot({
      component: 'Analyst financial risk assessment page',
    });
  });

  it('Filled page and saved', () => {
    cy.visit('/analyst/application/1/assessments/financial-risk');
    cy.contains('a', 'Financial Risk');
    cy.wait('@graphql');
    cy.get('select[id="root_assignedTo"]').select('Meherzad Romer');
    cy.get('input[id="root_targetDate"]').invoke('val', '2023-03-10');
    cy.get('input[id="root_nextStep-1"]').parent().click();
    cy.get('input[id="root_decision-1"]').parent().click();
    cy.contains('button', /^Save$/).click();
    cy.contains('button', 'Saved');
    cy.visit('/analyst/application/1/assessments/financial-risk');
    cy.get('body').happoScreenshot({
      component: 'Filled Analyst Financial Risk Assessment Page',
    });
  });
});
