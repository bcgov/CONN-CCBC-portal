/* eslint-disable import/extensions */
import testSetup from './setup.cy.js';

describe('The admin List of analysts page', () => {
  beforeEach(() => {
    testSetup();
  });

  it('loads', () => {
    cy.visit('/analyst/admin/list-of-analysts');
    cy.contains('a', 'List of analysts');

    // Wait for page content to be present and allow animations to complete
    cy.wait(1000); // Give animations time to complete

    // Wait for overall UI stability
    cy.waitForStableUI({ timeout: 10000, stabilityTimeout: 500 });

    // Take screenshot with less aggressive animation checking
    cy.stableHappoScreenshot({
      component: 'The admin List of analysts page',
      waitForStable: true,
      clearHovers: true,
      ensureConsistent: false, // Skip the animation checks that are causing issues
    });
  });
});
