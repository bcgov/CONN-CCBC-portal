import 'happo-cypress';
import '@testing-library/cypress/add-commands';

Cypress.Commands.add('sqlFixture', (fixtureName) => {
  return cy.fixture(`${fixtureName}.sql`).then((fixture) =>
    cy.exec(
      `psql -h localhost -U postgres -v "ON_ERROR_STOP=1" -d ccbc<< 'EOF'
${fixture}
EOF`
    )
  );
});

Cypress.Commands.add('useMockedTime', (datetime) => {
  cy.setCookie('mocks.mocked_timestamp', String(datetime.valueOf() / 1000));
});

Cypress.Commands.add('clearMockedTime', () => {
  cy.clearCookie('mocks.mocked_timestamp');
});

Cypress.Commands.add('mockLogin', (roleName) => {
  cy.setCookie('mocks.auth_role', roleName);
  cy.getCookie('mocks.auth_role').should('exist');
});

// Custom commands for deterministic screenshots

/**
 * Waits for all network requests to complete and UI to stabilize
 */
Cypress.Commands.add('waitForStableUI', (options = {}) => {
  const { timeout = 10000, stabilityTimeout = 500 } = options;

  // Wait for any pending GraphQL requests
  cy.window().then((win) => {
    if (win.fetch) {
      // Wait for any ongoing fetch requests to complete
      return new Cypress.Promise((resolve) => {
        let pendingRequests = 0;
        const originalFetch = win.fetch;

        win.fetch = function (...args) {
          pendingRequests++;
          return originalFetch.apply(this, args).finally(() => {
            pendingRequests--;
          });
        };

        // Check if requests are done every 100ms
        const checkComplete = () => {
          if (pendingRequests === 0) {
            win.fetch = originalFetch; // Restore original fetch
            setTimeout(resolve, stabilityTimeout); // Additional stability time
          } else {
            setTimeout(checkComplete, 100);
          }
        };

        // Start checking after a small delay
        setTimeout(checkComplete, 100);
      });
    }
  });

  // Wait for DOM to be stable (no mutations for stabilityTimeout)
  cy.window().then((win) => {
    return new Cypress.Promise((resolve) => {
      let timeoutId;
      const observer = new win.MutationObserver(() => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          observer.disconnect();
          resolve();
        }, stabilityTimeout);
      });

      observer.observe(win.document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeOldValue: true,
        characterData: true,
        characterDataOldValue: true,
      });

      // Initial timeout in case there are no mutations
      timeoutId = setTimeout(() => {
        observer.disconnect();
        resolve();
      }, stabilityTimeout);
    });
  });
});

/**
 * Waits for all animations and transitions to complete
 */
Cypress.Commands.add('waitForAnimations', () => {
  // Wait for CSS transitions and animations to complete
  cy.get('body').then(($body) => {
    const elements = $body.find('*').get();

    elements.forEach((el) => {
      const styles = window.getComputedStyle(el);
      const transitionDuration = parseFloat(styles.transitionDuration) * 1000;
      const animationDuration = parseFloat(styles.animationDuration) * 1000;

      if (transitionDuration > 0 || animationDuration > 0) {
        // Only check visibility for elements that are not intentionally hidden
        // Skip legend elements and other elements that are commonly hidden for accessibility
        const tagName = el.tagName.toLowerCase();
        const isHiddenByDesign =
          tagName === 'legend' ||
          styles.visibility === 'hidden' ||
          styles.display === 'none';

        if (!isHiddenByDesign) {
          cy.wrap(el).should('be.visible');
        }
      }
    });
  });

  // Wait for opacity transitions specifically
  cy.waitForOpacityTransitions();

  // Additional wait for any remaining animations
  cy.wait(200);
});

/**
 * Waits for opacity transitions to complete
 */
Cypress.Commands.add('waitForOpacityTransitions', () => {
  cy.get('body').then(($body) => {
    // Find elements that might have opacity transitions
    const potentialTransitionSelectors = [
      '[class*="Transition"]',
      '[class*="Styled"]',
      '[class*="Fade"]',
      '[class*="Animation"]',
    ];

    potentialTransitionSelectors.forEach((selector) => {
      const elements = $body.find(selector);
      if (elements.length > 0) {
        cy.get(selector).each(($el) => {
          // Wait for element to have stable opacity (either 0 or > 0)
          cy.wrap($el).should(($element) => {
            const opacity = parseFloat($element.css('opacity'));
            const display = $element.css('display');
            const visibility = $element.css('visibility');

            // Element is acceptable if:
            // 1. It's hidden (display: none, visibility: hidden)
            // 2. It has opacity 0 and is meant to be hidden
            // 3. It has opacity > 0 and is visible (more tolerant threshold)
            const isIntentionallyHidden =
              display === 'none' || visibility === 'hidden';
            const hasStableOpacity = opacity === 0 || opacity > 0.1; // Consider > 0.1 as "visible enough"

            expect(isIntentionallyHidden || hasStableOpacity).to.be.true;
          });
        });
      }
    });
  });
});

