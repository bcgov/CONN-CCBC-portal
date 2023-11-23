/* eslint-disable import/extensions */
import testSetup from './setup.cy.js';

describe('The admin Download attachments page', () => {
  beforeEach(() => {
    testSetup();
  });

  it('loads', () => {
    cy.visit('/analyst/admin/download-attachments');
    cy.contains('a', 'Download attachments');
    cy.get('body').happoScreenshot({
      component: 'The admin Download attachments page',
    });
  });
});
