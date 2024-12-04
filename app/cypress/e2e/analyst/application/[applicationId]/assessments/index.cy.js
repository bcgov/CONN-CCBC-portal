/* eslint-disable import/extensions */
import assessmentsSetup, {
  assessmentsSetupLoginAdmin,
  assessmentsSetupLoginCbcAdmin,
  assessmentsSetupLoginSuperAdmin,
} from './setup.cy.js';

const testLoad = (screenShotTitle, setupFunction) => {
  setupFunction();
  cy.visit('/analyst/application/1/assessments');
  cy.contains('h2', 'Assessments');
  cy.get('body').happoScreenshot({
    component: screenShotTitle,
  });
};

describe('The analyst assessments dashboard view', () => {
  it('loads with analyst', () => {
    assessmentsSetup();
    cy.visit('/analyst/application/1/assessments');
    cy.contains('h2', 'Assessments');
    cy.get('body').happoScreenshot({
      component: 'Analyst assessments dashboard',
    });
  });

  it('loads with CBC Admin', () => {
    testLoad(
      'Analyst assessments dashboard with CBC Admin',
      assessmentsSetupLoginCbcAdmin
    );
  });

  it('loads with Admin', () => {
    testLoad(
      'Analyst assessments dashboard with Admin',
      assessmentsSetupLoginAdmin
    );
  });

  it('loads with Super Admin', () => {
    testLoad(
      'Analyst assessments dashboard with Super Admin',
      assessmentsSetupLoginSuperAdmin
    );
  });
});
