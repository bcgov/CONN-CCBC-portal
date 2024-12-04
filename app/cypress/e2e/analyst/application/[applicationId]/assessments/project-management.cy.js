/* eslint-disable import/extensions */
import assessmentsSetup, {
  assessmentsSetupLoginAdmin,
  assessmentsSetupLoginCbcAdmin,
  assessmentsSetupLoginSuperAdmin,
} from './setup.cy.js';

const testLoad = (screenShotTitle, setupFunction) => {
  setupFunction();
  cy.visit('/analyst/application/1/assessments/project-management');
  cy.contains('a', 'Project Management');
  cy.get('body').happoScreenshot({
    component: screenShotTitle,
  });
};

describe('The analyst project management assessment page', () => {
  // Test loading for Analyst role
  it('loads with analyst', () => {
    assessmentsSetup();
    cy.visit('/analyst/application/1/assessments/project-management');
    cy.contains('a', 'Project Management');
    cy.get('body').happoScreenshot({
      component: 'Analyst project management assessment page',
    });
  });

  // Test loading for CBC Admin role
  it('loads with CBC Admin', () => {
    testLoad(
      'Project Management assessment page with CBC Admin',
      assessmentsSetupLoginCbcAdmin
    );
  });

  // Test loading for Admin role
  it('loads with Admin', () => {
    testLoad(
      'Project Management assessment page with Admin',
      assessmentsSetupLoginAdmin
    );
  });

  // Test loading for Super Admin role
  it('loads with Super Admin', () => {
    testLoad(
      'Project Management assessment page with Super Admin',
      assessmentsSetupLoginSuperAdmin
    );
  });

  // Test for filling and saving the project management assessment form (Analyst role)
  it('fills and saves the project management assessment page', () => {
    assessmentsSetup();
    cy.visit('/analyst/application/1/assessments/project-management');
    cy.contains('a', 'Project Management');
    cy.wait('@graphql');
    cy.get('select[id="root_assignedTo"]').select('Meherzad Romer');
    cy.get('input[id="root_targetDate"]').invoke('val', '2023-03-10');
    cy.get('input[id="root_nextStep-1"]').parent().click();
    cy.contains('button', /^Save$/).click();
    cy.contains('button', 'Saved').should('exist');
    cy.visit('/analyst/application/1/assessments/project-management');
    cy.get('body').happoScreenshot({
      component: 'Filled Analyst project management assessment page',
    });
  });
});
