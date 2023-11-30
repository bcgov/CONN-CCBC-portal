/* eslint-disable import/extensions */
import testSetup from './setup.cy.js';

describe('The admin List of analysts page', () => {
  beforeEach(() => {
    testSetup();
  });

  it('loads', () => {
    cy.visit('/analyst/admin/list-of-analysts');
    cy.contains('a', 'List of analysts');
    cy.get('body').happoScreenshot({
      component: 'The admin List of analysts page',
    });
  });
});
