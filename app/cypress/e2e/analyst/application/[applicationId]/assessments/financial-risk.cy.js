/* eslint-disable import/extensions */
import assessmentsSetup, {
  assessmentsSetupLoginAdmin,
  assessmentsSetupLoginCbcAdmin,
  assessmentsSetupLoginSuperAdmin,
} from './setup.cy.js';

const testLoad = (screenShotTitle, setupFunction) => {
  setupFunction();
  cy.visit('/analyst/application/1/assessments/financial-risk');
  cy.contains('a', 'Financial Risk');
  cy.get('body').happoScreenshot({
    component: screenShotTitle,
  });
};

describe('The analyst financial risk assessment page', () => {
  it('loads with analyst', () => {
    assessmentsSetup();
    cy.visit('/analyst/application/1/assessments/financial-risk');
    cy.contains('a', 'Financial Risk');
    cy.get('body').happoScreenshot({
      component: 'Analyst financial risk assessment page',
    });
  });

  it('loads with cbcAdmin', () => {
    testLoad(
      'Analyst financial risk assessment page with CBC Admin',
      assessmentsSetupLoginCbcAdmin
    );
  });

  it('loads with admin', () => {
    testLoad(
      'Analyst financial risk assessment page with ccbc admin',
      assessmentsSetupLoginAdmin
    );
  });

  it('loads with super admin', () => {
    testLoad(
      'Analyst financial risk assessment page with super admin',
      assessmentsSetupLoginSuperAdmin
    );
  });

  it('Filled page and saved', () => {
    assessmentsSetup();
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