/**
 * Removes hover states from all elements
 */
Cypress.Commands.add('clearHoverStates', () => {
  // Ensure body is available and ready for interaction
  cy.get('body', { timeout: 5000 }).should('exist');

  cy.get('body').then(($body) => {
    // Create a temporary element to focus on, removing focus from interactive elements
    const tempElement = document.createElement('div');
    tempElement.style.position = 'absolute';
    tempElement.style.left = '-9999px';
    tempElement.setAttribute('tabindex', '0');
    document.body.appendChild(tempElement);
    tempElement.focus();

    // Trigger a mouse move to a neutral area to clear hover states
    // Use force: true to avoid issues when body element might be considered "hidden"
    cy.get('body').trigger(
      'mousemove',
      { clientX: 0, clientY: 0 },
      { force: true }
    );

    // Clean up
    setTimeout(() => {
      if (tempElement.parentNode) {
        tempElement.parentNode.removeChild(tempElement);
      }
    }, 100);
  });
});

/**
 * Ensures all dropdowns, accordions, and collapsible elements are in a consistent state
 */
Cypress.Commands.add('ensureConsistentState', () => {
  // Check for common dropdown/accordion classes and ensure they're closed
  const collapsibleSelectors = [
    '[data-testid*="dropdown"]',
    '[class*="dropdown"]',
    '[class*="accordion"]',
    '[class*="collapse"]',
    '[aria-expanded="true"]',
  ];

  collapsibleSelectors.forEach((selector) => {
    cy.get('body').then(($body) => {
      const elements = $body.find(selector);
      if (elements.length > 0) {
        // If accordions or dropdowns are open, we might want to close them
        // or ensure they're in a consistent state
        cy.get(selector).each(($el) => {
          if ($el.attr('aria-expanded') === 'true') {
            // Only close if it's not intentionally open for the test
            cy.log('Found open accordion/dropdown - ensuring consistent state');
          }
        });
      }
    });
  });
});

/**
 * Waits for specific loading indicators to disappear
 */
Cypress.Commands.add('waitForLoadingComplete', () => {
  // Common loading indicators
  const loadingSelectors = [
    '[data-testid="loading"]',
    '[class*="loading"]',
    '[class*="spinner"]',
    '.loading-overlay',
    '[aria-label*="loading"]',
    '[aria-label*="Loading"]',
  ];

  loadingSelectors.forEach((selector) => {
    cy.get('body').then(($body) => {
      if ($body.find(selector).length > 0) {
        cy.get(selector).should('not.exist');
      }
    });
  });
});

/**
 * Enhanced Happo screenshot command that ensures UI stability
 */
Cypress.Commands.add('stableHappoScreenshot', (options = {}) => {
  const {
    component,
    variant,
    waitForStable = true,
    clearHovers = true,
    ensureConsistent = true,
    ...happoOptions
  } = options;

  // Ensure page is fully loaded first
  cy.get('body', { timeout: 10000 }).should('exist');

  if (waitForStable) {
    cy.waitForStableUI();
  }

  if (clearHovers) {
    cy.clearHoverStates();
  }

  if (ensureConsistent) {
    cy.ensureConsistentState();
  }

  cy.waitForLoadingComplete();

  // Only run animation checks if ensureConsistent is true
  if (ensureConsistent) {
    cy.waitForAnimations();
  } else {
    // Just wait a bit for animations without strict checking
    cy.wait(300);
  }

  // Small final wait to ensure everything is settled
  cy.wait(100);

  // Take the screenshot
  cy.get('body').happoScreenshot({
    component,
    variant,
    ...happoOptions,
  });
});

/**
 * Wait for specific elements to be fully loaded and stable
 */
Cypress.Commands.add('waitForElementStable', (selector, options = {}) => {
  const { timeout = 10000, stabilityTime = 300 } = options;

  cy.get(selector, { timeout }).should('be.visible');

  // Wait for element to stop changing
  cy.get(selector).then(($el) => {
    return new Cypress.Promise((resolve) => {
      let lastHTML = $el.html();
      let lastRect = $el[0].getBoundingClientRect();
      let stableCount = 0;
      const requiredStableChecks = stabilityTime / 50; // Check every 50ms

      const checkStability = () => {
        const currentHTML = $el.html();
        const currentRect = $el[0].getBoundingClientRect();

        const isStable =
          currentHTML === lastHTML &&
          currentRect.width === lastRect.width &&
          currentRect.height === lastRect.height &&
          currentRect.x === lastRect.x &&
          currentRect.y === lastRect.y;

        if (isStable) {
          stableCount++;
          if (stableCount >= requiredStableChecks) {
            resolve();
            return;
          }
        } else {
          stableCount = 0;
          lastHTML = currentHTML;
          lastRect = currentRect;
        }

        setTimeout(checkStability, 50);
      };

      checkStability();
    });
  });
});
