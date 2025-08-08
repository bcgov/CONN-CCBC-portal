/**
 * Helper functions for creating deterministic Happo screenshots
 * These helpers address common scenarios that cause false positive diffs
 */

/**
 * Waits for form auto-save to complete before taking screenshot
 */
Cypress.Commands.add('waitForAutoSave', (options = {}) => {
  const { timeout = 5000 } = options;

  // Look for "Last saved" indicator or similar
  cy.get('body').then(($body) => {
    if (
      $body.find('[data-testid*="last-saved"], *:contains("Last saved")')
        .length > 0
    ) {
      cy.get('[data-testid*="last-saved"], *:contains("Last saved")', {
        timeout,
      }).should('be.visible');

      // Wait a bit more to ensure save is actually complete
      cy.wait(300);
    }
  });
});

/**
 * Ensures all dropdowns are closed before screenshot
 */
Cypress.Commands.add('closeAllDropdowns', () => {
  // Ensure body is available and ready for interaction
  cy.get('body', { timeout: 5000 }).should('exist');

  cy.get('body').then(($body) => {
    // Click on body to close any open dropdowns
    // Use force: true to avoid issues when body element might be considered "hidden"
    cy.get('body').click(0, 0, { force: true });

    // Wait for dropdowns to close
    cy.wait(200);

    // Check for common dropdown indicators and close them
    const dropdownSelectors = [
      '[data-testid*="dropdown"].open',
      '[aria-expanded="true"]',
      '.dropdown-menu.show',
      '.select__menu',
      '[class*="dropdown"][class*="open"]',
    ];

    dropdownSelectors.forEach((selector) => {
      if ($body.find(selector).length > 0) {
        cy.get(selector).should('not.be.visible');
      }
    });
  });
});

/**
 * Waits for all tables to finish loading and sorting
 */
Cypress.Commands.add(
  'waitForTableStable',
  (tableSelector = 'table', options = {}) => {
    const { timeout = 10000, stabilityTime = 500 } = options;

    // First check if table exists, if not, skip table-specific waits
    cy.get('body').then(($body) => {
      if ($body.find(tableSelector).length > 0) {
        cy.get(tableSelector, { timeout }).should('be.visible');

        // Wait for table content to stabilize
        cy.waitForElementStable(`${tableSelector} tbody`, {
          timeout,
          stabilityTime,
        });

        // Check for loading indicators in table
        cy.get(tableSelector).within(() => {
          const loadingSelectors = [
            '[data-testid*="loading"]',
            '.loading',
            '.spinner',
            '[aria-label*="loading"]',
          ];

          loadingSelectors.forEach((selector) => {
            cy.root().then(($tableElement) => {
              if ($tableElement.find(selector).length > 0) {
                cy.get(selector).should('not.exist');
              }
            });
          });
        });
      } else {
        // If no table found, just wait for general UI stability
        cy.waitForStableUI({ stabilityTimeout: stabilityTime });
      }
    });
  }
);

/**
 * Handles form interactions that commonly cause screenshot issues
 */
Cypress.Commands.add(
  'stableFormInteraction',
  (selector, action, options = {}) => {
    const { waitAfter = 300, ensureVisible = true } = options;

    if (ensureVisible) {
      cy.get(selector).scrollIntoView();
      cy.waitForElementStable(selector);
    }

    // Perform the action
    if (typeof action === 'function') {
      action();
    } else if (action.type === 'click') {
      cy.get(selector).click(action.options || {});
    } else if (action.type === 'type') {
      cy.get(selector)
        .clear()
        .type(action.text, action.options || {});
    } else if (action.type === 'select') {
      cy.get(selector).select(action.value);
    }

    // Wait for any resulting changes to stabilize
    cy.wait(waitAfter);
    cy.waitForStableUI({ stabilityTimeout: 200 });
  }
);

/**
 * Specialized command for file upload scenarios
 */
Cypress.Commands.add('stableFileUpload', (selector, filePath, options = {}) => {
  const { waitForProcessing = true, processingTimeout = 5000 } = options;

  // Ensure file input is ready
  cy.waitForElementStable(selector);

  // Perform file selection
  cy.get(selector).selectFile(filePath, { force: true });

  if (waitForProcessing) {
    // Wait for file processing indicators
    cy.wait(500); // Initial processing time

    // Look for file name appearing or other processing completion indicators
    const fileName = filePath.split('/').pop();
    cy.contains(fileName, { timeout: processingTimeout });

    // Wait for UI to stabilize after file processing
    cy.waitForStableUI({ stabilityTimeout: 300 });
  }
});

/**
 * Command for handling modals/dialogs consistently
 */
Cypress.Commands.add(
  'waitForModalStable',
  (modalSelector = '[role="dialog"], .modal', options = {}) => {
    const { timeout = 5000, stabilityTime = 300 } = options;

    cy.get(modalSelector, { timeout }).should('be.visible');
    cy.waitForElementStable(modalSelector, { stabilityTime });

    // Ensure modal content is loaded
    cy.get(modalSelector).within(() => {
      cy.waitForStableUI({ stabilityTimeout: 200 });
    });
  }
);

/**
 * Command for handling button states (disabled, loading, etc.)
 */
Cypress.Commands.add('waitForButtonReady', (buttonSelector, options = {}) => {
  const { timeout = 5000, shouldBeEnabled = true } = options;

  cy.get(buttonSelector, { timeout }).should('be.visible');

  if (shouldBeEnabled) {
    cy.get(buttonSelector).should('not.be.disabled');
  }

  // Wait for any loading states to finish
  cy.get(buttonSelector).within(() => {
    cy.get('body').then(($body) => {
      const loadingSelectors = [
        '.loading',
        '.spinner',
        '[data-testid*="loading"]',
      ];

      loadingSelectors.forEach((selector) => {
        if ($body.find(selector).length > 0) {
          cy.get(selector).should('not.exist');
        }
      });
    });
  });

  cy.waitForElementStable(buttonSelector, { stabilityTime: 200 });
});

/**
 * Enhanced screenshot command for specific page types
 */
Cypress.Commands.add(
  'screenshotPage',
  (component, pageType = 'general', options = {}) => {
    const defaultOptions = {
      waitForStable: true,
      clearHovers: true,
      ensureConsistent: true,
      closeDropdowns: true,
      waitForAutoSave: false,
      ...options,
    };

    // Page-specific handling
    switch (pageType) {
      case 'dashboard':
        cy.waitForTableStable('[data-testid="dashboard-table"], table');
        break;

      case 'form':
        if (defaultOptions.waitForAutoSave) {
          cy.waitForAutoSave();
        }
        break;

      case 'upload':
        // Additional wait for file processing
        cy.waitForStableUI({ stabilityTimeout: 500 });
        break;

      case 'modal':
        cy.waitForModalStable();
        break;
    }

    if (defaultOptions.closeDropdowns) {
      cy.closeAllDropdowns();
    }

    // Take the screenshot using our stable command
    cy.stableHappoScreenshot({
      component,
      ...defaultOptions,
    });
  }
);
